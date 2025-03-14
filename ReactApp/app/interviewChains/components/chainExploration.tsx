"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  useTheme,
} from "@mui/material";
import {
  Close,
  CalendarToday,
  Person,
  Check,
  Cancel,
  ArrowForward,
  ExpandMore,
  AccessTime,
  Feedback,
  Info,
} from "@mui/icons-material";
import type {
  Interview,
  InterviewChain,
} from "@/app/types/interviewChain/interviewChain";
import { useAuth } from "@/contexts/authContext";

interface ChainExplorationProps {
  chain: InterviewChain;
  open: boolean;
  onClose: () => void;
  onEndInterview: (
    chain: InterviewChain,
    isEditing: boolean,
    interview?: Interview
  ) => void;
  onAddNewInterview: (
    chain: InterviewChain,
    newInterview: Partial<Interview>
  ) => void;
  onUpdateChainStatus: (chainId: string, newStatus: string) => void;
  onEditInterview: (interview: Interview) => void;
}

export default function ChainExploration({
  chain,
  open,
  onClose,
  onEndInterview,
  onAddNewInterview,
  onUpdateChainStatus,
  onEditInterview,
}: ChainExplorationProps) {
  const theme = useTheme();
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | false>(false);
  const { roles } = useAuth();

  const userRole =
    roles.length > 0
      ? roles.includes("Admin")
        ? "Admin"
        : roles.includes("Sales_Executive")
        ? "Sales_Executive"
        : roles.includes("Senior_Recruiter")
        ? "Senior_Recruiter"
        : roles.includes("Recruiter")
        ? "Recruiter"
        : roles.includes("Resume_Writer")
        ? "Resume_Writer"
        : "Default"
      : "Default";

  const canEditChain = [
    "Admin",
    "Recruiter",
    "Senior_Recruiter",
    "Sales_Executive",
  ].includes(userRole);

  const getStatusColor = (status: string | null) => {
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
        return <ArrowForward color="info" />;
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

  const formatDateTime = (date: Date | string | null) => {
    if (!date) return "N/A";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleString();
  };

  const handleAccordionChange =
    (panel: string | undefined) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded && panel ? panel : false);
    };

  const handleEditInterviewDirectly = (interview: Interview) => {
    onEditInterview(interview);
  };

  const handleActionsClick = (
    event: React.MouseEvent<HTMLElement>,
    interview: Interview
  ) => {
    onEndInterview(chain, false, interview);
    event.stopPropagation();
  };

  const isLastInterview = (index: number) => {
    return index === chain.interviews.length - 1;
  };

  const showInterviewActions = (index: number, interview: Interview) => {
    return (
      isLastInterview(index) &&
      interview.InterviewStatus !== "Completed" &&
      interview.InterviewStatus !== "Cancelled"
    );
  };

  const showEditInterview = (index: number, interview: Interview) => {
    return true; // Show for all interviews
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          width: { xs: "90%", sm: "80%", md: "70%" },
          p: 2,
        },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Interview Chain Timeline</Typography>
          <IconButton edge="end" onClick={onClose} aria-label="close">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  fontWeight: 600,
                }}
              >
                {chain.clientName || "Unnamed Client"}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: theme.palette.primary.main }}
              >
                End Client: {chain.endClientName || "N/A"}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                {chain.position || "N/A"}
              </Typography>
            </Box>
            <Chip
              label={chain.status || "Unknown"}
              sx={{ bgcolor: getStatusColor(chain.status), color: "#fff" }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CalendarToday
                fontSize="small"
                sx={{ mr: 0.5, color: "text.secondary" }}
              />
              <Typography variant="body2">
                Created: {formatDate(chain.createdAt)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Person
                fontSize="small"
                sx={{ mr: 0.5, color: "text.secondary" }}
              />
              <Typography variant="body2">
                {chain.rounds} interview{chain.rounds !== 1 ? "s" : ""}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ maxHeight: 400, width: "100%", overflowY: "auto" }}>
          {chain.interviews.length > 0 ? (
            chain.interviews.map((interview, index) => (
              <Box
                key={`${interview.InterviewChainID || index}-${index}`}
                sx={{ px: 2, py: 1, width: "100%", boxSizing: "border-box" }}
              >
                <Accordion
                  disableGutters
                  elevation={1}
                  expanded={
                    expanded ===
                    (interview.InterviewChainID?.toString() || `index-${index}`)
                  }
                  onChange={handleAccordionChange(
                    interview.InterviewChainID?.toString() || `index-${index}`
                  )}
                  sx={{
                    width: "100%",
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: "4px",
                    mb: 1,
                    "&:before": { display: "none" },
                    "& .MuiAccordionDetails-root": {
                      display: "block",
                      overflow: "visible",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      "& .MuiAccordionSummary-content": {
                        flexGrow: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: "#682A53" }}
                      >
                        {interview.InterviewType || "N/A"} (Recruiter:{" "}
                        {chain.recruiterName || "N/A"})
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Chip
                          label={interview.InterviewStatus || "Unknown"}
                          size="small"
                          color={
                            interview.InterviewStatus === "Completed"
                              ? "success"
                              : "primary"
                          }
                        />
                        {interview.InterviewOutcome && (
                          <Chip
                            label={interview.InterviewOutcome}
                            size="small"
                            icon={getOutcomeIcon(interview.InterviewOutcome)}
                            color={
                              interview.InterviewOutcome === "Offer"
                                ? "success"
                                : interview.InterviewOutcome === "Rejected"
                                ? "error"
                                : "info"
                            }
                          />
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {showEditInterview(index, interview) && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={(e) => {
                            handleEditInterviewDirectly(interview);
                            e.stopPropagation();
                          }}
                        >
                          Edit Interview
                        </Button>
                      )}
                      {showInterviewActions(index, interview) && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={(e) => handleActionsClick(e, interview)}
                        >
                          Interview Actions
                        </Button>
                      )}
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      bgcolor: "background.paper",
                      p: 2,
                      minHeight: "60px",
                      overflowY: "auto",
                      maxHeight: "300px",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ mb: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, color: "#682A53" }}
                          >
                            Interview Date:
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CalendarToday
                              fontSize="small"
                              sx={{ mr: 0.5, color: "text.secondary" }}
                            />
                            <Typography variant="body2">
                              {formatDate(interview.InterviewDate)}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, color: "#682A53" }}
                          >
                            Start Time:
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <AccessTime
                              fontSize="small"
                              sx={{ mr: 0.5, color: "text.secondary" }}
                            />
                            <Typography variant="body2">
                              {interview.InterviewStartTime || "N/A"}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, color: "#682A53" }}
                          >
                            End Time:
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <AccessTime
                              fontSize="small"
                              sx={{ mr: 0.5, color: "text.secondary" }}
                            />
                            <Typography variant="body2">
                              {interview.InterviewEndTime || "N/A"}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ mb: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, color: "#682A53" }}
                          >
                            Entry Date:
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CalendarToday
                              fontSize="small"
                              sx={{ mr: 0.5, color: "text.secondary" }}
                            />
                            <Typography variant="body2">
                              {formatDateTime(interview.InterviewEntryDate)}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, color: "#682A53" }}
                          >
                            Support:
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Info
                              fontSize="small"
                              sx={{ mr: 0.5, color: "text.secondary" }}
                            />
                            <Typography variant="body2">
                              {interview.InterviewSupport || "N/A"}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, color: "#682A53" }}
                          >
                            Feedback:
                          </Typography>
                          <Box
                            sx={{ display: "flex", alignItems: "flex-start" }}
                          >
                            <Feedback
                              fontSize="small"
                              sx={{
                                mr: 0.5,
                                color: "text.secondary",
                                mt: 0.25,
                              }}
                            />
                            <Typography variant="body2">
                              {interview.InterviewFeedback || "N/A"}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No interviews available for this chain.
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
