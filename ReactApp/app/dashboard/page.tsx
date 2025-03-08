"use client";

import { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  InputBase,
  IconButton,
  Card,
  CardContent,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Search,
  Notifications,
  Speed,
  Group,
  TrendingUp,
  BusinessCenter,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { StatCard } from "./statCard";
import { ActivityTimeline } from "../sharedComponents/activityTimeline";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  dummyInterviewChains,
  dummyInterviewChainStats,
} from "../interviewChains/dummyInterviewChainsData"; // Corrected import
import InterviewChainDashboard from "../interviewChains/components/interviewChainDashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Revenue",
      data: [30, 45, 57, 51, 54, 68],
      fill: false,
      borderColor: "#682A53",
      tension: 0.1,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      type: "category" as const,
    },
    y: {
      type: "linear" as const,
      beginAtZero: true,
    },
  },
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Get recent chains for InterviewChainDashboard
  const recentChains = [...dummyInterviewChains]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ) // Now works with updatedAt
    .slice(0, 5);

  // Placeholder for onViewChain (you can replace this with actual navigation logic)
  const handleViewChain = (chainId: string) => {
    console.log(`View chain with ID: ${chainId}`);
    // Example: router.push(`/interview-chain/search?chainId=${chainId}`);
  };

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <Box sx={{ mb: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 600, color: "#682A53" }}
            >
              Dashboard
            </Typography>
          </Grid>
          <Grid item>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Paper
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: 400,
                  borderRadius: 2,
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search..."
                  inputProps={{ "aria-label": "search" }}
                />
                <IconButton
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                  <Search />
                </IconButton>
              </Paper>
              <IconButton>
                <Notifications />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="dashboard tabs"
        >
          <Tab icon={<DashboardIcon />} label="Overview" />
          <Tab icon={<PeopleIcon />} label="Interview" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Clients"
                value="2,543"
                icon={<BusinessCenter />}
                trend={{ value: 12, isPositive: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Active Employees"
                value="1,243"
                icon={<Group />}
                trend={{ value: 8, isPositive: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Revenue Growth"
                value="$45,678"
                icon={<TrendingUp />}
                trend={{ value: 15, isPositive: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Active Projects"
                value="89"
                icon={<Speed />}
                trend={{ value: 5, isPositive: false }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: "#682A53" }}>
                    Revenue Overview
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Line data={chartData} options={chartOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <ActivityTimeline />
            </Grid>
          </Grid>
        </>
      )}

      {activeTab === 1 && (
        <InterviewChainDashboard
          stats={dummyInterviewChainStats}
          recentChains={recentChains}
          onViewChain={handleViewChain}
        />
      )}
    </Box>
  );
}
