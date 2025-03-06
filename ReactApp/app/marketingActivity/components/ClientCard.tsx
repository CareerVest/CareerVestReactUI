"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Grid,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import type {
  MarketingClient,
  MarketingInterview,
} from "@/app/types/MarketingActivity/Marketing";

interface ClientCardProps {
  client: MarketingClient;
  showOnlyToday: boolean;
  showOnlyStatus?: "scheduled" | "completed";
  onInterviewClick: (interview: MarketingInterview) => void;
  isExpanded: boolean; // New prop to control expansion state
  onToggleExpand: (clientId: string) => void; // New prop to notify parent of expansion toggle
  clientId: string; // New prop to identify the client
}

export function ClientCard({
  client,
  showOnlyToday,
  showOnlyStatus,
  onInterviewClick,
  isExpanded,
  onToggleExpand,
  clientId,
}: ClientCardProps) {
  const filteredInterviews = useMemo(() => {
    return client.interviews.filter((interview) => {
      if (showOnlyToday) {
        const today = new Date().toDateString();
        const interviewDate = new Date(interview.date).toDateString();
        if (today !== interviewDate) return false;
      }
      if (showOnlyStatus && interview.status !== showOnlyStatus) return false;
      return true;
    });
  }, [client.interviews, showOnlyToday, showOnlyStatus]);

  if (filteredInterviews.length === 0) return null;

  const handleExpandClick = () => {
    onToggleExpand(clientId); // Notify parent to handle expansion/collapse
  };

  return (
    <Card
      onClick={handleExpandClick} // Add click handler to the entire card
      sx={{
        mb: 2,
        borderRadius: 2,
        border: "1px solid rgba(104, 42, 83, 0.1)",
        overflow: "visible",
        cursor: "pointer", // Indicate clickable area
        "&:hover": {
          bgcolor: "rgba(104, 42, 83, 0.05)", // Hover effect for the entire card
        },
      }}
    >
      <CardHeader
        title={
          <Box
            sx={{
              display: "flex",
              alignItems: "center", // Always center vertically, whether collapsed or expanded
              justifyContent: "space-between",
              height: "100%", // Ensure full height for centering
              minHeight: "72px", // Match MUI CardHeader default height for consistency
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#682A53",
                fontWeight: 600,
                flexGrow: 1, // Allow text to grow and center properly
              }}
            >
              {client.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={`Screening:${client.screeningCount}`}
                size="small"
                sx={{
                  bgcolor: "rgba(104, 42, 83, 0.1)",
                  color: "#682A53",
                  border: "1px solid rgba(104, 42, 83, 0.2)",
                }}
              />
              <Chip
                label={`Technical:${client.technicalCount}`}
                size="small"
                sx={{
                  bgcolor: "rgba(104, 42, 83, 0.1)",
                  color: "#682A53",
                  border: "1px solid rgba(104, 42, 83, 0.2)",
                }}
              />
              <Chip
                label={`Final:${client.finalRoundCount}`}
                size="small"
                sx={{
                  bgcolor: "rgba(104, 42, 83, 0.1)",
                  color: "#682A53",
                  border: "1px solid rgba(104, 42, 83, 0.2)",
                }}
              />
              <IconButton onClick={handleExpandClick} sx={{ color: "#682A53" }}>
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Box>
        }
        sx={{ pb: 0, pt: 0 }} // Remove default padding to control layout
      />
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Grid container spacing={2}>
            {filteredInterviews.map((interview) => (
              <Grid item xs={12} sm={6} md={4} key={interview.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "rgba(104, 42, 83, 0.05)",
                    },
                    border: "1px solid rgba(104, 42, 83, 0.1)",
                    height: "100%",
                  }}
                  onClick={() => onInterviewClick(interview)}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 500, color: "#682A53" }}
                      >
                        {interview.company}
                      </Typography>
                      <Chip
                        label={interview.type}
                        size="small"
                        sx={{
                          bgcolor: "#FDC500",
                          color: "#682A53",
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {interview.tech}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {interview.time}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
}
