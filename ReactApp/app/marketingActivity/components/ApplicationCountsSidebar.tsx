"use client";

import { useState, useEffect } from "react";
import { Box, Grid, TextField, Button, Typography, Paper } from "@mui/material";
import type { MarketingClient } from "@/app/types/MarketingActivity/Marketing";
import { fetchMarketingActivitiesForDate } from "../actions/MarketingActivityActions";
import type { MarketingActivityCount } from "@/app/types/MarketingActivity/Marketing";

interface ApplicationCounts {
  totalManualApplications: number;
  totalEasyApplications: number;
  totalReceivedInterviews: number;
}

interface ApplicationCountsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  clients: MarketingClient[];
  onSubmit: (counts: Record<string, ApplicationCounts>) => void;
  applicationCounts?: Record<string, MarketingActivityCount>;
}

export function ApplicationCountsSidebar({
  isOpen,
  onClose,
  clients,
  onSubmit,
  applicationCounts = {},
}: ApplicationCountsSidebarProps) {
  const [applicationCountsState, setApplicationCountsState] = useState<Record<string, ApplicationCounts>>({});

  useEffect(() => {
    const loadExistingCounts = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const counts = await fetchMarketingActivitiesForDate(today);
        const initialCounts = counts.reduce(
          (acc, count) => ({
            ...acc,
            [count.ClientID.toString()]: {
              totalManualApplications: count.TotalManualApplications,
              totalEasyApplications: count.TotalEasyApplications,
              totalReceivedInterviews: count.TotalReceivedInterviews,
            },
          }),
          {} as Record<string, ApplicationCounts>
        );
        setApplicationCountsState(initialCounts);
      } catch (error) {
        console.error("Error loading existing application counts:", error);
        setApplicationCountsState({});
      }
    };
    if (isOpen) loadExistingCounts();
  }, [isOpen]);

  const handleInputChange = (clientId: string, field: keyof ApplicationCounts, value: string) => {
    const numValue = Number.parseInt(value, 10) || 0;
    setApplicationCountsState((prev) => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        [field]: numValue,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(applicationCountsState);
    onClose();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxHeight: "70vh", overflow: "auto", pr: 1, p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: "#682A53" }}>
        Enter Daily Application Counts
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Please enter the number of applications and interviews received for each client today.
      </Typography>

      <Box sx={{ mt: 3, mb: 4 }}>
        {clients.map((client) => (
          <Paper
            key={client.id}
            elevation={1}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              border: "1px solid rgba(104, 42, 83, 0.1)",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#682A53", mb: 2 }}>
              {client.name}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Manual Applications"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  value={applicationCountsState[client.id]?.totalManualApplications || ""}
                  onChange={(e) => handleInputChange(client.id, "totalManualApplications", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Easy Applications"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  value={applicationCountsState[client.id]?.totalEasyApplications || ""}
                  onChange={(e) => handleInputChange(client.id, "totalEasyApplications", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Received Interviews"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  value={applicationCountsState[client.id]?.totalReceivedInterviews || ""}
                  onChange={(e) => handleInputChange(client.id, "totalReceivedInterviews", e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: "rgba(104, 42, 83, 0.2)",
            color: "#682A53",
            "&:hover": {
              bgcolor: "#682A53",
              color: "white",
              borderColor: "#682A53",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            bgcolor: "#FDC500",
            color: "#682A53",
            "&:hover": {
              bgcolor: "#682A53",
              color: "white",
            },
          }}
        >
          Submit Application Counts
        </Button>
      </Box>
    </Box>
  );
}