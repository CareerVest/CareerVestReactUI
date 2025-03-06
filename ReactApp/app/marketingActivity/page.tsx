"use client";

import { Box, Typography } from "@mui/material";
import MarketingActivityDashboard from "./components/MarketingActivityDashboard";

export default function MarketingPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ color: "#682A53" }}>
          Marketing Activity
        </Typography>
      </Box>
      <MarketingActivityDashboard />
    </Box>
  );
}