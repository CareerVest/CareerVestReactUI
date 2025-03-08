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
} from "@mui/icons-material";

interface InterviewChainDashboardProps {
  stats: InterviewChainStats;
  recentChains: InterviewChain[];
  onViewChain: (chainId: string) => void;
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
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getStatusColor = (status: string) => {
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

  // Create dummy data for charts instead of using MUI X Charts
  const renderPieChart = () => {
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
                ${theme.palette.info.main} 0% ${
                (stats.activeChains / stats.totalChains) * 100
              }%, 
                ${theme.palette.success.main} ${
                (stats.activeChains / stats.totalChains) * 100
              }% ${
                ((stats.activeChains + stats.successfulChains) /
                  stats.totalChains) *
                100
              }%, 
                ${theme.palette.error.main} ${
                ((stats.activeChains + stats.successfulChains) /
                  stats.totalChains) *
                100
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
              width: "14%",
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
                  height: `${(month.unsuccessful / 20) * 200}px`,
                  width: "70%",
                  bgcolor: theme.palette.error.main,
                  mb: 0.5,
                }}
              />
              <Box
                sx={{
                  height: `${(month.successful / 20) * 200}px`,
                  width: "70%",
                  bgcolor: theme.palette.success.main,
                  mb: 0.5,
                }}
              />
              <Box
                sx={{
                  height: `${(month.active / 20) * 200}px`,
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
            sx={{
              animation: isRefreshing ? "spin 1s linear infinite" : "none",
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Chains
              </Typography>
              <Typography variant="h4">{stats.totalChains}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {stats.averageRounds} avg. rounds per chain
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
                {Math.round((stats.activeChains / stats.totalChains) * 100)}% of
                total
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
                {Math.round(
                  (stats.unsuccessfulChains / stats.totalChains) * 100
                )}
                % of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
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

        {/* Recent Chains */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Interview Chains
            </Typography>
            <List sx={{ maxHeight: 300, overflow: "auto" }}>
              {recentChains.map((chain, index) => (
                <Box key={chain.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    component="button" // Explicitly set component to "button"
                    onClick={() => onViewChain(chain.id)}
                    secondaryAction={
                      <IconButton edge="end" aria-label="more">
                        <MoreVert />
                      </IconButton>
                    }
                  >
                    <Avatar
                      sx={{ mr: 2, bgcolor: getStatusColor(chain.status) }}
                    >
                      {chain.clientName.charAt(0)}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {chain.clientName}
                          <Chip
                            size="small"
                            label={chain.status}
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
                          {chain.position} • {chain.interviews.length}{" "}
                          interviews
                          <Typography variant="caption" display="block">
                            Last updated:{" "}
                            {new Date(chain.updatedAt).toLocaleDateString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Top Clients */}
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
                      label={`${Math.round(
                        (client.count / stats.totalChains) * 100
                      )}%`}
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
