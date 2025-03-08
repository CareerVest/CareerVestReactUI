"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  CircularProgress,
  useMediaQuery,
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
  StandupDashboard,
  FilteredDashboard,
  MarketingApplicationCount,
} from "../../types/MarketingActivity/Marketing";
import {
  fetchStandupDashboardData,
  fetchFilteredDashboardData,
} from "../actions/MarketingActivityActions";
import { getRecruiters } from "@/app/employees/actions/employeeActions";

const buildQueryString = (filters: FilterState): string => {
  const parts: string[] = [];
  if (filters.recruiter) parts.push(`client:${filters.recruiter}`);
  if (filters.status && filters.status !== "all")
    parts.push(`status:${filters.status}`);
  if (filters.type && filters.type !== "all")
    parts.push(`type:${filters.type}`);
  if (filters.dateRange[0] && filters.dateRange[1]) {
    const startDate = new Date(filters.dateRange[0])
      .toISOString()
      .split("T")[0];
    const endDate = new Date(filters.dateRange[1]).toISOString().split("T")[0];
    parts.push(
      startDate === endDate ? startDate : `${startDate} to ${endDate}`
    );
  }
  if (filters.searchQuery) parts.push(filters.searchQuery);
  return parts.length > 0 ? parts.join(" ") : "all";
};

const normalizeClientInterviews = (client: any): MarketingClient => ({
  ...client,
  interviews:
    client.interviews && client.interviews.$values
      ? client.interviews.$values
      : Array.isArray(client.interviews)
      ? client.interviews
      : [],
});

const transformClientListToMarketingClient = (
  client: any,
  recruiterMap: Record<string, MarketingRecruiter>,
  clientCounts: Record<number, any> | null
): MarketingClient => {
  const interviews: MarketingInterview[] = Array.isArray(client.interviews)
    ? client.interviews
    : [];
  const counts = countInterviews(interviews);
  return {
    clientID: client.clientID ?? 0,
    clientName: client.clientName || "Unknown Client",
    clientStatus: client.clientStatus || "",
    recruiterID: client.recruiterID ?? null,
    recruiterName: client.recruiterName ?? null,
    interviews: interviews.map((i: any) => ({
      ...i,
      technology: i.technology ?? null,
      time: i.time ?? null,
      company: i.company ?? null,
    })),
    applicationCount:
      clientCounts && clientCounts[client.clientID]
        ? clientCounts[client.clientID]
        : null,
    screeningCount: counts.screening,
    technicalCount: counts.technical,
    finalRoundCount: counts.finalRound,
  };
};

const transformApplicationCountToClient = (
  clientId: number,
  appCount: any
): MarketingApplicationCount => ({
  applicationCountID: appCount.applicationCountID ?? 0,
  clientID: clientId,
  clientName: appCount.clientName || "Unknown Client",
  recruiterID: appCount.recruiterID ?? null,
  date: appCount.date || new Date().toISOString().split("T")[0],
  totalManualApplications: appCount.totalManualApplications ?? 0,
  totalEasyApplications: appCount.totalEasyApplications ?? 0,
  totalReceivedInterviews: appCount.totalReceivedInterviews ?? 0,
  createdTS: appCount.createdTS || new Date().toISOString(),
  updatedTS: appCount.updatedTS || new Date().toISOString(),
  createdBy: appCount.createdBy || "system",
  updatedBy: appCount.updatedBy || "system",
});

const countInterviews = (
  interviews: MarketingInterview[]
): { screening: number; technical: number; finalRound: number } => {
  return interviews.reduce(
    (
      acc: { screening: number; technical: number; finalRound: number },
      interview: MarketingInterview
    ) => {
      switch (interview.interviewType) {
        case "Screening":
        case "Other (Comment Needed)":
          acc.screening++;
          break;
        case "Technical":
        case "Technical1":
        case "Technical2":
        case "Technical3":
        case "Technical Round 1":
          acc.technical++;
          break;
        case "Final Discussion":
        case "Final Round":
          acc.finalRound++;
          break;
      }
      return acc;
    },
    { screening: 0, technical: 0, finalRound: 0 }
  );
};

