"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Chip,
  Button,
  Paper,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Close,
  CalendarToday,
  LocationOn,
  Person,
  Check,
  Cancel,
  ArrowForward,
  Timeline,
  Info,
  History,
  Add as AddIcon,
} from "@mui/icons-material";
import type {
  InterviewChain,
  Interview,
} from "@/app/types/interviewChain/interviewChain";
import EndInterviewDialog from "./endInterviewDialog";

interface ChainExplorationProps {
  chain: InterviewChain;
  open: boolean;
  onClose: () => void;
  onEndInterview: (chain: InterviewChain) => void;
  onAddNewInterview: (
    chain: InterviewChain,
    newInterview: Partial<Interview>
  ) => void;
}

export default function ChainExploration({
  chain,
  open,
  onClose,
  onEndInterview,
  onAddNewInterview,
}: ChainExplorationProps) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [openNewInterviewDialog, setOpenNewInterviewDialog] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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

  const getOutcomeIcon = (outcome?: string): React.ReactElement | undefined => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleAddInterview = () => {
    setOpenNewInterviewDialog(true);
  };

  const handleNewInterviewSubmit = (
    outcome: "Next" | "Rejected" | "Offer" | "AddNew",
    newInterview?: Partial<Interview> & {
      clientName?: string;
      position?: string;
    }
  ) => {
    if ((outcome === "Next" || outcome === "AddNew") && newInterview) {
      // Remove clientName and position since they are not part of Interview type
      const { clientName, position, ...interviewData } = newInterview;
      onAddNewInterview(chain, interviewData);
    }
    setOpenNewInterviewDialog(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Interview Chain Details</Typography>
          <IconButton edge="end" onClick={onClose} aria-label="close">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Header */}
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
              <Typography variant="h5">{chain.clientName}</Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {chain.position}
              </Typography>
            </Box>
            <Chip
              label={chain.status}
              sx={{ bgcolor: getStatusColor(chain.status), color: "#fff" }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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

        <Divider sx={{ mb: 2 }} />

        {/* Tabs */}
        <Box sx={{ mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="chain tabs"
          >
            <Tab icon={<Timeline />} label="Timeline" />
            <Tab icon={<Info />} label="Details" />
            <Tab icon={<History />} label="History" />
          </Tabs>
        </Box>

        {/* Add New Interview Button */}
        {chain.status === "Active" && (
          <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddInterview}
            >
              Add New Interview
            </Button>
          </Box>
        )}

        {/* Timeline Tab */}
        {activeTab === 0 && (
          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                position: "absolute",
                left: 20,
                top: 0,
                bottom: 0,
                width: 2,
                bgcolor: "divider",
                zIndex: 0,
              }}
            />

            {chain.interviews.map((interview, index) => (
              <Box
                key={interview.id}
                sx={{ position: "relative", pl: 5, pb: 4, zIndex: 1 }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: 16,
                    top: 0,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor:
                      interview.status === "Completed"
                        ? getStatusColor(
                            interview.outcome === "Rejected"
                              ? "Unsuccessful"
                              : interview.outcome === "Offer"
                              ? "Successful"
                              : "Active"
                          )
                        : theme.palette.grey[400],
                    border: `2px solid ${theme.palette.background.paper}`,
                    zIndex: 2,
                  }}
                />

                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    borderLeft: `4px solid ${
                      interview.status === "Completed"
                        ? getStatusColor(
                            interview.outcome === "Rejected"
                              ? "Unsuccessful"
                              : interview.outcome === "Offer"
                              ? "Successful"
                              : "Active"
                          )
                        : theme.palette.grey[400]
                    }`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6">{interview.type}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Chip
                        label={interview.status}
                        size="small"
                        color={
                          interview.status === "Completed"
                            ? "success"
                            : interview.status === "Scheduled"
                            ? "primary"
                            : "default"
                        }
                        sx={{ mr: 1 }}
                      />
                      {interview.outcome && (
                        <Chip
                          label={interview.outcome}
                          size="small"
                          icon={getOutcomeIcon(interview.outcome)}
                          color={
                            interview.outcome === "Offer"
                              ? "success"
                              : interview.outcome === "Rejected"
                              ? "error"
                              : "info"
                          }
                        />
                      )}
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CalendarToday
                        fontSize="small"
                        sx={{ mr: 0.5, color: "text.secondary" }}
                      />
                      <Typography variant="body2">
                        {formatDate(interview.date)}
                      </Typography>
                    </Box>

                    {interview.interviewer && (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Person
                          fontSize="small"
                          sx={{ mr: 0.5, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          {interview.interviewer}
                        </Typography>
                      </Box>
                    )}

                    {interview.location && (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <LocationOn
                          fontSize="small"
                          sx={{ mr: 0.5, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          {interview.location}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {interview.notes && (
                    <Box
                      sx={{
                        bgcolor: "background.default",
                        p: 1.5,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2">{interview.notes}</Typography>
                    </Box>
                  )}

                  {index === chain.interviews.length - 1 &&
                    interview.status === "Scheduled" &&
                    chain.status === "Active" && (
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => onEndInterview(chain)}
                        >
                          End Interview
                        </Button>
                      </Box>
                    )}
                </Paper>
              </Box>
            ))}
          </Box>
        )}

        {/* Details Tab */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Client Information
            </Typography>
            <Paper sx={{ p: 2, mb: 3 }}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Client Name"
                    secondary={chain.clientName}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Info />
                  </ListItemIcon>
                  <ListItemText primary="Position" secondary={chain.position} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText
                    primary="Created"
                    secondary={formatDate(chain.createdAt)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Timeline />
                  </ListItemIcon>
                  <ListItemText primary="Status" secondary={chain.status} />
                </ListItem>
              </List>
            </Paper>

            <Typography variant="h6" gutterBottom>
              Latest Interview
            </Typography>
            <Paper sx={{ p: 2 }}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Info />
                  </ListItemIcon>
                  <ListItemText
                    primary="Type"
                    secondary={chain.latestInterview.type}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Timeline />
                  </ListItemIcon>
                  <ListItemText
                    primary="Status"
                    secondary={chain.latestInterview.status}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText
                    primary="Date"
                    secondary={formatDate(chain.latestInterview.date)}
                  />
                </ListItem>
              </List>
            </Paper>
          </Box>
        )}

        {/* History Tab */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Interview History
            </Typography>
            <Paper sx={{ p: 2 }}>
              <List>
                {chain.interviews.map((interview) => (
                  <ListItem key={interview.id} divider>
                    <ListItemIcon>
                      {interview.status === "Completed" ? (
                        interview.outcome === "Offer" ? (
                          <Check color="success" />
                        ) : interview.outcome === "Rejected" ? (
                          <Cancel color="error" />
                        ) : (
                          <ArrowForward color="info" />
                        )
                      ) : (
                        <CalendarToday color="primary" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={interview.type}
                      secondary={
                        <>
                          {interview.status} • {formatDate(interview.date)}
                          {interview.outcome &&
                            ` • Outcome: ${interview.outcome}`}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        )}

        {/* New Interview Dialog */}
        <EndInterviewDialog
          open={openNewInterviewDialog}
          onClose={() => setOpenNewInterviewDialog(false)}
          chain={chain}
          onSubmit={handleNewInterviewSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
