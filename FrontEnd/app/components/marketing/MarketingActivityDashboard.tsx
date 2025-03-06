"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Typography, TextField, InputAdornment, Card, CardContent, Drawer } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { FilterBar } from "./FilterBar";
import { KanbanBoard } from "./KanbanBoard";
import { InterviewSidebar } from "./InterviewSidebar";
import { ApplicationCountsSidebar } from "./ApplicationCountsSidebar";
import { AddInterviewButton } from "./AddInterviewButton";
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
import { Button } from "@/ui/button";

// Helper function to build query string (updated to ensure non-empty output)
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
    const startDate = new Date(filters.dateRange[0]).toISOString().split("T")[0];
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
  // Ensure a non-empty query by adding a default if parts is empty
  return parts.length > 0 ? parts.join(" ") : "all"; // Default to "all" to satisfy backend
};

export default function MarketingActivityDashboard() {
  const [standupMode, setStandupMode] = useState(true);
  const [selectedInterview, setSelectedInterview] =
    useState<MarketingInterview | null>(null);
  const [isAddingInterview, setIsAddingInterview] = useState(false);
  const [isApplicationCountsOpen, setIsApplicationCountsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search
  const [quickFilters, setQuickFilters] = useState<string[]>([]); // New state for quick filters
  const [filters, setFilters] = useState<FilterState>({
    recruiter: "all",
    dateRange: [null, null],
    status: "all",
    type: "all",
    searchQuery: "", // Ensure all FilterState properties are initialized
    quickFilters: [], // Ensure all FilterState properties are initialized
  });
  const [clients, setClients] = useState<MarketingClient[]>([]);
  const [recruiters, setRecruiters] = useState<MarketingRecruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interviewStats, setInterviewStats] = useState<MarketingInterviewStats[]>([]);
  const [applicationCounts, setApplicationCounts] = useState<Record<string, MarketingActivityCount>>({});

  // Memoize the query and quickFilters JSON to prevent unnecessary re-fetches
  const query = useMemo(() => buildQueryString(filters), [filters]);
  const quickFiltersJson = useMemo(() => JSON.stringify(quickFilters || []), [quickFilters]);

  // Use useCallback for event handlers to prevent unnecessary re-renders
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleQuickFilterToggle = useCallback((filter: string) => {
    setQuickFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  }, []);

  // Load data only when query or quickFilters change, with debouncing and cleanup
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (!mounted) return;

      try {
        setLoading(true);
        const today = new Date().toISOString().split("T")[0];
        const [fetchedClients, fetchedRecruiters, stats, counts] = await Promise.all([
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

    // Debounce the API call (e.g., 300ms delay)
    const timer = setTimeout(loadData, 300);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [query, quickFiltersJson]); // Depend on memoized values to prevent infinite loops

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
                  c.screeningCount + (newInterview.type === "Screening" ? 1 : 0),
                technicalCount:
                  c.technicalCount + (newInterview.type === "Technical" ? 1 : 0),
                finalRoundCount:
                  c.finalRoundCount + (newInterview.type === "Final Round" ? 1 : 0),
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
          ApplicationCountID: 0, // Default value (to be updated by backend)
          CreatedTS: new Date(),
          UpdatedTS: new Date(),
          CreatedBy: "system", // Default value
          UpdatedBy: "system", // Default value
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

  // Filter clients to match wireframe logic for activity today
  const filteredClients = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return clients.filter((client) =>
      client.interviews.some(
        (interview) => interview.date === today
      )
    );
  }, [clients]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", p: 4, color: "#682A53" }}>
        Loading marketing activity...
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "white" }}>
      {/* Left Sidebar - Recruiters */}
      <Box sx={{ width: 250, borderRight: "1px solid #682A53", p: 2, overflowY: "auto" }}>
        <Typography variant="h6" gutterBottom sx={{ color: "#682A53" }}>
          Recruiters
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton 
              selected={filters.recruiter === "all"} 
              onClick={() => handleQuickFilterToggle("all")}
              sx={{ 
                "&.Mui-selected": { bgcolor: "#FDC500", color: "#682A53" },
                "&:hover": { bgcolor: "#682A53", color: "white" }
              }}
            >
              <ListItemText primary="All Recruiters" />
            </ListItemButton>
          </ListItem>
          {recruiters
            .filter((recruiter) => recruiter.id && recruiter.id.trim() !== "")
            .map((recruiter) => (
              <ListItem key={recruiter.id} disablePadding>
                <ListItemButton
                  selected={filters.recruiter === recruiter.id}
                  onClick={() => handleQuickFilterToggle(recruiter.id)}
                  sx={{ 
                    "&.Mui-selected": { bgcolor: "#FDC500", color: "#682A53" },
                    "&:hover": { bgcolor: "#682A53", color: "white" }
                  }}
                >
                  <ListItemText primary={recruiter.name || `Recruiter #${recruiter.id}`} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Box>

      {/* Middle Section - Client Board and Summary */}
      <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#682A53" }}>
          Marketing Activity Dashboard
        </Typography>
        <TextField
          fullWidth
          label="Search Clients"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderColor: "#682A53/20" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#682A53" }} />
              </InputAdornment>
            ),
          }}
        />

        <Card sx={{ mb: 2, border: "1px solid #682A53/10", bgcolor: "white" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: "#682A53" }}>
              Summary
            </Typography>
            <Typography sx={{ color: "#682A53" }}>
              Total Clients: {clients.length} | Clients with Activity Today: {filteredClients.length}
            </Typography>
          </CardContent>
        </Card>

        <KanbanBoard
          clients={clients}
          filters={{ ...filters, searchQuery, quickFilters }}
          standupMode={standupMode}
          onInterviewClick={handleInterviewClick}
          onAddInterview={() => setIsAddingInterview(true)}
        />
      </Box>

      {/* Right Sidebar (Interview Details Drawer) */}
      <Drawer
        anchor="right"
        open={!!selectedInterview || isAddingInterview}
        onClose={handleCloseInterview}
        sx={{ width: 300, "& .MuiDrawer-paper": { width: 300, bgcolor: "white", borderLeft: "1px solid #682A53" } }}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: "#682A53" }}>
            Interview Details
          </Typography>
          <InterviewSidebar
            interview={selectedInterview}
            isOpen={!!selectedInterview || isAddingInterview}
            onClose={handleCloseInterview}
            onUpdate={handleUpdateInterview}
            onAdd={handleAddInterview}
          />
        </Box>
      </Drawer>

      {/* Application Counts Sidebar (Drawer) */}
      <Drawer
        anchor="right"
        open={isApplicationCountsOpen}
        onClose={handleCloseApplicationCounts}
        sx={{ width: 300, "& .MuiDrawer-paper": { width: 300, bgcolor: "white", borderLeft: "1px solid #682A53" } }}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: "#682A53" }}>
            Application Counts
          </Typography>
          <ApplicationCountsSidebar
            isOpen={isApplicationCountsOpen}
            onClose={handleCloseApplicationCounts}
            clients={clients}
            onSubmit={handleSubmitApplicationCounts}
            applicationCounts={applicationCounts}
          />
        </Box>
      </Drawer>

      {/* Error Display */}
      {error && (
        <Box sx={{ p: 4, bgcolor: "white", color: "red" }}>
          {error}
        </Box>
      )}
    </Box>
  );
}