export default function MarketingActivityDashboard() {
  const [standupMode, setStandupMode] = useState(true);
  const [selectedInterview, setSelectedInterview] =
    useState<MarketingInterview | null>(null);
  const [activeInterviewId, setActiveInterviewId] = useState<number | null>(
    null
  );
  const [isAddingInterview, setIsAddingInterview] = useState(false);
  const [isApplicationCountsOpen, setIsApplicationCountsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quickFilters, setQuickFilters] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    recruiter: "", // Initial empty state
    dateRange: [null, null],
    status: "all",
    type: "all",
    searchQuery: "",
    quickFilters: [],
  });
  const [receivedClients, setReceivedClients] = useState<MarketingClient[]>([]);
  const [scheduledClients, setScheduledClients] = useState<MarketingClient[]>(
    []
  );
  const [applicationClients, setApplicationClients] = useState<
    Record<string, MarketingApplicationCount>
  >({});
  const [recruiters, setRecruiters] = useState<MarketingRecruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayStats, setTodayStats] = useState<{
    received: {
      total: number;
      screening: number;
      technical: number;
      finalRound: number;
    };
    scheduled: {
      total: number;
      screening: number;
      technical: number;
      finalRound: number;
    };
  } | null>(null);

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const query = useMemo(() => buildQueryString(filters), [filters]);

  useEffect(() => {
    let mounted = true;

    const initializeData = async () => {
      try {
        console.log("Fetching recruiters...");
        setLoading(true);
        const recruiterData = (await getRecruiters()).$values || [];
        const mappedRecruiters = recruiterData.map((r: any) => ({
          id: r.employeeID.toString(),
          name: `${r.firstName} ${r.lastName}` || "Unknown Recruiter",
        }));
        if (mounted) {
          console.log("Recruiters fetched:", mappedRecruiters);
          setRecruiters(mappedRecruiters);
          // Always set to first recruiter on mount
          if (mappedRecruiters.length > 0) {
            setFilters((prev) => ({
              ...prev,
              recruiter: mappedRecruiters[0].id,
            }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch recruiters:", err);
        if (mounted) setError("Failed to load recruiters.");
      } finally {
        if (mounted) {
          console.log("Initial fetch complete, setting loading to false");
          setLoading(false);
        }
      }
    };

    initializeData();
    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array ensures this runs only on mount

  useEffect(() => {
    if (!filters.recruiter || recruiters.length === 0) {
      console.log("Waiting for recruiter or recruiters array:", {
        recruiter: filters.recruiter,
        recruitersLength: recruiters.length,
      });
      return;
    }

    let mounted = true;

    const loadData = async () => {
      try {
        console.log(
          "Fetching dashboard data for recruiter:",
          filters.recruiter
        );
        setLoading(true);
        const recruiterMap: Record<string, MarketingRecruiter> =
          recruiters.reduce((acc, r) => ({ ...acc, [r.id]: r }), {});

        if (standupMode) {
          const response = await fetchStandupDashboardData(
            parseInt(filters.recruiter)
          );
          console.log("Standup data response:", response);

          const clientCounts = response.applicationCounts?.clientCounts || null;

          const receivedClientsList = Object.values(
            response.todaysReceivedInterviews?.clients || {}
          )
            .map(normalizeClientInterviews)
            .filter(
              (client): client is MarketingClient =>
                !!client && Array.isArray(client.interviews)
            )
            .map((client) =>
              transformClientListToMarketingClient(
                client,
                recruiterMap,
                clientCounts
              )
            );

          const scheduledClientsList = Object.values(
            response.todaysScheduledInterviews?.clients || {}
          )
            .map(normalizeClientInterviews)
            .filter(
              (client): client is MarketingClient =>
                !!client && Array.isArray(client.interviews)
            )
            .map((client) =>
              transformClientListToMarketingClient(
                client,
                recruiterMap,
                clientCounts
              )
            );

          const applicationClientsList = clientCounts
            ? Object.entries(clientCounts).reduce(
                (acc, [clientId, appCount]) => {
                  acc[clientId] = transformApplicationCountToClient(
                    parseInt(clientId),
                    appCount
                  );
                  return acc;
                },
                {} as Record<string, MarketingApplicationCount>
              )
            : {};

          if (mounted) {
            setReceivedClients(receivedClientsList);
            setScheduledClients(scheduledClientsList);
            setApplicationClients(applicationClientsList);
            setTodayStats({
              received: {
                total: response.todaysReceivedInterviews?.total || 0,
                screening: response.todaysReceivedInterviews?.screening || 0,
                technical: response.todaysReceivedInterviews?.technical || 0,
                finalRound: response.todaysReceivedInterviews?.finalRound || 0,
              },
              scheduled: {
                total: response.todaysScheduledInterviews?.total || 0,
                screening: response.todaysScheduledInterviews?.screening || 0,
                technical: response.todaysScheduledInterviews?.technical || 0,
                finalRound: response.todaysScheduledInterviews?.finalRound || 0,
              },
            });
            setError(null);
          }
        } else {
          const response = await fetchFilteredDashboardData(
            parseInt(filters.recruiter),
            undefined,
            filters.status !== "all" ? filters.status : undefined,
            filters.type !== "all" ? filters.type : undefined,
            filters.dateRange
          );
          console.log("Filtered data response:", response);
          const clientList = Object.values(response.clients || {}).map(
            (client) =>
              transformClientListToMarketingClient(
                normalizeClientInterviews(client),
                recruiterMap,
                null
              )
          );
          if (mounted) {
            setReceivedClients(clientList);
            setScheduledClients([]);
            setApplicationClients({});
            setTodayStats(null);
            setError(null);
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        if (mounted) {
          setError(
            err.message?.includes("Authentication required")
              ? "Authentication required. Please log in again."
              : err.response?.status === 400
              ? "Invalid filter parameters. Please adjust your filters and try again."
              : "Failed to load data. Please check your filters or try again later."
          );
          setReceivedClients([]);
          setScheduledClients([]);
          setApplicationClients({});
          setTodayStats(null);
        }
      } finally {
        if (mounted) {
          console.log("Fetch complete, setting loading to false");
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(loadData, 300);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [
    standupMode,
    filters.recruiter,
    filters.status,
    filters.type,
    filters.dateRange,
    recruiters,
  ]);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    console.log("Filters changed:", newFilters);
    setFilters(newFilters);
    setSearchQuery(newFilters.searchQuery || "");
    setQuickFilters(newFilters.quickFilters || []);
  }, []);

  const handleInterviewClick = (interview: MarketingInterview) => {
    setSelectedInterview(interview);
    setActiveInterviewId(interview.interviewID);
    setIsApplicationCountsOpen(false);
  };

  const handleCloseInterview = () => {
    setSelectedInterview(null);
    setActiveInterviewId(null);
    setIsAddingInterview(false);
  };

  const handleUpdateInterview = (updatedInterview: MarketingInterview) => {
    console.log("Updating interview:", updatedInterview);
    setSelectedInterview(null);
    setActiveInterviewId(null);
    setReceivedClients((prev) =>
      prev.map((client) => ({
        ...client,
        interviews: client.interviews.map((i) =>
          i.interviewID === updatedInterview.interviewID ? updatedInterview : i
        ),
      }))
    );
    setScheduledClients((prev) =>
      prev.map((client) => ({
        ...client,
        interviews: client.interviews.map((i) =>
          i.interviewID === updatedInterview.interviewID ? updatedInterview : i
        ),
      }))
    );
  };

  const handleAddInterview = (newInterview: MarketingInterview) => {
    console.log("Adding new interview:", newInterview);
    setIsAddingInterview(false);
    const updateClients = (prevClients: MarketingClient[]) => {
      const client = prevClients.find(
        (c) => c.clientID.toString() === newInterview.clientID?.toString()
      );
      if (client) {
        const counts = countInterviews([newInterview]);
        return prevClients.map((c) =>
          c.clientID.toString() === client.clientID.toString()
            ? {
                ...c,
                interviews: [...c.interviews, newInterview],
                screeningCount: c.screeningCount + counts.screening,
                technicalCount: c.technicalCount + counts.technical,
                finalRoundCount: c.finalRoundCount + counts.finalRound,
              }
            : c
        );
      }
      return prevClients;
    };
    setReceivedClients(updateClients);
    setScheduledClients(updateClients);
  };

  const handleOpenApplicationCounts = () => {
    setIsApplicationCountsOpen(true);
    setSelectedInterview(null);
    setActiveInterviewId(null);
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
      const updatedCounts: Record<string, MarketingApplicationCount> = {};
      for (const [clientId, count] of Object.entries(counts)) {
        updatedCounts[clientId] = {
          applicationCountID: 0,
          clientID: parseInt(clientId),
          clientName:
            receivedClients.find((c) => c.clientID.toString() === clientId)
              ?.clientName || "",
          recruiterID: null,
          date: today,
          totalManualApplications: count.totalManualApplications,
          totalEasyApplications: count.totalEasyApplications,
          totalReceivedInterviews: count.totalReceivedInterviews,
          createdTS: new Date().toISOString(),
          updatedTS: new Date().toISOString(),
          createdBy: "system",
          updatedBy: "system",
        };
      }
      setReceivedClients((prev) =>
        prev.map((client) => ({
          ...client,
          applicationCount:
            updatedCounts[client.clientID.toString()] ||
            client.applicationCount,
        }))
      );
      setScheduledClients((prev) =>
        prev.map((client) => ({
          ...client,
          applicationCount:
            updatedCounts[client.clientID.toString()] ||
            client.applicationCount,
        }))
      );
      setApplicationClients((prev) => ({ ...prev, ...updatedCounts }));
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: isSmallScreen ? "100%" : 250,
            bgcolor: "white",
            borderRadius: 2,
            border: "1px solid rgba(104, 42, 83, 0.1)",
            p: 2,
            mb: isSmallScreen ? 2 : 0,
            flexShrink: 0,
          }}
        >
          <FilterBar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            standupMode={standupMode}
            onStandupModeChange={setStandupMode}
            recruiters={recruiters}
          />
        </Box>
        <Box sx={{ flexGrow: 1, p: isSmallScreen ? 2 : 0, overflow: "auto" }}>
          <KanbanBoard
            receivedClients={receivedClients}
            scheduledClients={scheduledClients}
            applicationClients={applicationClients}
            filters={{ ...filters, searchQuery, quickFilters }}
            standupMode={standupMode}
            onInterviewClick={handleInterviewClick}
            applicationCounts={applicationClients}
            todayStats={todayStats}
            activeInterviewId={activeInterviewId}
          />
          <Drawer
            anchor="right"
            open={!!selectedInterview || isAddingInterview}
            onClose={handleCloseInterview}
            sx={{
              "& .MuiDrawer-paper": {
                width: { xs: "100%", sm: "540px" },
                boxSizing: "border-box",
                p: 3,
                borderLeft: "1px solid rgba(104, 42, 83, 0.1)",
                bgcolor: "white",
              },
            }}
          >
            <Box sx={{ pt: 2 }}>
              <Typography
                variant="h5"
                sx={{ color: "#682A53", fontWeight: 600 }}
              >
                {/* {selectedInterview ? "Interview Details" : "Add New Interview"} */}
              </Typography>
              <InterviewSidebar
                interview={selectedInterview}
                isOpen={!!selectedInterview || isAddingInterview}
                onClose={handleCloseInterview}
                //onUpdate={handleUpdateInterview}
                //onAdd={handleAddInterview}
              />
            </Box>
          </Drawer>
          <Drawer
            anchor="right"
            open={isApplicationCountsOpen}
            onClose={handleCloseApplicationCounts}
            sx={{
              "& .MuiDrawer-paper": {
                width: { xs: "100%", sm: "540px" },
                boxSizing: "border-box",
                p: 3,
                borderLeft: "1px solid rgba(104, 42, 83, 0.1)",
                bgcolor: "white",
              },
            }}
          >
            <Box sx={{ pt: 2 }}>
              <Typography
                variant="h5"
                sx={{ color: "#682A53", fontWeight: 600 }}
              >
                Daily Application Counts
              </Typography>
              <ApplicationCountsSidebar
                isOpen={isApplicationCountsOpen}
                onClose={handleCloseApplicationCounts}
                clients={receivedClients.concat(scheduledClients)}
                onSubmit={handleSubmitApplicationCounts}
                applicationCounts={applicationClients}
              />
            </Box>
          </Drawer>
          {error && <Box sx={{ p: 2, color: "red" }}>{error}</Box>}
        </Box>
      </Box>
    </Box>
  );
}
