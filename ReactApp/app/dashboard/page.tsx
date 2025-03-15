"use client";

import { useState, useEffect } from "react";
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
import InterviewChainDashboard from "../interviewChains/components/interviewChainDashboard";
import type {
  InterviewChain,
  InterviewChainStats,
} from "@/app/types/interviewChain/interviewChain";
import { fetchInterviewChains } from "../interviewChains/actions/interviewChainActions";
import { useAuth } from "@/contexts/authContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Placeholder revenue chart data (replace with real data if available)
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
  maintainAspectRatio: false, // Allow chart to fill container height
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
  const { isAuthenticated, isInitialized, login } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [chains, setChains] = useState<InterviewChain[]>([]);
  const [stats, setStats] = useState<InterviewChainStats>({
    totalChains: 0,
    activeChains: 0,
    successfulChains: 0,
    unsuccessfulChains: 0,
    statusBreakdown: [
      { status: "Active", count: 0 },
      { status: "Successful", count: 0 },
      { status: "Unsuccessful", count: 0 },
    ],
    monthlyActivity: [],
    averageRounds: 0,
    offerRate: 0,
    topClients: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDashboard = async () => {
      if (!isInitialized) return;

      if (!isAuthenticated) {
        const loginSuccess = await login();
        if (!loginSuccess) {
          setError("Please log in to view the dashboard.");
          return;
        }
      }

      setLoading(true);
      try {
        const fetchedChains = await fetchInterviewChains();
        setChains(fetchedChains);
        updateStats(fetchedChains);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [isAuthenticated, isInitialized, login]);

  const updateStats = (chainsData: InterviewChain[]) => {
    const active = chainsData.filter((c) => c.status === "Active").length;
    const successful = chainsData.filter(
      (c) => c.status === "Successful"
    ).length;
    const unsuccessful = chainsData.filter(
      (c) => c.status === "Unsuccessful"
    ).length;

    setStats({
      totalChains: chainsData.length,
      activeChains: active,
      successfulChains: successful,
      unsuccessfulChains: unsuccessful,
      statusBreakdown: [
        { status: "Active", count: active },
        { status: "Successful", count: successful },
        { status: "Unsuccessful", count: unsuccessful },
      ],
      monthlyActivity: [],
      averageRounds: 0,
      offerRate: 0,
      topClients: [],
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const recentChains = [...chains]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5);

  const handleViewChain = (chain: InterviewChain) => {
    console.log(`View chain with ID: ${chain.id}`);
    // Example: router.push(`/interview-chains/${chain.id}`);
  };

  if (!isInitialized || loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 3 }, // Reduced padding on small screens
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden", // Prevent horizontal scrolling
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          wrap="nowrap" // Prevent wrapping to avoid overflow
          sx={{ width: "100%" }}
        >
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
            <Box
              sx={{
                display: "flex",
                gap: 1, // Reduced gap
                alignItems: "center",
                maxWidth: { xs: "100%", sm: 400 }, // Responsive search bar width
              }}
            >
              <Paper
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: { xs: "100%", sm: 300 }, // Adjusted width
                  maxWidth: "100%",
                  borderRadius: 2,
                  boxSizing: "border-box",
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search..."
                  inputProps={{ "aria-label": "search" }}
                />
                <IconButton
                  type="button"
                  sx={{ p: "8px" }} // Reduced padding
                  aria-label="search"
                >
                  <Search />
                </IconButton>
              </Paper>
              <IconButton sx={{ p: "8px" }}>
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
        <Box sx={{ width: "100%" }}>
          <Grid container spacing={2}>
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

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: "#682A53" }}>
                    Revenue Overview
                  </Typography>
                  <Box sx={{ height: 250, width: "100%" }}>
                    <Line data={chartData} options={chartOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <ActivityTimeline />
            </Grid>
          </Grid>
        </Box>
      )}

      {activeTab === 1 && (
        <Box sx={{ width: "100%" }}>
          <InterviewChainDashboard
            stats={stats}
            recentChains={recentChains}
            onViewChain={handleViewChain}
          />
        </Box>
      )}
    </Box>
  );
}
