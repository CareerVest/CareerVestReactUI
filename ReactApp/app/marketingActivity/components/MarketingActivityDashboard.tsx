"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  CircularProgress,
  useMediaQuery,
  IconButton,
  Typography,
  Drawer,
} from "@mui/material";
import { FilterBar } from "./FilterBar";
import { KanbanBoard } from "./KanbanBoard";
import { InterviewSidebar } from "./InterviewSidebar";
import { ApplicationCountsSidebar } from "./ApplicationCountsSidebar";
import type {
  MarketingInterview,
  FilterState,
  MarketingClient,
  MarketingRecruiter,
} from "../../types/MarketingActivity/Marketing";
import {
  fetchClients,
  fetchClientsWithFilters,
  fetchMarketingActivitiesForDate,
  fetchInterviewStats,
  fetchRecruiters,
} from "../actions/MarketingActivityActions";
import {
  MarketingInterviewStats,
  MarketingActivityCount,
} from "@/app/types/MarketingActivity/Marketing";

// Helper function to build query string
const buildQueryString = (filters: FilterState): string => {
  const parts: string[] = [];
  if (filters.recruiter && filters.recruiter !== "all") {
    parts.push(`client:${filters.recruiter}`);
  }
  if (filters.status && filters.status !== "all") {
    parts.push(`status:${filters.status}`);
  }
  if (filters.type && filters.type !== "all") {
    parts.push(`type:${filters.type}`);
  }
  if (filters.dateRange[0] && filters.dateRange[1]) {
    const startDate = new Date(filters.dateRange[0])
      .toISOString()
      .split("T")[0];
    const endDate = new Date(filters.dateRange[1]).toISOString().split("T")[0];
    if (startDate === endDate) {
      parts.push(startDate);
    } else {
      parts.push(`${startDate} to ${endDate}`);
    }
  }
  if (filters.searchQuery) {
    parts.push(filters.searchQuery);
  }
  return parts.length > 0 ? parts.join(" ") : "all";
};

