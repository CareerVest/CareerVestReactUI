"use client";

import { useState } from "react";
import { Box, Typography, Container, Button } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import InterviewChainDashboard from "../components/interviewChainDashboard";
import { dummyInterviewChains, dummyInterviewChainStats } from "../dummyInterviewChainsData";

export default function InterviewChainDashboardPage() {
  const router = useRouter();
  const [stats] = useState(dummyInterviewChainStats);

  // Get recent chains
  const recentChains = [...dummyInterviewChains]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const handleViewChain = () => {
    router.push("/interview-chain/search");
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <div>
            <Typography variant="h4" component="h1" gutterBottom>
              Interview Chain Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Overview of all interview chains and key metrics
            </Typography>
          </div>
          <Button variant="contained" startIcon={<Search />} onClick={() => router.push("/interview-chain/search")}>
            Search & Manage
          </Button>
        </Box>

        <InterviewChainDashboard stats={stats} recentChains={recentChains} onViewChain={handleViewChain} />
      </Box>
    </Container>
  );
}