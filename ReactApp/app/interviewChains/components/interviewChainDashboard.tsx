"use client";

import { useState } from "react";
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

interface InterviewChainDashboardProps {
  stats: InterviewChainStats;
  recentChains: InterviewChain[];
  onViewChain: (chain: InterviewChain) => void; // Updated to accept InterviewChain
}

export default function InterviewChainDashboard({
  stats,
  recentChains,
  onViewChain,
}: InterviewChainDashboardProps) {
  const theme = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000); // Simulate refresh; replace with actual data fetch if needed
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
    const total = stats.totalChains || 1; // Avoid division by zero
    const activePercent = (stats.activeChains / total) * 100;
    const successfulPercent = (stats.successfulChains / total) * 100;
    const unsuccessfulPercent = (stats.unsuccessfulChains / total) * 100;

    return (
      <Box
        sx={{
          height: 300,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ position: "relative", width: 200, height: 200 }}>
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
            <Typography variant="h6">{stats.totalChains}</Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderBarChart = () => {
    const maxHeight = 200; // Max height in pixels
    const scaleFactor = stats.monthlyActivity.length
      ? maxHeight /
        Math.max(
          ...stats.monthlyActivity.map(
            (m) => m.active + m.successful + m.unsuccessful
          ),
          20
        )
      : 1; // Avoid division by zero, default scale

    return (
      <Box
        sx={{
          height: 300,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-around",
          pt: 2,
        }}
      >
        {stats.monthlyActivity.map((month, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: `${90 / stats.monthlyActivity.length}%`, // Dynamic width
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

  return (
    <Box sx={{ mb: 4 }}>
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
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Chains
              </Typography>
              <Typography variant="h4">{stats.totalChains}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {stats.averageRounds.toFixed(1)} avg. rounds per chain
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
                {stats.activeChains}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 1, display: "flex", alignItems: "center" }}
              >
                <TrendingUp
                  fontSize="small"
                  sx={{ mr: 0.5, color: theme.palette.success.main }}
                />
                {stats.totalChains
                  ? Math.round((stats.activeChains / stats.totalChains) * 100)
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
                {stats.successfulChains}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 1, display: "flex", alignItems: "center" }}
              >
                <TrendingUp
                  fontSize="small"
                  sx={{ mr: 0.5, color: theme.palette.success.main }}
                />
                {stats.offerRate}% offer rate
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
                {stats.unsuccessfulChains}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 1, display: "flex", alignItems: "center" }}
              >
                <TrendingDown
                  fontSize="small"
                  sx={{ mr: 0.5, color: theme.palette.error.main }}
                />
                {stats.totalChains
                  ? Math.round(
                      (stats.unsuccessfulChains / stats.totalChains) * 100
                    )
                  : 0}
                % of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Monthly Activity
            </Typography>
            {renderBarChart()}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Status Breakdown
            </Typography>
            {renderPieChart()}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Interview Chains
            </Typography>
            <List sx={{ maxHeight: 300, overflow: "auto" }}>
              {recentChains.map((chain, index) => {
                const latestInterview =
                  chain.interviews[chain.interviews.length - 1];
                return (
                  <Box key={chain.id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      component="button"
                      onClick={() => onViewChain(chain)} // Pass full chain object
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
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Clients
            </Typography>
            <List sx={{ maxHeight: 300, overflow: "auto" }}>
              {stats.topClients.map((client, index) => (
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
                        stats.totalChains
                          ? Math.round((client.count / stats.totalChains) * 100)
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
