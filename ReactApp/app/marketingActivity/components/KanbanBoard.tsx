"use client";

import { useMemo, useState } from "react";
import { Box, Grid, Paper, Typography, Chip } from "@mui/material";
import { ClientCard } from "./ClientCard";
import type {
  MarketingClient,
  MarketingInterview,
  MarketingApplicationCount,
  FilterState,
} from "../../types/MarketingActivity/Marketing";

interface KanbanBoardProps {
  receivedClients: MarketingClient[];
  scheduledClients: MarketingClient[];
  applicationClients: Record<string, MarketingApplicationCount>;
  filters: FilterState & { searchQuery: string; quickFilters: string[] };
  standupMode: boolean;
  onInterviewClick: (interview: MarketingInterview) => void;
  onAddInterview?: () => void;
  applicationCounts: Record<string, MarketingApplicationCount>;
  todayStats: {
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
  } | null;
  activeInterviewId: number | null;
}

export function KanbanBoard({
  receivedClients,
  scheduledClients,
  applicationClients,
  filters,
  standupMode,
  onInterviewClick,
  onAddInterview,
  applicationCounts,
  todayStats,
  activeInterviewId,
}: KanbanBoardProps) {
  const [expandedClientIds, setExpandedClientIds] = useState<Set<string>>(
    new Set()
  ); // Use Set for unique IDs

  const filterClients = (clients: MarketingClient[]) =>
    clients.filter((client) => {
      const matchesSearch =
        !filters.searchQuery ||
        client.clientName
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) ||
        client.interviews.some(
          (i) =>
            (i.company?.toLowerCase() ?? "").includes(
              filters.searchQuery.toLowerCase()
            ) ||
            (i.technology?.toLowerCase() ?? "").includes(
              filters.searchQuery.toLowerCase()
            ) ||
            i.interviewType
              .toLowerCase()
              .includes(filters.searchQuery.toLowerCase()) ||
            (i.interviewStatus?.toLowerCase() ?? "").includes(
              filters.searchQuery.toLowerCase()
            )
        );

      const matchesQuickFilters = filters.quickFilters.every((filter) => {
        switch (filter.toLowerCase()) {
          case "today":
            return client.interviews.some((i) => i.interviewDate);
          case "scheduled":
            return client.interviews.some(
              (i) => i.interviewStatus === "scheduled"
            );
          case "completed":
            return client.interviews.some(
              (i) => i.interviewStatus === "completed"
            );
          case "screening":
            return client.interviews.some(
              (i) => i.interviewType === "Screening"
            );
          case "technical":
            return client.interviews.some(
              (i) =>
                i.interviewType === "Technical" ||
                i.interviewType === "Technical1" ||
                i.interviewType === "Technical2" ||
                i.interviewType === "Technical3" ||
                i.interviewType === "Technical Round 1"
            );
          case "final round":
            return client.interviews.some(
              (i) =>
                i.interviewType === "Final Discussion" ||
                i.interviewType === "Final Round"
            );
          default:
            return true;
        }
      });

      if (
        filters.recruiter &&
        client.recruiterID?.toString() !== filters.recruiter
      ) {
        return false;
      }

      const clientInterviews = client.interviews.filter((interview) => {
        if (
          filters.status &&
          filters.status !== "all" &&
          interview.interviewStatus !== filters.status
        ) {
          return false;
        }
        if (
          filters.type &&
          filters.type !== "all" &&
          interview.interviewType !== filters.type
        ) {
          return false;
        }
        if (
          filters.dateRange[0] &&
          filters.dateRange[1] &&
          interview.interviewDate
        ) {
          const interviewDate = new Date(interview.interviewDate);
          return (
            interviewDate >= filters.dateRange[0] &&
            interviewDate <= filters.dateRange[1]
          );
        }
        return true;
      });

      return (
        matchesSearch &&
        matchesQuickFilters &&
        (clientInterviews.length > 0 || !standupMode)
      );
    });

  const filteredReceivedClients = useMemo(
    () => filterClients(receivedClients),
    [receivedClients, filters]
  );
  const filteredScheduledClients = useMemo(
    () => filterClients(scheduledClients),
    [scheduledClients, filters]
  );

  const handleToggleExpand = (clientId: string) => {
    setExpandedClientIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(clientId)) {
        newSet.delete(clientId);
      } else {
        newSet.add(clientId);
      }
      return newSet;
    });
  };

  if (standupMode) {
    return (
      <Box sx={{ p: 2 }}>
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
            {Object.values(applicationClients).length > 0 ? (
              Object.values(applicationClients).map((appCount) => (
                <Box
                  key={appCount.clientID}
                  sx={{
                    minWidth: 120,
                    p: 1,
                    border: "1px solid rgba(104, 42, 83, 0.1)",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: "#682A53" }}>
                    {appCount.clientName}
                  </Typography>
                  <Typography variant="body2">
                    Manual: {appCount.totalManualApplications}
                  </Typography>
                  <Typography variant="body2">
                    Easy: {appCount.totalEasyApplications}
                  </Typography>
                  <Typography variant="body2">
                    Interviews: {appCount.totalReceivedInterviews}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography sx={{ color: "text.secondary" }}>
                No application counts for today.
              </Typography>
            )}
          </Box>
        </Paper>

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
                  label={todayStats?.received.total || 0}
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
                  p: 1,
                  mb: 3,
                  bgcolor: "rgba(104, 42, 83, 0.05)",
                  borderRadius: 3,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={4} sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#682A53" }}
                    >
                      {todayStats?.received.screening || 0}
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
                      {todayStats?.received.technical || 0}
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
                      {todayStats?.received.finalRound || 0}
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
              {filteredReceivedClients.length === 0 ? (
                <Box
                  sx={{ textAlign: "center", p: 3, color: "text.secondary" }}
                >
                  No received interviews found for today.
                </Box>
              ) : (
                <Box
                  sx={{
                    maxHeight: "calc(100vh - 340px)",
                    overflowY: "auto",
                    overflowX: "hidden",
                    pr: 1,
                  }}
                >
                  {filteredReceivedClients.map((client) => (
                    <ClientCard
                      key={client.clientID}
                      client={client}
                      standupMode={standupMode}
                      onInterviewClick={onInterviewClick}
                      isExpanded={expandedClientIds.has(
                        `received-${client.clientID.toString()}`
                      )}
                      onToggleExpand={handleToggleExpand}
                      clientId={client.clientID.toString()}
                      activeInterviewId={activeInterviewId}
                      section="received"
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
                  label={todayStats?.scheduled.total || 0}
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
                  p: 1, // Match Received Interviews
                  mb: 3,
                  bgcolor: "rgba(104, 42, 83, 0.05)",
                  borderRadius: 3, // Match Received Interviews
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={4} sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#682A53" }}
                    >
                      {todayStats?.scheduled.screening || 0}
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
                      {todayStats?.scheduled.technical || 0}
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
                      {todayStats?.scheduled.finalRound || 0}
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
              {filteredScheduledClients.length === 0 ? (
                <Box
                  sx={{ textAlign: "center", p: 3, color: "text.secondary" }}
                >
                  No scheduled interviews found for today.
                </Box>
              ) : (
                <Box
                  sx={{
                    maxHeight: "calc(100vh - 340px)",
                    overflowY: "auto",
                    overflowX: "hidden",
                    pr: 1,
                  }}
                >
                  {filteredScheduledClients.map((client) => (
                    <ClientCard
                      key={client.clientID}
                      client={client}
                      standupMode={standupMode}
                      onInterviewClick={onInterviewClick}
                      isExpanded={expandedClientIds.has(
                        `scheduled-${client.clientID.toString()}`
                      )}
                      onToggleExpand={handleToggleExpand}
                      clientId={client.clientID.toString()}
                      activeInterviewId={activeInterviewId}
                      section="scheduled"
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
      {filteredReceivedClients.length === 0 ? (
        <Box sx={{ textAlign: "center", p: 8, color: "text.secondary" }}>
          No clients found for the current filters.
        </Box>
      ) : (
        <Box
          sx={{
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {filteredReceivedClients.map((client) => (
            <ClientCard
              key={client.clientID}
              client={client}
              standupMode={standupMode}
              onInterviewClick={onInterviewClick}
              isExpanded={expandedClientIds.has(
                `filtered-${client.clientID.toString()}`
              )}
              onToggleExpand={handleToggleExpand}
              clientId={client.clientID.toString()}
              activeInterviewId={activeInterviewId}
              section="filtered"
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
