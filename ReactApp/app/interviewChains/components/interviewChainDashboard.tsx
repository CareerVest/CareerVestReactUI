"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Avatar,
  IconButton,
  CircularProgress,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Dialog,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Refresh,
  Check,
  Cancel,
  AccessTime,
  Visibility,
  Warning,
  Search,
  TrendingUp,
  TrendingDown,
  HourglassEmpty,
  Work,
  ExpandMore,
  CalendarToday,
  Person,
  ArrowForward,
  Comment,
  Info,
  Close,
} from "@mui/icons-material";
import { useInterviewChains } from "./hooks/useInterviewChains";
import { getInterviewChain } from "../../interviewChains/actions/interviewChainActions";
import EditInterviewDialog from "./editInterviewDialog";
import EndInterviewDialog from "./endInterviewDialog";
import type {
  InterviewChain,
  InterviewChainStats,
  Interview,
} from "@/app/types/interviewChain/interviewChain";

interface InterviewChainDashboardProps {
  stats: InterviewChainStats;
  recentChains: InterviewChain[];
  onViewChain: (chain: InterviewChain) => void;
}

type TimeFilter =
  | "All"
  | "Daily"
  | "This Week"
  | "Last Week"
  | "Next Week"
  | "Last Month"
  | "Last Quarter"
  | "This Quarter"
  | "Year"
  | "Last Year";

interface ClientData {
  name: string;
  count: number;
  offers: number;
  chains: InterviewChain[];
}

interface RecruiterData {
  name: string;
  total: number;
  offers: number;
  active: number;
  chains: InterviewChain[];
}

type ActiveTable =
  | "total"
  | "active"
  | "successful"
  | "unsuccessful"
  | "pending"
  | null;

// Reusable Interview Chain Details Modal Component
const InterviewChainDetailsModal = ({
  chain,
  open,
  onClose,
  isLoading,
}: {
  chain: InterviewChain | null;
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    if (!open) {
      setExpanded(false);
    }
  }, [open]);

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

  const formatTime12Hour = (time: string | null) => {
    if (!time) return "N/A";
    const [hours, minutes] = time.split(":");
    let hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? "PM" : "AM";
    hourNum = hourNum % 12 || 12;
    return `${hourNum}:${minutes} ${period}`;
  };

  const handleAccordionChange =
    (panel: string | undefined) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded && panel ? panel : false);
    };

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 3,
          }}
        >
          <CircularProgress size={40} sx={{ color: "#682A53" }} />
        </Box>
      </Dialog>
    );
  }

  if (!chain) return null;

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
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          bgcolor: "#f9f9f9",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#682A53" }}>
          Interview Chain Timeline
        </Typography>
        <IconButton edge="end" onClick={onClose} aria-label="close">
          <Close />
        </IconButton>
      </Box>
      <Box sx={{ p: 2 }}>
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
                  color: "#682A53",
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                              {formatTime12Hour(interview.InterviewStartTime)}
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
                              {formatTime12Hour(interview.InterviewEndTime)}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, color: "#682A53" }}
                          >
                            Comments:
                          </Typography>
                          <Box
                            sx={{ display: "flex", alignItems: "flex-start" }}
                          >
                            <Comment
                              fontSize="small"
                              sx={{
                                mr: 0.5,
                                color: "text.secondary",
                                mt: 0.25,
                              }}
                            />
                            <Typography variant="body2">
                              {interview.Comments || "N/A"}
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
                              {formatDate(interview.InterviewEntryDate)}
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
                            Interview Method:
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Info
                              fontSize="small"
                              sx={{ mr: 0.5, color: "text.secondary" }}
                            />
                            <Typography variant="body2">
                              {interview.InterviewMethod || "N/A"}
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
      </Box>
    </Dialog>
  );
};

