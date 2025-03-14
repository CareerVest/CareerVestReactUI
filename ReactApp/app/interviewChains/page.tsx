"use client";

import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { theme } from "@/styles/theme";
import InterviewChainManager from "./components/interviewChainManager";

export default function InterviewChainPage() {
  const [openAddDialog, setOpenAddDialog] = useState(false); // State to control AddInterviewDialog

  // const handleOpenAddDialog = () => {
  //   setOpenAddDialog(true); // Open the AddInterviewDialog
  // };

  return (
    <Box
      sx={{ p: 3, width: "100%", overflowX: "hidden", boxSizing: "border-box" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ color: "#682A53" }}>
          Interview Chain
        </Typography>
      </Box>
      <InterviewChainManager
        openAddDialog={openAddDialog}
        setOpenAddDialog={setOpenAddDialog}
      />
    </Box>
  );
}
