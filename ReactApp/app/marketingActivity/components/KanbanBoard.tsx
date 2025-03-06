"use client";

import { useMemo, useState } from "react";
import { Box, Grid, Paper, Typography, Chip } from "@mui/material";
import { ClientCard } from "./ClientCard";
import type {
  MarketingClient,
  MarketingInterview,
  FilterState,
} from "../../types/MarketingActivity/Marketing";
import {
  MarketingInterviewStats,
  MarketingActivityCount,
} from "@/app/types/MarketingActivity/Marketing";

interface KanbanBoardProps {
  clients: MarketingClient[];
  filters: FilterState & { searchQuery: string; quickFilters: string[] };
  standupMode: boolean;
  onInterviewClick: (interview: MarketingInterview) => void;
  onAddInterview: () => void;
  applicationCounts: Record<string, MarketingActivityCount>;
}

export function KanbanBoard({
  clients,
  filters,
  standupMode,
  onInterviewClick,
  onAddInterview,
  applicationCounts,
}: KanbanBoardProps) {
  // Hardcoded data based on the provided types
  const hardcodedClients: MarketingClient[] = [
    {
      id: "client-1",
      name: "TechCorp",
      recruiterId: "recruiter-1",
      interviews: [
        {
          id: "interview-1",
          clientId: "client-1",
          clientName: "TechCorp",
          type: "Screening",
          tech: "Java",
          status: "completed",
          time: "10:00 AM",
          date: new Date("2025-03-05").toISOString(),
          entryDate: new Date("2025-03-01").toISOString(),
          company: "TechCorp",
          notes: "Initial screening for Java developer role.",
          feedback: "Candidate performed well in technical questions.",
        },
        {
          id: "interview-2",
          clientId: "client-1",
          clientName: "TechCorp",
          type: "Technical",
          tech: "Python",
          status: "scheduled",
          time: "2:00 PM",
          date: new Date("2025-03-06").toISOString(),
          entryDate: new Date("2025-03-02").toISOString(),
          company: "TechCorp",
          notes: "Technical assessment for Python backend role.",
          feedback: "",
        },
      ],
      screeningCount: 1,
      technicalCount: 1,
      finalRoundCount: 0,
    },
    {
      id: "client-2",
      name: "Innovate Inc",
      recruiterId: "recruiter-2",
      interviews: [
        {
          id: "interview-3",
          clientId: "client-2",
          clientName: "Innovate Inc",
          type: "Final Round",
          tech: "JavaScript",
          status: "completed",
          time: "11:00 AM",
          date: new Date("2025-03-05").toISOString(),
          entryDate: new Date("2025-03-01").toISOString(),
          company: "Innovate Inc",
          notes: "Final round for JavaScript frontend role.",
          feedback: "Excellent problem-solving skills demonstrated.",
        },
        {
          id: "interview-4",
          clientId: "client-2",
          clientName: "Innovate Inc",
          type: "Screening",
          tech: "React",
          status: "scheduled",
          time: "3:00 PM",
          date: new Date("2025-03-06").toISOString(),
          entryDate: new Date("2025-03-02").toISOString(),
          company: "Innovate Inc",
          notes: "Initial screening for React developer position.",
          feedback: "",
        },
      ],
      screeningCount: 1,
      technicalCount: 0,
      finalRoundCount: 1,
    },
  ];

  const hardcodedInterviewStats: MarketingInterviewStats[] = [
    {
      Date: new Date("2025-03-05"),
      Screening: 2, // Sum of Screening interviews completed today
      Technical: 0,
      FinalRound: 1,
      Total: 3,
    },
  ];

  const hardcodedApplicationCounts: Record<string, MarketingActivityCount> = {
    "client-1": {
      ApplicationCountID: 1,
      ClientID: 1,
      ClientName: "TechCorp",
      Date: new Date("2025-03-05"),
      TotalManualApplications: 10,
      TotalEasyApplications: 5,
      TotalReceivedInterviews: 2,
      CreatedTS: new Date(),
      UpdatedTS: new Date(),
      CreatedBy: "system",
      UpdatedBy: "system",
    },
    "client-2": {
      ApplicationCountID: 2,
      ClientID: 2,
      ClientName: "Innovate Inc",
      Date: new Date("2025-03-05"),
      TotalManualApplications: 8,
      TotalEasyApplications: 3,
      TotalReceivedInterviews: 2,
      CreatedTS: new Date(),
      UpdatedTS: new Date(),
      CreatedBy: "system",
      UpdatedBy: "system",
    },
  };

  // Use hardcoded data instead of props or fetched data
  const [clientsData, setClientsData] =
    useState<MarketingClient[]>(hardcodedClients);
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null); // Track which client is expanded

  const filteredClients = useMemo(() => {
    return clientsData.filter((client) => {
      const matchesSearch =
        !filters.searchQuery ||
        client.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        client.interviews.some(
          (i) =>
            i.company
              .toLowerCase()
              .includes(filters.searchQuery.toLowerCase()) ||
            i.tech.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
            i.type.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
            i.status.toLowerCase().includes(filters.searchQuery.toLowerCase())
        );

      const matchesQuickFilters = filters.quickFilters.every((filter) => {
        switch (filter.toLowerCase()) {
          case "today":
            return client.interviews.some(
              (i) =>
                new Date(i.date).toDateString() === new Date().toDateString()
            );
          case "scheduled":
            return client.interviews.some((i) => i.status === "scheduled");
          case "completed":
            return client.interviews.some((i) => i.status === "completed");
          case "screening":
            return client.interviews.some((i) => i.type === "Screening");
          case "technical":
            return client.interviews.some((i) => i.type === "Technical");
          case "final round":
            return client.interviews.some((i) => i.type === "Final Round");
          default:
            return true;
        }
      });

      if (
        filters.recruiter &&
        filters.recruiter !== "all" &&
        client.recruiterId !== filters.recruiter
      ) {
        return false;
      }

      const clientInterviews = client.interviews.filter((interview) => {
        if (
          filters.status &&
          filters.status !== "all" &&
          interview.status !== filters.status
        ) {
          return false;
        }
        if (
          filters.type &&
          filters.type !== "all" &&
          interview.type !== filters.type
        ) {
          return false;
        }
        if (filters.dateRange[0] && filters.dateRange[1]) {
          const interviewDate = new Date(interview.date);
          return (
            interviewDate >= filters.dateRange[0] &&
            interviewDate <= filters.dateRange[1]
          );
        }
        return true;
      });

      return (
        matchesSearch && matchesQuickFilters && clientInterviews.length > 0
      );
    });
  }, [clientsData, filters]);

  const handleToggleExpand = (clientId: string) => {
    setExpandedClientId((prev) => (prev === clientId ? null : clientId)); // Toggle or close if same card
  };

  if (standupMode) {
    const receivedStats = hardcodedInterviewStats.find(
      (s) => s.Date.toDateString() === new Date().toDateString()
    ) || {
      Screening: 0,
      Technical: 0,
      FinalRound: 0,
      Total: 0,
    };
    const scheduledStats = receivedStats; // Assuming same stats; adjust if separate data available

    const recruiterClients = filteredClients.filter(
      (client) =>
        filters.recruiter === "all" || client.recruiterId === filters.recruiter
    );

    return (
      <Box sx={{ p: 2 }}>
        {/* Application Counts - Horizontal Box */}
        <Paper
          elevation={2}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            border: "2px solid rgba(104, 42, 83, 0.2)",
            overflowX: "auto",
            bgcolor: "white",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "#682A53", fontWeight: 600, mb: 2 }}
          >
            Today's Application Counts
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            {recruiterClients.map((client) => {
              const counts = hardcodedApplicationCounts[client.id] || {
                ApplicationCountID: 0,
                ClientID: 0,
                ClientName: "",
                Date: new Date(),
                TotalManualApplications: 0,
                TotalEasyApplications: 0,
                TotalReceivedInterviews: 0,
                CreatedTS: new Date(),
                UpdatedTS: new Date(),
                CreatedBy: "system",
                UpdatedBy: "system",
              };
              return (
                <Box
                  key={client.id}
                  sx={{
                    minWidth: 120,
                    p: 1,
                    border: "1px solid rgba(104, 42, 83, 0.1)",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: "#682A53" }}>
                    {client.name}
                  </Typography>
                  <Typography variant="body2">
                    Manual: {counts.TotalManualApplications}
                  </Typography>
                  <Typography variant="body2">
                    Easy: {counts.TotalEasyApplications}
                  </Typography>
                  <Typography variant="body2">
                    Interviews: {counts.TotalReceivedInterviews}
                  </Typography>
                </Box>
              );
            })}
            {recruiterClients.length === 0 && (
              <Typography sx={{ color: "text.secondary" }}>
                No application counts for today.
              </Typography>
            )}
          </Box>
        </Paper>

        {/* Received and Scheduled - Two Columns */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 2,
                border: "2px solid rgba(104, 42, 83, 0.2)",
                bgcolor: "white",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "#682A53", fontWeight: 600 }}
                >
                  Today's Received Interviews
                </Typography>
                <Chip
                  label={receivedStats.Total}
                  sx={{
                    bgcolor: "#FDC500",
                    color: "#682A53",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    px: 2,
                  }}
                />
              </Box>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 3,
                  bgcolor: "rgba(104, 42, 83, 0.05)",
                  borderRadius: 2,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={4} sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#682A53" }}
                    >
                      {receivedStats.Screening}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Screening
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#682A53" }}
                    >
                      {receivedStats.Technical}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Technical
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#682A53" }}
                    >
                      {receivedStats.FinalRound}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Final Round
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              {filteredClients.length === 0 ? (
                <Box
                  sx={{ textAlign: "center", p: 3, color: "text.secondary" }}
                >
                  No completed interviews found for today.
                </Box>
              ) : (
                <Box
                  sx={{
                    maxHeight: "calc(100vh - 340px)",
                    overflow: "auto",
                    pr: 1,
                  }}
                >
                  {filteredClients.map((client) => (
                    <ClientCard
                      key={client.id}
                      client={client}
                      showOnlyToday={true}
                      showOnlyStatus="completed"
                      onInterviewClick={onInterviewClick}
                      isExpanded={expandedClientId === client.id}
                      onToggleExpand={handleToggleExpand}
                      clientId={client.id}
                    />
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 2,
                border: "2px solid rgba(104, 42, 83, 0.2)",
                bgcolor: "white",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "#682A53", fontWeight: 600 }}
                >
                  Today's Scheduled Interviews
                </Typography>
                <Chip
                  label={scheduledStats.Total}
                  sx={{
                    bgcolor: "#FDC500",
                    color: "#682A53",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    px: 2,
                  }}
                />
              </Box>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 3,
                  bgcolor: "rgba(104, 42, 83, 0.05)",
                  borderRadius: 2,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={4} sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#682A53" }}
                    >
                      {scheduledStats.Screening}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Screening
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#682A53" }}
                    >
                      {scheduledStats.Technical}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Technical
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#682A53" }}
                    >
                      {scheduledStats.FinalRound}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Final Round
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              {filteredClients.length === 0 ? (
                <Box
                  sx={{ textAlign: "center", p: 3, color: "text.secondary" }}
                >
                  No scheduled interviews found for today.
                </Box>
              ) : (
                <Box
                  sx={{
                    maxHeight: "calc(100vh - 340px)",
                    overflow: "auto",
                    pr: 1,
                  }}
                >
                  {filteredClients.map((client) => (
                    <ClientCard
                      key={client.id}
                      client={client}
                      showOnlyToday={true}
                      showOnlyStatus="scheduled"
                      onInterviewClick={onInterviewClick}
                      isExpanded={expandedClientId === client.id}
                      onToggleExpand={handleToggleExpand}
                      clientId={client.id}
                    />
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {filteredClients.length === 0 ? (
        <Box sx={{ textAlign: "center", p: 8, color: "text.secondary" }}>
          No clients found for the current filters.
        </Box>
      ) : (
        <Box sx={{ maxHeight: "calc(100vh - 100px)", overflow: "auto" }}>
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              showOnlyToday={false}
              onInterviewClick={onInterviewClick}
              isExpanded={expandedClientId === client.id}
              onToggleExpand={handleToggleExpand}
              clientId={client.id}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
