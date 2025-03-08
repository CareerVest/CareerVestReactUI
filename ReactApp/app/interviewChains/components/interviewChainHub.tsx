"use client";

import type React from "react";
import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Search,
  GridView,
  ViewList,
  ArrowForward,
  Check,
  CalendarToday,
  Person,
} from "@mui/icons-material";
import type {
  Interview,
  InterviewChain,
} from "@/app/types/interviewChain/interviewChain";
import ChainExploration from "./chainExploration";
import EndInterviewDialog from "./endInterviewDialog";

interface InterviewChainHubProps {
  chains: InterviewChain[];
  onEndInterview: (
    chainId: string,
    outcome: "Next" | "Rejected" | "Offer" | "AddNew",
    newInterview?: Partial<Interview> & {
      clientName?: string;
      position?: string;
    }
  ) => void;
  onAddNewInterview: (
    chain: InterviewChain,
    newInterview: Partial<Interview>
  ) => void;
}

export default function InterviewChainHub({
  chains,
  onEndInterview,
  onAddNewInterview,
}: InterviewChainHubProps) {
  const theme = useTheme();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedChain, setSelectedChain] = useState<InterviewChain | null>(
    null
  );
  const [endInterviewChain, setEndInterviewChain] =
    useState<InterviewChain | null>(null);

  // Robust search logic
  const filteredChains = chains.filter((chain) => {
    // If no search text, include all chains (subject to status filter)
    if (!searchText.trim()) {
      return statusFilter === "All" || chain.status === statusFilter;
    }

    // Split search text into individual terms (e.g., "John Tech" -> ["John", "Tech"])
    const searchTerms = searchText.toLowerCase().trim().split(/\s+/);

    // Collect all searchable fields into a single string for matching
    const searchableFields = [
      chain.clientName?.toLowerCase() || "",
      chain.position?.toLowerCase() || "",
      // Include interview details
      ...chain.interviews
        .map((interview) => [
          interview.type?.toLowerCase() || "",
          interview.interviewer?.toLowerCase() || "",
          interview.location?.toLowerCase() || "",
          interview.notes?.toLowerCase() || "",
        ])
        .flat(),
    ].join(" ");

    // Check if ALL search terms match at least one field
    const matchesSearch = searchTerms.every((term) =>
      searchableFields.includes(term)
    );

    // Apply status filter
    const matchesStatus =
      statusFilter === "All" || chain.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedChains = filteredChains.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle chain selection
  const handleViewChain = (chain: InterviewChain) => {
    setSelectedChain(chain);
  };

  const handleCloseChainView = () => {
    setSelectedChain(null);
  };

  // Handle end interview
  const handleOpenEndInterview = (chain: InterviewChain) => {
    setEndInterviewChain(chain);
  };

  const handleCloseEndInterview = () => {
    setEndInterviewChain(null);
  };

  const handleEndInterviewSubmit = (
    outcome: "Next" | "Rejected" | "Offer" | "AddNew",
    newInterview?: Partial<Interview> & {
      clientName?: string;
      position?: string;
    }
  ) => {
    if (endInterviewChain) {
      onEndInterview(endInterviewChain.id, outcome, newInterview);
      setEndInterviewChain(null);
    }
  };

  // Get status color
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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Box>
      {/* Filter Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <TextField
            placeholder="Search by client, position, interview type, etc..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Successful">Successful</MenuItem>
              <MenuItem value="Unsuccessful">Unsuccessful</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title="Toggle view">
            <Box>
              <IconButton
                color={viewMode === "grid" ? "primary" : "default"}
                onClick={() => setViewMode("grid")}
              >
                <GridView />
              </IconButton>
              <IconButton
                color={viewMode === "list" ? "primary" : "default"}
                onClick={() => setViewMode("list")}
              >
                <ViewList />
              </IconButton>
            </Box>
          </Tooltip>
        </Box>
      </Paper>

      {/* Results Count */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredChains.length} interview chains
          {statusFilter !== "All" && ` with status "${statusFilter}"`}
          {searchText && ` matching "${searchText}"`}
        </Typography>
      </Box>

      {/* Grid View */}
      {viewMode === "grid" && (
        <Grid container spacing={3}>
          {paginatedChains.map((chain) => (
            <Grid item xs={12} sm={6} md={4} key={chain.id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" noWrap sx={{ maxWidth: "70%" }}>
                      {chain.clientName}
                    </Typography>
                    <Chip
                      label={chain.status}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(chain.status),
                        color: "#fff",
                      }}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {chain.position}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CalendarToday
                      fontSize="small"
                      sx={{ mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2">
                      Last updated: {formatDate(chain.updatedAt)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Person
                      fontSize="small"
                      sx={{ mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2">
                      {chain.rounds} interview{chain.rounds !== 1 ? "s" : ""}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">
                      Latest: {chain.latestInterview.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {chain.latestInterview.status} •{" "}
                      {formatDate(chain.latestInterview.date)}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions>
                  <Button size="small" onClick={() => handleViewChain(chain)}>
                    View Details
                  </Button>
                  {chain.status === "Active" &&
                    chain.latestInterview.status === "Scheduled" && (
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleOpenEndInterview(chain)}
                      >
                        End Interview
                      </Button>
                    )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Rounds</TableCell>
                <TableCell>Latest Interview</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedChains.map((chain) => (
                <TableRow key={chain.id} hover>
                  <TableCell>{chain.clientName}</TableCell>
                  <TableCell>{chain.position}</TableCell>
                  <TableCell>
                    <Chip
                      label={chain.status}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(chain.status),
                        color: "#fff",
                      }}
                    />
                  </TableCell>
                  <TableCell>{chain.rounds}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {chain.latestInterview.type}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {chain.latestInterview.status} •{" "}
                        {formatDate(chain.latestInterview.date)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{formatDate(chain.updatedAt)}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleViewChain(chain)}
                    >
                      <ArrowForward fontSize="small" />
                    </IconButton>
                    {chain.status === "Active" &&
                      chain.latestInterview.status === "Scheduled" && (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenEndInterview(chain)}
                        >
                          <Check fontSize="small" />
                        </IconButton>
                      )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredChains.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50]}
      />

      {/* Chain Exploration Dialog */}
      {selectedChain && (
        <ChainExploration
          chain={selectedChain}
          open={!!selectedChain}
          onClose={handleCloseChainView}
          onEndInterview={handleOpenEndInterview}
          onAddNewInterview={onAddNewInterview}
        />
      )}

      {/* End Interview Dialog */}
      {endInterviewChain && (
        <EndInterviewDialog
          chain={endInterviewChain}
          open={!!endInterviewChain}
          onClose={handleCloseEndInterview}
          onSubmit={handleEndInterviewSubmit}
        />
      )}
    </Box>
  );
}