export default function InterviewChainDashboard({
  stats: initialStats,
  recentChains: initialRecentChains,
  onViewChain,
}: InterviewChainDashboardProps) {
  const theme = useTheme();
  const {
    chains,
    stats,
    loading,
    fetchError,
    fetchChains,
    addInterview,
    editInterview,
    endInterview,
    updateChainStatus,
  } = useInterviewChains();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("All");
  const [searchText, setSearchText] = useState<string>("");
  const [selectedRecruiter, setSelectedRecruiter] = useState<string | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [modalContent, setModalContent] = useState<
    "recruiter" | "chain" | null
  >(null);
  const [selectedChainDetails, setSelectedChainDetails] =
    useState<InterviewChain | null>(null);
  const [activeTable, setActiveTable] = useState<ActiveTable>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openEndDialog, setOpenEndDialog] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<
    Interview | undefined
  >(undefined);
  const [loadingChainId, setLoadingChainId] = useState<string | null>(null); // New state for spinner

  const effectiveStats = stats.totalChains > 0 ? stats : initialStats;

  const filterChainsBySearch = useCallback(
    (chains: InterviewChain[], search: string) => {
      if (!search.trim()) return chains;
      const searchLower = search.toLowerCase().trim();
      const searchTerms = searchLower.split(/\s+/);

      const searchableChains = chains.map((chain) => ({
        chain,
        fields: [
          chain.endClientName?.toLowerCase() || "",
          chain.clientName?.toLowerCase() || "",
          chain.recruiterName?.toLowerCase() || "",
          chain.position?.toLowerCase() || "",
          chain.status?.toLowerCase() || "",
          chain.latestInterviewType?.toLowerCase() || "",
          chain.latestInterviewStatus?.toLowerCase() || "",
          chain.id?.toString() || "",
          chain.rounds?.toString() || "",
          chain.latestInterviewDate?.toString().toLowerCase() || "",
          chain.interviews
            .map((i) => i.InterviewType?.toLowerCase() || "")
            .join(" ") || "",
          chain.interviews
            .map((i) => i.InterviewStatus?.toLowerCase() || "")
            .join(" ") || "",
        ],
      }));

      return searchableChains
        .filter(({ fields }) =>
          searchTerms.every((term) =>
            fields.some((field) => field.includes(term))
          )
        )
        .map(({ chain }) => chain);
    },
    []
  );

  const effectiveRecentChains = useMemo(() => {
    const sortedChains =
      chains.length > 0
        ? chains.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
        : initialRecentChains;
    return filterChainsBySearch(sortedChains, searchText);
  }, [chains, initialRecentChains, searchText, filterChainsBySearch]);

  useEffect(() => {
    if (!loading && fetchError) {
      console.error("Failed to load interview chains:", fetchError);
    }
  }, [loading, fetchError]);

  const handleRefresh = () => {
    // Reset all states to initial values
    setIsRefreshing(true);
    setTimeFilter("All");
    setSearchText("");
    setSelectedRecruiter(null);
    setOpenDialog(false);
    setModalContent(null);
    setSelectedChainDetails(null);
    setActiveTable(null);
    setOpenEditDialog(false);
    setOpenEndDialog(false);
    setSelectedInterview(undefined);
    setLoadingChainId(null);
    fetchChains()
      .catch((error) => console.error("Refresh failed:", error))
      .finally(() => setIsRefreshing(false));
  };

  const handleCardClick = (type: ActiveTable) => {
    setActiveTable((prev) => (prev === type ? null : type));
  };

  const handleViewChainClick = async (chain: InterviewChain) => {
    setLoadingChainId(chain.id); // Show spinner for this chain
    try {
      const detailedChain = await getInterviewChain(parseInt(chain.id));
      if (detailedChain) {
        const normalizedChain: InterviewChain = {
          id: detailedChain.id.toString(),
          endClientName: detailedChain.endClientName || "",
          clientName: detailedChain.clientName || "",
          recruiterName: detailedChain.recruiterName || "",
          position: detailedChain.position || "",
          status: detailedChain.status || "",
          interviews: detailedChain.interviews.map(
            (interview: any) =>
              ({
                InterviewChainID: interview.InterviewChainID,
                ParentInterviewChainID:
                  interview.ParentInterviewChainID || null,
                ClientID: interview.ClientID || null,
                EndClientName: interview.EndClientName || "",
                Position: interview.Position || "",
                ChainStatus: interview.ChainStatus || "",
                Rounds: interview.Rounds || 0,
                InterviewEntryDate: interview.InterviewEntryDate
                  ? new Date(interview.InterviewEntryDate)
                  : null,
                RecruiterID: interview.RecruiterID || null,
                InterviewDate: interview.InterviewDate
                  ? new Date(interview.InterviewDate)
                  : null,
                InterviewStartTime: interview.InterviewStartTime || null,
                InterviewEndTime: interview.InterviewEndTime || null,
                InterviewMethod: interview.InterviewMethod || null,
                InterviewType: interview.InterviewType || null,
                InterviewStatus: interview.InterviewStatus || "",
                InterviewOutcome: interview.InterviewOutcome || null,
                InterviewSupport: interview.InterviewSupport || null,
                InterviewFeedback: interview.InterviewFeedback || null,
                Comments: interview.Comments || null,
                CreatedTS: interview.CreatedTS
                  ? new Date(interview.CreatedTS)
                  : null,
                UpdatedTS: interview.UpdatedTS
                  ? new Date(interview.UpdatedTS)
                  : null,
                CreatedBy: interview.CreatedBy || null,
                UpdatedBy: interview.UpdatedBy || null,
              } as Interview)
          ),
          rounds: detailedChain.rounds || 0,
          createdAt: "",
          updatedAt: chain.updatedAt || "",
          latestInterview: null,
          latestInterviewDate: chain.latestInterviewDate || null,
          latestInterviewStatus: chain.latestInterviewStatus || null,
          latestInterviewType: chain.latestInterviewType || null,
        };
        setSelectedChainDetails(normalizedChain);
        setModalContent("chain");
        setOpenDialog(true);
      }
    } catch (error) {
      console.error("Failed to fetch chain details:", error);
    } finally {
      setLoadingChainId(null); // Hide spinner
    }
  };

  const getStatusColor = (status: string | null | undefined) => {
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

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString();
  };

  const formatTime = (time: string | null) => {
    if (!time) return "N/A";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const adjustedHour = hour % 12 || 12;
    return `${adjustedHour}:${minutes} ${period}`;
  };

  const filterChainsByTime = (chains: InterviewChain[]) => {
    if (timeFilter === "All") return chains;
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );

    const timeRanges: Record<
      TimeFilter,
      { start: Date; end: Date } | undefined
    > = {
      All: undefined,
      Daily: { start: startOfDay, end: endOfDay },
      "This Week": {
        start: new Date(
          startOfDay.getFullYear(),
          startOfDay.getMonth(),
          startOfDay.getDate() - startOfDay.getDay()
        ),
        end: endOfDay,
      },
      "Last Week": {
        start: new Date(
          startOfDay.getFullYear(),
          startOfDay.getMonth(),
          startOfDay.getDate() - startOfDay.getDay() - 7
        ),
        end: new Date(
          startOfDay.getFullYear(),
          startOfDay.getMonth(),
          startOfDay.getDate() - startOfDay.getDay() - 1,
          23,
          59,
          59,
          999
        ),
      },
      "Next Week": {
        start: new Date(
          startOfDay.getFullYear(),
          startOfDay.getMonth(),
          startOfDay.getDate() - startOfDay.getDay() + 7
        ),
        end: new Date(
          startOfDay.getFullYear(),
          startOfDay.getMonth(),
          startOfDay.getDate() - startOfDay.getDay() + 13,
          23,
          59,
          59,
          999
        ),
      },
      "Last Month": {
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        end: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999),
      },
      "Last Quarter": {
        start: new Date(now.getFullYear(), now.getMonth() - 3, 1),
        end: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999),
      },
      "This Quarter": {
        start: new Date(
          now.getFullYear(),
          Math.floor(now.getMonth() / 3) * 3,
          1
        ),
        end: new Date(
          now.getFullYear(),
          Math.floor(now.getMonth() / 3) * 3 + 2,
          31,
          23,
          59,
          59,
          999
        ),
      },
      Year: {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999),
      },
      "Last Year": {
        start: new Date(now.getFullYear() - 1, 0, 1),
        end: new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999),
      },
    };

    const range = timeRanges[timeFilter];
    if (!range) return chains;

    const { start, end } = range;
    return chains.filter((chain) => {
      if (chain.interviews && chain.interviews.length > 0) {
        return chain.interviews.some((i) => {
          if (!i.InterviewDate) return false;
          const interviewDate = new Date(i.InterviewDate);
          return interviewDate >= start && interviewDate <= end;
        });
      }
      if (chain.latestInterviewDate) {
        const latestDate = new Date(chain.latestInterviewDate);
        return latestDate >= start && latestDate <= end;
      }
      return false;
    });
  };

  const filteredChains = useMemo(() => {
    const timeFiltered = filterChainsByTime(chains);
    return filterChainsBySearch(timeFiltered, searchText);
  }, [chains, timeFilter, searchText, filterChainsBySearch]);

  const clientPerformance = useMemo(() => {
    const clientMap = filteredChains.reduce((acc, c) => {
      const name = c.clientName || "Unknown";
      acc[name] = acc[name] || { count: 0, offers: 0, chains: [] };
      acc[name].count++;
      acc[name].offers += c.interviews.filter(
        (i) => i.InterviewOutcome === "Offer"
      ).length;
      acc[name].chains.push(c);
      return acc;
    }, {} as Record<string, { count: number; offers: number; chains: InterviewChain[] }>);
    return Object.entries(clientMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [filteredChains]);

  const recruiterPerformance = useMemo(() => {
    const recruiterMap = filteredChains.reduce((acc, c) => {
      const recruiter = c.recruiterName || "Unknown";
      acc[recruiter] = acc[recruiter] || {
        total: 0,
        offers: 0,
        active: 0,
        chains: [],
      };
      acc[recruiter].total += c.interviews.length;
      acc[recruiter].offers += c.interviews.filter(
        (i) => i.InterviewOutcome === "Offer"
      ).length;
      acc[recruiter].active += c.status === "Active" ? 1 : 0;
      acc[recruiter].chains.push(c);
      return acc;
    }, {} as Record<string, { total: number; offers: number; active: number; chains: InterviewChain[] }>);
    return Object.entries(recruiterMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [filteredChains]);

  const calculateAverageDuration = () => {
    const durations = filteredChains
      .flatMap((chain) => chain.interviews)
      .filter(
        (i) => i.InterviewStartTime && i.InterviewEndTime && i.InterviewDate
      )
      .map((i) => {
        const start = new Date(
          `${i.InterviewDate?.toISOString().split("T")[0]}T${
            i.InterviewStartTime
          }`
        );
        const end = new Date(
          `${i.InterviewDate?.toISOString().split("T")[0]}T${
            i.InterviewEndTime
          }`
        );
        return (end.getTime() - start.getTime()) / (1000 * 60);
      });
    return durations.length
      ? (durations.reduce((sum, d) => sum + d, 0) / durations.length).toFixed(1)
      : "N/A";
  };

  const getPendingActions = () =>
    filteredChains.filter(
      (c) =>
        c.interviews.some(
          (i) =>
            (i.InterviewStatus === "Scheduled" ||
              i.InterviewStatus === "Pending Confirmation") &&
            i.InterviewDate &&
            new Date(i.InterviewDate) < new Date()
        ) && c.status === "Active"
    ).length;

  const getOfferConversionRate = () => {
    const totalInterviews = filteredChains.reduce(
      (sum, c) => sum + c.interviews.length,
      0
    );
    const offers = filteredChains.reduce(
      (sum, c) =>
        sum + c.interviews.filter((i) => i.InterviewOutcome === "Offer").length,
      0
    );
    return totalInterviews
      ? ((offers / totalInterviews) * 100).toFixed(1)
      : "0.0";
  };

  const getAverageTimeToOffer = () => {
    const offerChains = filteredChains.filter((c) =>
      c.interviews.some((i) => i.InterviewOutcome === "Offer")
    );
    const times = offerChains.map((c) => {
      const firstInterview = c.interviews[0];
      const offerInterview = c.interviews.find(
        (i) => i.InterviewOutcome === "Offer"
      );
      if (!firstInterview?.InterviewDate || !offerInterview?.InterviewDate)
        return 0;
      return (
        (new Date(offerInterview.InterviewDate).getTime() -
          new Date(firstInterview.InterviewDate).getTime()) /
        (1000 * 60 * 60 * 24)
      );
    });
    return times.length
      ? (times.reduce((sum, t) => sum + t, 0) / times.length).toFixed(1)
      : "N/A";
  };

  const getDropOffRate = () => {
    const firstInterviewUnsuccessful = filteredChains.filter(
      (c) => c.interviews.length === 1 && c.status === "Unsuccessful"
    ).length;
    return filteredChains.length
      ? ((firstInterviewUnsuccessful / filteredChains.length) * 100).toFixed(1)
      : "0.0";
  };

  const isOverdue = (chain: InterviewChain) =>
    chain.status === "Active" &&
    chain.interviews.some(
      (i) =>
        (i.InterviewStatus === "Scheduled" ||
          i.InterviewStatus === "Pending Confirmation") &&
        i.InterviewDate &&
        new Date(i.InterviewDate) < new Date()
    );

  if (loading || isRefreshing) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        <CircularProgress size={40} sx={{ color: "#682A53" }} />
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{fetchError}</Typography>
        <IconButton onClick={handleRefresh} color="primary">
          <Refresh />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 3 },
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
        ml: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <IconButton sx={{ p: "8px", mr: 2 }} onClick={handleRefresh}>
          <Refresh sx={{ color: "#682A53" }} />
        </IconButton>
        <Typography variant="body1" sx={{ mr: 2, fontWeight: 600 }}>
          Filters:
        </Typography>
        <Box
          sx={{
            overflowX: "auto",
            whiteSpace: "nowrap",
            flexGrow: 1,
            "&::-webkit-scrollbar": { height: "8px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.grey[400],
              borderRadius: "4px",
            },
          }}
        >
          <Tabs
            value={timeFilter}
            onChange={(_, newValue) => setTimeFilter(newValue)}
            aria-label="time filter tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ display: "inline-flex", minWidth: "max-content" }}
          >
            <Tab label="All" value="All" />
            <Tab label="Daily" value="Daily" />
            <Tab label="This Week" value="This Week" />
            <Tab label="Last Week" value="Last Week" />
            <Tab label="Next Week" value="Next Week" />
            <Tab label="Last Month" value="Last Month" />
            <Tab label="Last Quarter" value="Last Quarter" />
            <Tab label="This Quarter" value="This Quarter" />
            <Tab label="Year" value="Year" />
            <Tab label="Last Year" value="Last Year" />
          </Tabs>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search by end client, client, recruiter, position, status, type, etc..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          variant="outlined"
          size="medium"
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "& fieldset": { borderColor: "rgba(0, 0, 0, 0.12)" },
              "&:hover fieldset": { borderColor: "#682A53" },
              "&.Mui-focused fieldset": { borderColor: "#682A53" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#682A53" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              height: 120,
              width: "100%",
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              bgcolor: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
            onClick={() => handleCardClick("total")}
          >
            <CardContent sx={{ p: 2 }}>
              <Work sx={{ fontSize: 24, color: "#682A53" }} />
              <Typography variant="body2" color="textSecondary">
                Total Chains
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: "#682A53" }}
              >
                {filteredChains.length}
              </Typography>
              <Typography variant="caption">
                {calculateAverageDuration()} min avg
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              height: 120,
              width: "100%",
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              bgcolor: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
            onClick={() => handleCardClick("active")}
          >
            <CardContent sx={{ p: 2 }}>
              <TrendingUp
                sx={{ fontSize: 24, color: theme.palette.info.main }}
              />
              <Typography variant="body2" color="textSecondary">
                Active Chains
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: theme.palette.info.main }}
              >
                {filteredChains.filter((c) => c.status === "Active").length}
              </Typography>
              <Typography variant="caption">
                {getOfferConversionRate()}% offer rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              height: 120,
              width: "100%",
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              bgcolor: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
            onClick={() => handleCardClick("successful")}
          >
            <CardContent sx={{ p: 2 }}>
              <Check sx={{ fontSize: 24, color: theme.palette.success.main }} />
              <Typography variant="body2" color="textSecondary">
                Successful
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: theme.palette.success.main }}
              >
                {filteredChains.filter((c) => c.status === "Successful").length}
              </Typography>
              <Typography variant="caption">
                {getAverageTimeToOffer()} days to offer
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              height: 120,
              width: "100%",
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              bgcolor: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
            onClick={() => handleCardClick("unsuccessful")}
          >
            <CardContent sx={{ p: 2 }}>
              <TrendingDown
                sx={{ fontSize: 24, color: theme.palette.error.main }}
              />
              <Typography variant="body2" color="textSecondary">
                Unsuccessful
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: theme.palette.error.main }}
              >
                {
                  filteredChains.filter((c) => c.status === "Unsuccessful")
                    .length
                }
              </Typography>
              <Typography variant="caption">
                {getDropOffRate()}% drop-off
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              height: 120,
              width: "100%",
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              bgcolor: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
            onClick={() => handleCardClick("pending")}
          >
            <CardContent sx={{ p: 2 }}>
              <HourglassEmpty sx={{ fontSize: 24, color: "#682A53" }} />
              <Typography variant="body2" color="textSecondary">
                Pending Actions
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: "#682A53" }}
              >
                {getPendingActions()}
              </Typography>
              <Typography variant="caption">Overdue</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {activeTable === "total" && (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                bgcolor: "#fff",
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 600, color: "#682A53" }}
              >
                All Interview Chains
              </Typography>
              <List sx={{ maxHeight: 300, overflowY: "auto" }}>
                {filteredChains.map((chain) => (
                  <ListItem
                    key={chain.id}
                    sx={{ py: 0.5 }}
                    secondaryAction={
                      loadingChainId === chain.id ? (
                        <CircularProgress size={20} sx={{ color: "#682A53" }} />
                      ) : (
                        <IconButton onClick={() => handleViewChainClick(chain)}>
                          <Visibility />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemText
                      primary={`${chain.clientName || "Unknown"} - ${
                        chain.position || "Unknown"
                      }`}
                      secondary={`Status: ${chain.status} • Interviews: ${
                        chain.interviews.length
                      } • Last Updated: ${formatDate(chain.updatedAt)}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        )}
        {activeTable === "active" && (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                bgcolor: "#fff",
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 600, color: "#682A53" }}
              >
                Active Interview Chains
              </Typography>
              <List sx={{ maxHeight: 300, overflowY: "auto" }}>
                {filteredChains
                  .filter((c) => c.status === "Active")
                  .map((chain) => (
                    <ListItem
                      key={chain.id}
                      sx={{ py: 0.5 }}
                      secondaryAction={
                        loadingChainId === chain.id ? (
                          <CircularProgress
                            size={20}
                            sx={{ color: "#682A53" }}
                          />
                        ) : (
                          <IconButton
                            onClick={() => handleViewChainClick(chain)}
                          >
                            <Visibility />
                          </IconButton>
                        )
                      }
                    >
                      <ListItemText
                        primary={`${chain.clientName || "Unknown"} - ${
                          chain.position || "Unknown"
                        }`}
                        secondary={`Interviews: ${
                          chain.interviews.length
                        } • Last Updated: ${formatDate(chain.updatedAt)}`}
                      />
                    </ListItem>
                  ))}
              </List>
            </Paper>
          </Grid>
        )}
        {activeTable === "successful" && (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                bgcolor: "#fff",
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 600, color: "#682A53" }}
              >
                Successful Interview Chains
              </Typography>
              <List sx={{ maxHeight: 300, overflowY: "auto" }}>
                {filteredChains
                  .filter((c) => c.status === "Successful")
                  .map((chain) => (
                    <ListItem
                      key={chain.id}
                      sx={{ py: 0.5 }}
                      secondaryAction={
                        loadingChainId === chain.id ? (
                          <CircularProgress
                            size={20}
                            sx={{ color: "#682A53" }}
                          />
                        ) : (
                          <IconButton
                            onClick={() => handleViewChainClick(chain)}
                          >
                            <Visibility />
                          </IconButton>
                        )
                      }
                    >
                      <ListItemText
                        primary={`${chain.clientName || "Unknown"} - ${
                          chain.position || "Unknown"
                        }`}
                        secondary={`Interviews: ${
                          chain.interviews.length
                        } • Last Updated: ${formatDate(chain.updatedAt)}`}
                      />
                    </ListItem>
                  ))}
              </List>
            </Paper>
          </Grid>
        )}
        {activeTable === "unsuccessful" && (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                bgcolor: "#fff",
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 600, color: "#682A53" }}
              >
                Unsuccessful Interview Chains
              </Typography>
              <List sx={{ maxHeight: 300, overflowY: "auto" }}>
                {filteredChains
                  .filter((c) => c.status === "Unsuccessful")
                  .map((chain) => (
                    <ListItem
                      key={chain.id}
                      sx={{ py: 0.5 }}
                      secondaryAction={
                        loadingChainId === chain.id ? (
                          <CircularProgress
                            size={20}
                            sx={{ color: "#682A53" }}
                          />
                        ) : (
                          <IconButton
                            onClick={() => handleViewChainClick(chain)}
                          >
                            <Visibility />
                          </IconButton>
                        )
                      }
                    >
                      <ListItemText
                        primary={`${chain.clientName || "Unknown"} - ${
                          chain.position || "Unknown"
                        }`}
                        secondary={`Interviews: ${
                          chain.interviews.length
                        } • Last Updated: ${formatDate(chain.updatedAt)}`}
                      />
                    </ListItem>
                  ))}
              </List>
            </Paper>
          </Grid>
        )}
        {activeTable === "pending" && (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                bgcolor: "#fff",
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 600, color: "#682A53" }}
              >
                Pending Action Interview Chains
              </Typography>
              <List sx={{ maxHeight: 300, overflowY: "auto" }}>
                {filteredChains
                  .filter((c) => isOverdue(c))
                  .map((chain) => (
                    <ListItem
                      key={chain.id}
                      sx={{ py: 0.5 }}
                      secondaryAction={
                        loadingChainId === chain.id ? (
                          <CircularProgress
                            size={20}
                            sx={{ color: "#682A53" }}
                          />
                        ) : (
                          <IconButton
                            onClick={() => handleViewChainClick(chain)}
                          >
                            <Visibility />
                          </IconButton>
                        )
                      }
                    >
                      <ListItemText
                        primary={`${chain.clientName || "Unknown"} - ${
                          chain.position || "Unknown"
                        }`}
                        secondary={`Interviews: ${
                          chain.interviews.length
                        } • Last Updated: ${formatDate(chain.updatedAt)}`}
                      />
                    </ListItem>
                  ))}
              </List>
            </Paper>
          </Grid>
        )}
      </Grid>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              height: 300,
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              bgcolor: "#fff",
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "#682A53" }}
            >
              Recent Interviews
            </Typography>
            <List sx={{ maxHeight: 250, overflowY: "auto" }}>
              {effectiveRecentChains.map((chain, index) => {
                const latestInterview =
                  chain.interviews[chain.interviews.length - 1];
                return (
                  <Box key={chain.id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      sx={{ py: 0.5 }}
                      secondaryAction={
                        loadingChainId === chain.id ? (
                          <CircularProgress
                            size={20}
                            sx={{ color: "#682A53" }}
                          />
                        ) : (
                          <IconButton
                            onClick={() => handleViewChainClick(chain)}
                            size="small"
                          >
                            <Visibility />
                          </IconButton>
                        )
                      }
                    >
                      <Avatar
                        sx={{
                          mr: 1,
                          bgcolor: getStatusColor(chain.status),
                          width: 24,
                          height: 24,
                          ...(isOverdue(chain) && { border: "2px solid red" }),
                        }}
                      >
                        {isOverdue(chain) ? (
                          <Warning sx={{ fontSize: 16 }} color="error" />
                        ) : (
                          <Typography variant="caption">
                            {chain.clientName?.charAt(0) || "C"}
                          </Typography>
                        )}
                      </Avatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="body2">
                              {chain.clientName || "Unknown"}
                            </Typography>
                            <Chip
                              size="small"
                              label={chain.status || "Unknown"}
                              sx={{
                                ml: 1,
                                bgcolor: getStatusColor(chain.status),
                                color: "#fff",
                                height: 20,
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption">
                            {chain.endClientName || "Unknown"} •{" "}
                            {chain.position || "Unknown"} • {chain.rounds}{" "}
                            interviews •{" "}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </Box>
                );
              })}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              height: 300,
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              bgcolor: "#fff",
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "#682A53" }}
            >
              Client Performance
            </Typography>
            <List sx={{ maxHeight: 250, overflowY: "auto" }}>
              {clientPerformance.map((client, index) => (
                <Box key={client.name}>
                  {index > 0 && <Divider />}
                  <ListItem sx={{ py: 0.5 }}>
                    <Avatar
                      sx={{
                        mr: 1,
                        bgcolor: theme.palette.primary.main,
                        width: 24,
                        height: 24,
                      }}
                    >
                      <Typography variant="caption">
                        {client.name.charAt(0)}
                      </Typography>
                    </Avatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2">{client.name}</Typography>
                      }
                      secondary={
                        <Typography variant="caption">
                          {client.count} chains •{" "}
                          {((client.offers / client.count) * 100).toFixed(1)}%
                          offers
                        </Typography>
                      }
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
            {clientPerformance.length === 0 && (
              <Typography variant="body2" color="textSecondary" sx={{ p: 1 }}>
                No clients found for the selected time period.
              </Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              height: 300,
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              bgcolor: "#fff",
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "#682A53" }}
            >
              Recruiter Performance
            </Typography>
            <List sx={{ maxHeight: 250, overflowY: "auto" }}>
              {recruiterPerformance.map((recruiter, index) => (
                <Box key={recruiter.name}>
                  {index > 0 && <Divider />}
                  <ListItem
                    sx={{ py: 0.5 }}
                    secondaryAction={
                      loadingChainId === recruiter.chains[0]?.id ? (
                        <CircularProgress size={20} sx={{ color: "#682A53" }} />
                      ) : (
                        <IconButton
                          onClick={() => {
                            setSelectedRecruiter(recruiter.name);
                            setModalContent("recruiter");
                            setOpenDialog(true);
                          }}
                          size="small"
                        >
                          <Visibility />
                        </IconButton>
                      )
                    }
                  >
                    <Avatar
                      sx={{
                        mr: 1,
                        bgcolor: theme.palette.secondary.main,
                        width: 24,
                        height: 24,
                      }}
                    >
                      <Typography variant="caption">
                        {recruiter.name.charAt(0)}
                      </Typography>
                    </Avatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          {recruiter.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption">
                          {recruiter.total} interviews •{" "}
                          {((recruiter.offers / recruiter.total) * 100).toFixed(
                            1
                          )}
                          % offers
                        </Typography>
                      }
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
            {recruiterPerformance.length === 0 && (
              <Typography variant="body2" color="textSecondary" sx={{ p: 1 }}>
                No recruiters found for the selected time period.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <InterviewChainDetailsModal
        chain={selectedChainDetails}
        open={openDialog && modalContent === "chain"}
        onClose={() => {
          setOpenDialog(false);
          setSelectedChainDetails(null);
          setModalContent(null);
        }}
        isLoading={isLoadingDetails}
      />

      {selectedChainDetails && selectedInterview && (
        <EditInterviewDialog
          chain={selectedChainDetails}
          open={openEditDialog}
          onClose={() => {
            setOpenEditDialog(false);
            setSelectedInterview(undefined);
          }}
          onSubmit={(chainId, outcome, newInterview) => {
            editInterview(chainId, selectedInterview, newInterview || {});
            setOpenEditDialog(false);
            setSelectedInterview(undefined);
          }}
          interviewToEdit={selectedInterview}
        />
      )}

      {selectedChainDetails && selectedInterview && (
        <EndInterviewDialog
          chain={selectedChainDetails}
          open={openEndDialog}
          onClose={() => {
            setOpenEndDialog(false);
            setSelectedInterview(undefined);
          }}
          onSubmit={(chainId, outcome, newInterview) => {
            if (
              outcome === "Next" ||
              outcome === "Rejected" ||
              outcome === "Offer"
            ) {
              endInterview(chainId, outcome, newInterview || {});
            }
            setOpenEndDialog(false);
            setSelectedInterview(undefined);
          }}
          onOpenAddInterview={() => {
            setOpenEndDialog(false);
            addInterview(selectedChainDetails.id, {});
          }}
          selectedInterview={selectedInterview}
        />
      )}

      {modalContent === "recruiter" && selectedRecruiter && (
        <Dialog
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
            setSelectedRecruiter(null);
            setModalContent(null);
          }}
          maxWidth="sm"
          fullWidth
        >
          <Paper
            sx={{
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
              p: 3,
              borderRadius: 2,
              bgcolor: "#fff",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#682A53", fontWeight: 600 }}
            >
              {selectedRecruiter} Performance
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
              <Typography variant="body1">
                <strong>Total Chains:</strong>{" "}
                {recruiterPerformance.find((r) => r.name === selectedRecruiter)
                  ?.active || 0}
              </Typography>
              <Typography variant="body1">
                <strong>Total Interviews:</strong>{" "}
                {recruiterPerformance.find((r) => r.name === selectedRecruiter)
                  ?.total || 0}
              </Typography>
              <Typography variant="body1">
                <strong>Offers:</strong>{" "}
                {recruiterPerformance.find((r) => r.name === selectedRecruiter)
                  ?.offers || 0}
              </Typography>
            </Box>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ mt: 2, fontWeight: 600, color: "#682A53" }}
            >
              Interview Details
            </Typography>
            <Box sx={{ maxHeight: "50vh", overflowY: "auto" }}>
              {recruiterPerformance
                .find((r) => r.name === selectedRecruiter)
                ?.chains.flatMap((chain) =>
                  chain.interviews.map((interview, index) => (
                    <Card
                      key={`${chain.id}-${index}`}
                      sx={{
                        mb: 1,
                        p: 1.5,
                        borderRadius: 2,
                        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                        bgcolor: "#f9f9f9",
                      }}
                    >
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 600 }}
                          >
                            Client:
                          </Typography>
                          <Typography variant="caption" sx={{ ml: 1 }}>
                            {chain.clientName || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 600 }}
                          >
                            End Client:
                          </Typography>
                          <Typography variant="caption" sx={{ ml: 1 }}>
                            {chain.endClientName || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 600 }}
                          >
                            Recruiter:
                          </Typography>
                          <Typography variant="caption" sx={{ ml: 1 }}>
                            {chain.recruiterName || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 600 }}
                          >
                            Date:
                          </Typography>
                          <Typography variant="caption" sx={{ ml: 1 }}>
                            {formatDate(interview.InterviewDate)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 600 }}
                          >
                            Start:
                          </Typography>
                          <Typography variant="caption" sx={{ ml: 1 }}>
                            {formatTime(interview.InterviewStartTime)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 600 }}
                          >
                            End:
                          </Typography>
                          <Typography variant="caption" sx={{ ml: 1 }}>
                            {formatTime(interview.InterviewEndTime)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 600 }}
                          >
                            Status:
                          </Typography>
                          <Chip
                            label={interview.InterviewStatus || "N/A"}
                            size="small"
                            sx={{
                              ml: 1,
                              bgcolor: getStatusColor(
                                interview.InterviewStatus
                              ),
                              color: "#fff",
                              height: 20,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Card>
                  ))
                ) || (
                <Typography variant="body2" color="textSecondary">
                  No interviews found for this recruiter.
                </Typography>
              )}
            </Box>
            <Button
              onClick={() => {
                setOpenDialog(false);
                setSelectedRecruiter(null);
                setModalContent(null);
              }}
              sx={{ mt: 2 }}
              variant="contained"
              color="primary"
            >
              Close
            </Button>
          </Paper>
        </Dialog>
      )}
    </Box>
  );
}