export default function MarketingActivityDashboard() {
  const [standupMode, setStandupMode] = useState(true);
  const [selectedInterview, setSelectedInterview] =
    useState<MarketingInterview | null>(null);
  const [isAddingInterview, setIsAddingInterview] = useState(false);
  const [isApplicationCountsOpen, setIsApplicationCountsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quickFilters, setQuickFilters] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    recruiter: "all",
    dateRange: [null, null],
    status: "all",
    type: "all",
    searchQuery: "",
    quickFilters: [],
  });
  const [clients, setClients] = useState<MarketingClient[]>([]);
  const [recruiters, setRecruiters] = useState<MarketingRecruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interviewStats, setInterviewStats] = useState<
    MarketingInterviewStats[]
  >([]);
  const [applicationCounts, setApplicationCounts] = useState<
    Record<string, MarketingActivityCount>
  >({});

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const query = useMemo(() => buildQueryString(filters), [filters]);
  const quickFiltersJson = useMemo(
    () => JSON.stringify(quickFilters || []),
    [quickFilters]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleQuickFilterToggle = useCallback((filter: string) => {
    setQuickFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (!mounted) return;

      try {
        setLoading(true);
        const today = new Date().toISOString().split("T")[0];
        const [fetchedClients, fetchedRecruiters, stats, counts] =
          await Promise.all([
            fetchClientsWithFilters(query, quickFiltersJson),
            fetchRecruiters(),
            fetchInterviewStats(today),
            fetchMarketingActivitiesForDate(today),
          ]);
        if (mounted) {
          setClients(fetchedClients || []);
          setRecruiters(fetchedRecruiters || []);
          setInterviewStats(stats || []);
          setApplicationCounts(
            counts.length > 0
              ? counts.reduce(
                  (acc, count) => ({
                    ...acc,
                    [count.ClientID.toString()]: count,
                  }),
                  {}
                )
              : {}
          );
          setError(null);
        }
      } catch (err: any) {
        if (mounted) {
          console.error("❌ Failed to fetch data for marketing activity:", err);
          setError(
            err.response?.status === 400
              ? "Invalid filter parameters. Please adjust your filters and try again."
              : "Failed to load data. Please check your filters or try again later."
          );
          setClients([]);
          setRecruiters([]);
          setInterviewStats([]);
          setApplicationCounts({});
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const timer = setTimeout(loadData, 300);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [query, quickFiltersJson]);

  const handleInterviewClick = (interview: MarketingInterview) => {
    setSelectedInterview(interview);
    setIsApplicationCountsOpen(false);
  };

  const handleCloseInterview = () => {
    setSelectedInterview(null);
    setIsAddingInterview(false);
  };

  const handleUpdateInterview = (updatedInterview: MarketingInterview) => {
    console.log("Updating interview:", updatedInterview);
    setSelectedInterview(null);
    setClients((prevClients) =>
      prevClients.map((client) => ({
        ...client,
        interviews: client.interviews.map((i) =>
          i.id === updatedInterview.id ? updatedInterview : i
        ),
      }))
    );
  };

  const handleAddInterview = (newInterview: MarketingInterview) => {
    console.log("Adding new interview:", newInterview);
    setIsAddingInterview(false);
    setClients((prevClients) => {
      const client = prevClients.find((c) => c.id === newInterview.clientId);
      if (client) {
        return prevClients.map((c) =>
          c.id === newInterview.clientId
            ? {
                ...c,
                interviews: [...c.interviews, newInterview],
                screeningCount:
                  c.screeningCount +
                  (newInterview.type === "Screening" ? 1 : 0),
                technicalCount:
                  c.technicalCount +
                  (newInterview.type === "Technical" ? 1 : 0),
                finalRoundCount:
                  c.finalRoundCount +
                  (newInterview.type === "Final Round" ? 1 : 0),
              }
            : c
        );
      }
      return prevClients;
    });
  };

  const handleOpenApplicationCounts = () => {
    setIsApplicationCountsOpen(true);
    setSelectedInterview(null);
    setIsAddingInterview(false);
  };

  const handleCloseApplicationCounts = () => {
    setIsApplicationCountsOpen(false);
  };

  const handleSubmitApplicationCounts = async (
    counts: Record<
      string,
      {
        totalManualApplications: number;
        totalEasyApplications: number;
        totalReceivedInterviews: number;
      }
    >
  ) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const updatedCounts: Record<string, MarketingActivityCount> = {};
      for (const [clientId, count] of Object.entries(counts)) {
        console.log(`Submitting counts for client ${clientId}:`, count);
        updatedCounts[clientId] = {
          ClientID: parseInt(clientId),
          ClientName: clients.find((c) => c.id === clientId)?.name || "",
          Date: new Date(today),
          TotalManualApplications: count.totalManualApplications,
          TotalEasyApplications: count.totalEasyApplications,
          TotalReceivedInterviews: count.totalReceivedInterviews,
          ApplicationCountID: 0,
          CreatedTS: new Date(),
          UpdatedTS: new Date(),
          CreatedBy: "system",
          UpdatedBy: "system",
        };
      }
      setApplicationCounts((prev) => ({
        ...prev,
        ...updatedCounts,
      }));
      handleCloseApplicationCounts();
    } catch (err) {
      setError("Failed to submit application counts. Please try again.");
      console.error("❌ Error submitting application counts:", err);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          overflowY: "auto",
        }}
      >
        {/* Filter Panel (Left Column) */}
        <Box
          sx={{
            width: isSmallScreen ? "100%" : 250,
            bgcolor: "white",
            borderRadius: 2,
            border: "1px solid rgba(104, 42, 83, 0.1)",
            p: 2,
            mb: isSmallScreen ? 2 : 0,
          }}
        >
          <FilterBar
            filters={filters}
            onFiltersChange={(newFilters) => {
              if (
                newFilters.recruiter !== filters.recruiter ||
                newFilters.dateRange !== filters.dateRange ||
                newFilters.status !== filters.status ||
                newFilters.type !== filters.type ||
                newFilters.searchQuery !== filters.searchQuery ||
                JSON.stringify(newFilters.quickFilters) !==
                  JSON.stringify(filters.quickFilters)
              ) {
                setFilters(newFilters);
                setSearchQuery(newFilters.searchQuery || "");
                setQuickFilters(newFilters.quickFilters || []);
              }
            }}
            standupMode={standupMode}
            onStandupModeChange={setStandupMode}
            recruiters={recruiters}
            onAddInterview={() => setIsAddingInterview(true)}
            onOpenApplicationCounts={handleOpenApplicationCounts}
          />
        </Box>

        {/* Main Content (Right Column) */}
        <Box sx={{ flexGrow: 1, p: isSmallScreen ? 2 : 0, overflowY: "auto" }}>
          <KanbanBoard
            clients={clients}
            filters={{ ...filters, searchQuery, quickFilters }}
            standupMode={standupMode}
            onInterviewClick={handleInterviewClick}
            onAddInterview={() => setIsAddingInterview(true)}
            applicationCounts={applicationCounts}
          />

          {/* Interview Sidebar */}
          <Drawer
            anchor="right"
            open={!!selectedInterview || isAddingInterview}
            onClose={handleCloseInterview}
            sx={{
              "& .MuiDrawer-paper": {
                width: { xs: "100%", sm: "540px" },
                boxSizing: "border-box",
                padding: 3,
                borderLeft: "1px solid rgba(104, 42, 83, 0.1)",
                bgcolor: "white",
              },
            }}
          >
            <Box sx={{ pt: 2 }}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h5"
                  sx={{ color: "#682A53", fontWeight: 600 }}
                >
                  {selectedInterview
                    ? "Interview Details"
                    : "Add New Interview"}
                </Typography>
              </Box>
              <InterviewSidebar
                interview={selectedInterview}
                isOpen={!!selectedInterview || isAddingInterview}
                onClose={handleCloseInterview}
                onUpdate={handleUpdateInterview}
                onAdd={handleAddInterview}
              />
            </Box>
          </Drawer>

          {/* Application Counts Sidebar */}
          <Drawer
            anchor="right"
            open={isApplicationCountsOpen}
            onClose={handleCloseApplicationCounts}
            sx={{
              "& .MuiDrawer-paper": {
                width: { xs: "100%", sm: "540px" },
                boxSizing: "border-box",
                padding: 3,
                borderLeft: "1px solid rgba(104, 42, 83, 0.1)",
                bgcolor: "white",
              },
            }}
          >
            <Box sx={{ pt: 2 }}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h5"
                  sx={{ color: "#682A53", fontWeight: 600 }}
                >
                  Daily Application Counts
                </Typography>
              </Box>
              <ApplicationCountsSidebar
                isOpen={isApplicationCountsOpen}
                onClose={handleCloseApplicationCounts}
                clients={clients}
                onSubmit={handleSubmitApplicationCounts}
                applicationCounts={applicationCounts}
              />
            </Box>
          </Drawer>

          {error && (
            <Box sx={{ p: 2, color: "red", bgcolor: "white" }}>{error}</Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
