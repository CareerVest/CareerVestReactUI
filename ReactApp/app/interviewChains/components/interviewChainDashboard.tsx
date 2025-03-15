"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import type {
  InterviewChain,
  InterviewChainStats,
} from "@/app/types/interviewChain/interviewChain";
import {
  Refresh,
  TrendingUp,
  TrendingDown,
  MoreVert,
  Check,
  Cancel,
} from "@mui/icons-material";
import { useInterviewChains } from "./hooks/useInterviewChains";

interface InterviewChainDashboardProps {
  stats: InterviewChainStats;
  recentChains: InterviewChain[];
  onViewChain: (chain: InterviewChain) => void;
}

export default function InterviewChainDashboard({
  stats: initialStats,
  recentChains: initialRecentChains,
  onViewChain,
}: InterviewChainDashboardProps) {
  const theme = useTheme();
  const { chains, stats, loading, fetchError, fetchChains } =
    useInterviewChains();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use fetched data if available, otherwise fall back to props
  const effectiveStats = stats.totalChains > 0 ? stats : initialStats;
  const effectiveRecentChains =
    chains.length > 0
      ? chains
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
          .slice(0, 5)
      : initialRecentChains;

  useEffect(() => {
    if (!loading && fetchError) {
      console.error("Failed to load interview chains:", fetchError);
    }
  }, [loading, fetchError]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchChains();
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case "Active":
        return theme.palette.info.main;
      case "Successful":
        return theme.palette.success.main;
      case "Unsuccessful":
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getOutcomeIcon = (
    outcome?: string | null
  ): React.ReactElement | undefined => {
    switch (outcome) {
      case "Next":
        return <Check color="info" />;
      case "Offer":
        return <Check color="success" />;
      case "Rejected":
        return <Cancel color="error" />;
      default:
        return undefined;
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString();
  };

  const renderPieChart = () => {
    const total = effectiveStats.totalChains || 1; // Avoid division by zero
    const activePercent = (effectiveStats.activeChains / total) * 100;
    const successfulPercent = (effectiveStats.successfulChains / total) * 100;
    const unsuccessfulPercent =
      (effectiveStats.unsuccessfulChains / total) * 100;

    return (
      <Box
        sx={{
          height: 200,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "80%",
            maxWidth: 150,
            height: 150,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: `conic-gradient(
                ${theme.palette.info.main} 0% ${activePercent}%, 
                ${theme.palette.success.main} ${activePercent}% ${
                activePercent + successfulPercent
              }%, 
                ${theme.palette.error.main} ${
                activePercent + successfulPercent
              }% 100%
              )`,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "60%",
              height: "60%",
              borderRadius: "50%",
              bgcolor: "background.paper",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">{effectiveStats.totalChains}</Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderBarChart = () => {
    const maxHeight = 150;
    const scaleFactor = effectiveStats.monthlyActivity.length
      ? maxHeight /
        Math.max(
          ...effectiveStats.monthlyActivity.map(
            (m) => m.active + m.successful + m.unsuccessful
          ),
          20
        )
      : 1;

    return (
      <Box
        sx={{
          height: 200,
          width: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-around",
          pt: 2,
          overflowX: "hidden",
        }}
      >
        {effectiveStats.monthlyActivity.map((month, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: `${80 / effectiveStats.monthlyActivity.length}%`,
              minWidth: 40,
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  height: `${month.unsuccessful * scaleFactor}px`,
                  width: "70%",
                  bgcolor: theme.palette.error.main,
                  mb: 0.5,
                }}
              />
              <Box
                sx={{
                  height: `${month.successful * scaleFactor}px`,
                  width: "70%",
                  bgcolor: theme.palette.success.main,
                  mb: 0.5,
                }}
              />
              <Box
                sx={{
                  height: `${month.active * scaleFactor}px`,
                  width: "70%",
                  bgcolor: theme.palette.info.main,
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ mt: 1 }}>
              {month.month}
            </Typography>
          </Box>
        ))}
      </Box>
    );
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

  if (fetchError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{fetchError}</Typography>
        <IconButton onClick={handleRefresh} color="primary">
          <Refresh />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: "100%",
        overflowX: "hidden",
        mb: 4,
        px: { xs: 2, sm: 0 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h2">
          Interview Chain Dashboard
        </Typography>
        <Tooltip title="Refresh data">
          <IconButton
            onClick={handleRefresh}
            color="primary"
            disabled={isRefreshing}
            sx={{
              animation: isRefreshing ? "spin 1s linear infinite" : "none",
              "@keyframes spin": { "100%": { transform: "rotate(360deg)" } },
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>
      <Grid container spacing={2}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Chains
              </Typography>
              <Typography variant="h4">{effectiveStats.totalChains}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {effectiveStats.averageRounds.toFixed(1)} avg. rounds per chain
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Chains
              </Typography>
              <Typography variant="h4" sx={{ color: theme.palette.info.main }}>
                {effectiveStats.activeChains}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 1, display: "flex", alignItems: "center" }}
              >
                <TrendingUp
                  fontSize="small"
                  sx={{ mr: 0.5, color: theme.palette.success.main }}
                />
                {effectiveStats.totalChains
                  ? Math.round(
                      (effectiveStats.activeChains /
                        effectiveStats.totalChains) *
                        100
                    )
                  : 0}
                % of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Successful Chains
              </Typography>
              <Typography
                variant="h4"
                sx={{ color: theme.palette.success.main }}
              >
                {effectiveStats.successfulChains}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 1, display: "flex", alignItems: "center" }}
              >
                <TrendingUp
                  fontSize="small"
                  sx={{ mr: 0.5, color: theme.palette.success.main }}
                />
                {effectiveStats.offerRate.toFixed(1)}% offer rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Unsuccessful Chains
              </Typography>
              <Typography variant="h4" sx={{ color: theme.palette.error.main }}>
                {effectiveStats.unsuccessfulChains}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 1, display: "flex", alignItems: "center" }}
              >
                <TrendingDown
                  fontSize="small"
                  sx={{ mr: 0.5, color: theme.palette.error.main }}
                />
                {effectiveStats.totalChains
                  ? Math.round(
                      (effectiveStats.unsuccessfulChains /
                        effectiveStats.totalChains) *
                        100
                    )
                  : 0}
                % of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2, minHeight: 250 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Activity
            </Typography>
            {renderBarChart()}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, minHeight: 250 }}>
            <Typography variant="h6" gutterBottom>
              Status Breakdown
            </Typography>
            {renderPieChart()}
          </Paper>
        </Grid>

        {/* Lists */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, minHeight: 350, maxHeight: 350 }}>
            <Typography variant="h6" gutterBottom>
              Recent Interview Chains
            </Typography>
            <List sx={{ maxHeight: 300, overflow: "auto" }}>
              {effectiveRecentChains.map((chain, index) => {
                const latestInterview =
                  chain.interviews[chain.interviews.length - 1];
                return (
                  <Box key={chain.id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      component="button"
                      onClick={() => onViewChain(chain)}
                      secondaryAction={
                        <IconButton edge="end" aria-label="more">
                          <MoreVert />
                        </IconButton>
                      }
                      sx={{ cursor: "pointer" }}
                    >
                      <Avatar
                        sx={{ mr: 2, bgcolor: getStatusColor(chain.status) }}
                      >
                        {chain.clientName?.charAt(0) || "C"}
                      </Avatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {chain.clientName || "Unknown Client"}
                            <Chip
                              size="small"
                              label={chain.status || "Unknown"}
                              sx={{
                                ml: 1,
                                bgcolor: getStatusColor(chain.status),
                                color: "#fff",
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            {chain.position || "Unknown Position"} •{" "}
                            {chain.interviews.length} interviews
                            <Typography variant="caption" display="block">
                              Latest: {latestInterview?.Position || "N/A"} on{" "}
                              {formatDate(latestInterview?.InterviewDate)}
                              {latestInterview?.InterviewOutcome && (
                                <Chip
                                  size="small"
                                  label={latestInterview.InterviewOutcome}
                                  icon={getOutcomeIcon(
                                    latestInterview.InterviewOutcome
                                  )}
                                  sx={{ ml: 1 }}
                                  color={
                                    latestInterview.InterviewOutcome === "Offer"
                                      ? "success"
                                      : latestInterview.InterviewOutcome ===
                                        "Rejected"
                                      ? "error"
                                      : "info"
                                  }
                                />
                              )}
                            </Typography>
                            <Typography variant="caption" display="block">
                              Last updated: {formatDate(chain.updatedAt)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  </Box>
                );
              })}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, minHeight: 350, maxHeight: 350 }}>
            <Typography variant="h6" gutterBottom>
              Top Clients
            </Typography>
            <List sx={{ maxHeight: 300, overflow: "auto" }}>
              {effectiveStats.topClients.map((client, index) => (
                <Box key={client.name}>
                  {index > 0 && <Divider />}
                  <ListItem>
                    <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                      {client.name.charAt(0)}
                    </Avatar>
                    <ListItemText
                      primary={client.name}
                      secondary={`${client.count} interview chains`}
                    />
                    <Chip
                      label={`${
                        effectiveStats.totalChains
                          ? Math.round(
                              (client.count / effectiveStats.totalChains) * 100
                            )
                          : 0
                      }%`}
                      size="small"
                      color="primary"
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
