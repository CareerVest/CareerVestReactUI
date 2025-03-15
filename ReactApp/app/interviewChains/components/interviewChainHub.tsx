"use client";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Fab,
  TablePagination,
  Tooltip,
  Typography,
  useTheme,
  Zoom,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type {
  Interview,
  InterviewChain,
} from "@/app/types/interviewChain/interviewChain";
import InterviewChainSearch from "./interviewChainSearch";
import ChainExploration from "./chainExploration";
import { CalendarToday, Person } from "@mui/icons-material";
import { useState, useEffect } from "react";

interface InterviewChainHubProps {
  chains: InterviewChain[];
  onEndInterview: (
    chain: InterviewChain,
    isEditing: boolean,
    interview?: Interview
  ) => void;
  onAddNewInterview: (chain: InterviewChain) => void;
  onViewChain: (chain: InterviewChain) => void;
  onCreateNewChain: () => void;
}

export default function InterviewChainHub({
  chains,
  onEndInterview,
  onAddNewInterview,
  onViewChain,
  onCreateNewChain,
}: InterviewChainHubProps) {
  const theme = useTheme();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedChain, setSelectedChain] = useState<InterviewChain | null>(
    null
  );

  // Reset page to 0 whenever searchText or statusFilter changes
  useEffect(() => {
    setPage(0);
  }, [searchText, statusFilter]);

  const filteredChains = chains.filter((chain) => {
    const searchTerms = searchText
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    const matchesStatus =
      statusFilter === "All" || chain.status === statusFilter;

    if (!searchTerms.length) return matchesStatus;

    const searchableFields = [
      chain.endClientName?.toLowerCase() || "",
      chain.clientName?.toLowerCase() || "",
      chain.recruiterName?.toLowerCase() || "",
      chain.position?.toLowerCase() || "",
      chain.latestInterviewStatus?.toLowerCase() || "",
      chain.latestInterviewType?.toLowerCase() || "",
      ...chain.interviews
        .map((interview) => [
          interview.EndClientName?.toLowerCase() || "",
          interview.Position?.toLowerCase() || "",
          interview.InterviewType?.toLowerCase() || "",
          interview.InterviewSupport?.toLowerCase() || "",
          interview.InterviewFeedback?.toLowerCase() || "",
          interview.Comments?.toLowerCase() || "",
          interview.CreatedBy?.toLowerCase() || "",
          interview.UpdatedBy?.toLowerCase() || "",
        ])
        .flat(),
    ].join(" ");

    const matchesSearch = searchTerms.every((term) =>
      searchableFields.includes(term)
    );
    return matchesSearch && matchesStatus;
  });

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

  const handleCloseChainView = () => {
    setSelectedChain(null);
  };

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

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString();
  };

  return (
    <Box sx={{ overflowX: "hidden", width: "100%", boxSizing: "border-box" }}>
      <InterviewChainSearch
        searchText={searchText}
        setSearchText={setSearchText}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        totalChains={filteredChains.length}
      />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          width: "100%",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        {paginatedChains.map((chain) => {
          const isSelected = selectedChain?.id === chain.id;

          return (
            <Card
              key={chain.id}
              onClick={() => onViewChain(chain)}
              sx={{
                flex: "1 1 calc(20% - 16px)",
                minWidth: "200px",
                maxWidth: "calc(25% - 16px)",
                mb: 2,
                borderRadius: 2,
                border: "1px solid rgba(104, 42, 83, 0.1)",
                overflow: "visible",
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(104, 42, 83, 0.05)" },
                transition: "all 0.3s ease",
                ...(isSelected && {
                  border: "2px solid #682A53",
                  bgcolor: "rgba(104, 42, 83, 0.05)",
                }),
                boxSizing: "border-box",
              }}
            >
              <CardContent sx={{ p: 2 }}>
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
                    sx={{
                      color: "#682A53",
                      fontWeight: 500,
                      flexGrow: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {chain.endClientName || "Unnamed Client"}
                  </Typography>
                  <Chip
                    label={chain.status}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(chain.status),
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "0.75rem",
                      height: 20,
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Client: {chain.clientName || "N/A"}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Recruiter: {chain.recruiterName || "N/A"}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Position: {chain.position || "N/A"}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CalendarToday
                    fontSize="small"
                    sx={{ mr: 0.5, color: "text.secondary" }}
                  />
                  <Typography variant="body2">
                    Last updated: {formatDate(chain.updatedAt)}
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
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2">
                    Latest: {chain.latestInterviewType || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {chain.latestInterviewStatus || "N/A"} •{" "}
                    {chain.latestInterviewDate
                      ? formatDate(chain.latestInterviewDate)
                      : "N/A"}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <TablePagination
          component="div"
          count={filteredChains.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50]}
          sx={{
            "& .MuiTablePagination-toolbar": {
              alignItems: "center",
              paddingRight: "80px",
            },
          }}
        />
      </Box>
      {selectedChain && (
        <ChainExploration
          chain={selectedChain}
          open={!!selectedChain}
          onClose={handleCloseChainView}
          onEndInterview={onEndInterview}
          onAddNewInterview={onAddNewInterview}
          onUpdateChainStatus={(chainId, newStatus) => {
            // Implement this if needed
          }}
          onEditInterview={(interview) => {
            onEndInterview(selectedChain, true, interview);
          }}
        />
      )}
      <Tooltip title="Create New Interview Chain" TransitionComponent={Zoom}>
        <Fab
          color="primary"
          onClick={onCreateNewChain}
          sx={{
            position: "fixed",
            bottom: 60,
            right: 20,
            zIndex: 1000,
            width: 56,
            height: 56,
            borderRadius: "50%",
            backgroundColor: theme.palette.primary.main,
            boxShadow: `0 0 10px ${theme.palette.primary.main}, 0 0 20px ${theme.palette.primary.main}`,
            "&:hover": {
              boxShadow: `0 0 15px ${theme.palette.primary.dark}, 0 0 25px ${theme.palette.primary.dark}`,
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </Box>
  );
}
