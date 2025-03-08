"use client";

import { useMemo, useState, useEffect } from "react";
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
  useMediaQuery,
  useTheme,
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
  standupMode: boolean;
  onInterviewClick: (interview: MarketingInterview) => void;
  isExpanded: boolean;
  onToggleExpand: (clientId: string) => void;
  clientId: string;
  activeInterviewId: number | null;
  section: "received" | "scheduled" | "filtered";
}

export function ClientCard({
  client,
  standupMode,
  onInterviewClick,
  isExpanded,
  onToggleExpand,
  clientId,
  activeInterviewId,
  section,
}: ClientCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // <600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px - 900px
  const isLaptop = useMediaQuery(theme.breakpoints.between("md", "lg")); // 900px - 1200px
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg")); // >1200px

  // Dynamically calculate columns based on screen size and standupMode
  const getColumns = () => {
    if (standupMode) {
      // Standup Mode: Max 2 cards per row
      if (isMobile) return 12; // 1 card per row on mobile
      return 6; // 2 cards per row on tablet and larger
    } else {
      // Non-Standup Mode: Max 4 cards per row
      if (isMobile) return 12; // 1 card per row on mobile
      if (isTablet) return 6; // 2 cards per row on tablet
      if (isLaptop) return 4; // 3 cards per row on laptop
      if (isDesktop) return 3; // 4 cards per row on desktop
      return 3; // Default to 4 cards
    }
  };

  const [columns, setColumns] = useState(getColumns());

  useEffect(() => {
    setColumns(getColumns()); // Update columns on screen size or mode change
  }, [isMobile, isTablet, isLaptop, isDesktop, standupMode]);

  const filteredInterviews = useMemo(() => {
    if (standupMode) {
      return client.interviews;
    }
    return client.interviews;
  }, [client.interviews, standupMode]);

  // Create a unique clientId based on the section
  const uniqueClientId = `${section}-${clientId}`;

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(uniqueClientId); // Use the unique ID
  };

  const handleInterviewClick =
    (interview: MarketingInterview) => (e: React.MouseEvent) => {
      e.stopPropagation();
      onInterviewClick(interview);
    };

  return (
    <Card
      onClick={handleExpandClick}
      sx={{
        mb: 2,
        borderRadius: 2,
        border: "1px solid rgba(104, 42, 83, 0.1)",
        overflow: "visible",
        cursor: "pointer",
        "&:hover": { bgcolor: "rgba(104, 42, 83, 0.05)" },
        transition: "all 0.3s ease",
      }}
    >
      <CardHeader
        title={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: "48px",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ color: "#682A53", fontWeight: 500, flexGrow: 1 }}
            >
              {client.clientName || "Unnamed Client"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Chip
                label={`S: ${client.screeningCount || 0}`}
                size="small"
                sx={{
                  bgcolor: "rgba(104, 42, 83, 0.1)",
                  color: "#682A53",
                  border: "1px solid rgba(104, 42, 83, 0.2)",
                  fontSize: "0.75rem",
                  height: 18,
                }}
              />
              <Chip
                label={`T: ${client.technicalCount || 0}`}
                size="small"
                sx={{
                  bgcolor: "rgba(104, 42, 83, 0.1)",
                  color: "#682A53",
                  border: "1px solid rgba(104, 42, 83, 0.2)",
                  fontSize: "0.75rem",
                  height: 18,
                }}
              />
              <Chip
                label={`F: ${client.finalRoundCount || 0}`}
                size="small"
                sx={{
                  bgcolor: "rgba(104, 42, 83, 0.1)",
                  color: "#682A53",
                  border: "1px solid rgba(104, 42, 83, 0.2)",
                  fontSize: "0.75rem",
                  height: 18,
                }}
              />
              <IconButton
                onClick={handleExpandClick}
                sx={{ color: "#682A53", p: 0.5 }}
              >
                {isExpanded ? (
                  <ExpandLessIcon fontSize="small" />
                ) : (
                  <ExpandMoreIcon fontSize="small" />
                )}
              </IconButton>
            </Box>
          </Box>
        }
        sx={{ pb: 0, pt: 0 }}
      />
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ p: 1.5 }}>
          <Grid container spacing={1}>
            {filteredInterviews.map((interview) => (
              <Grid item xs={columns} key={interview.interviewID}>
                <Card
                  sx={{
                    cursor: "pointer",
                    "&:hover": { bgcolor: "rgba(104, 42, 83, 0.05)" },
                    border:
                      activeInterviewId === interview.interviewID
                        ? "2px solid #682A53"
                        : "1px solid rgba(104, 42, 83, 0.1)",
                    bgcolor:
                      activeInterviewId === interview.interviewID
                        ? "rgba(104, 42, 83, 0.05)"
                        : "white",
                    height: "auto",
                    maxHeight: "200px",
                    overflowY: "auto",
                    transition: "all 0.3s ease",
                  }}
                  onClick={handleInterviewClick(interview)}
                >
                  <CardContent sx={{ p: 1.5 }}>
                    {/* Interview Type First */}
                    <Box sx={{ mb: 0.5 }}>
                      <Chip
                        label={interview.interviewType || "N/A"}
                        size="small"
                        sx={{
                          bgcolor: "#FDC500",
                          color: "#682A53",
                          fontSize: "0.75rem",
                          height: 20,
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                    {/* End Client Name Below, Bold */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#682A53",
                        fontWeight: 600,
                        mb: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      End Client: {interview.endClientName || "N/A"}
                    </Typography>
                    {/* Two-Column Layout for Other Fields */}
                    <Grid container spacing={0.5}>
                      <Grid item xs={4}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "0.85rem" }}
                        >
                          Tech:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.85rem", color: "#333" }}
                        >
                          {interview.technology || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "0.85rem" }}
                        >
                          Method:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.85rem", color: "#333" }}
                        >
                          {interview.interviewMethod || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "0.85rem" }}
                        >
                          Time:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.85rem", color: "#333" }}
                        >
                          {interview.time || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "0.85rem" }}
                        >
                          Status:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.85rem", color: "#333" }}
                        >
                          {interview.interviewStatus || "N/A"}
                        </Typography>
                      </Grid>
                    </Grid>
                    {/* Additional Fields at Bottom */}
                    {(interview.interviewFeedback ||
                      interview.interviewSupport ||
                      interview.comments) && (
                      <Box
                        sx={{
                          mt: 1,
                          borderTop: "1px solid rgba(104, 42, 83, 0.1)",
                          pt: 0.5,
                        }}
                      >
                        {interview.interviewFeedback && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: "0.8rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              mb: 0.5,
                            }}
                          >
                            Feedback: {interview.interviewFeedback}
                          </Typography>
                        )}
                        {interview.interviewSupport && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: "0.8rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              mb: 0.5,
                            }}
                          >
                            Support: {interview.interviewSupport}
                          </Typography>
                        )}
                        {interview.comments && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: "0.8rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            Comments: {interview.comments}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {filteredInterviews.length === 0 && (
              <Box
                sx={{
                  p: 1,
                  color: "text.secondary",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                No interviews available for this client.
              </Box>
            )}
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
}
