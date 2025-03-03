"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import permissions from "../../utils/permissions";
import type { InterviewList } from "@/app/types/interviews/interviewList";
import { deleteInterview, fetchInterviews } from "../actions/interviewActions";

export default function InterviewList({ interviews: initialInterviews }: { interviews: InterviewList[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [interviews, setInterviews] = useState<InterviewList[]>(initialInterviews || []);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const router = useRouter();
  const { roles } = useAuth();

  // Determine user role with Azure AD casing
  const userRole = roles.length > 0
    ? (roles.includes("Admin")
        ? "Admin"
        : roles.includes("Sales_Executive")
          ? "Sales_Executive"
          : roles.includes("Senior_Recruiter")
            ? "Senior_Recruiter"
            : roles.includes("recruiter")
              ? "recruiter"
              : roles.includes("Resume_Writer")
                ? "Resume_Writer"
                : "default")
    : "default";

  useEffect(() => {
    if (!permissions.interviews[userRole]?.viewInterview) return;

    const loadInterviews = async () => {
      setLoading(true);
      try {
        const interviewData = await fetchInterviews();
        // Filter and ensure each interview has required properties
        setInterviews(
          interviewData
            .filter((i): i is InterviewList => 
              i != null && 
              i.InterviewID != null && 
              i.InterviewID > 0 && 
              i.InterviewEntryDate != undefined
            )
        );
      } catch (error) {
        console.error("Failed to fetch interviews:", error);
        // Optionally show an error Alert here
      } finally {
        setLoading(false);
      }
    };

    loadInterviews();
  }, [userRole]);

  const handleView = useCallback(
    (id: number) => {
      if (permissions.interviews[userRole].viewInterview) {
        router.push(`/interviews/${id}`);
      }
    },
    [router, userRole],
  );

  const handleEdit = useCallback(
    (id: number) => {
      if (permissions.interviews[userRole].editInterview) {
        router.push(`/interviews/${id}/edit`);
      }
    },
    [router, userRole],
  );

  const handleDeleteClick = useCallback(
    (id: number) => {
      if (permissions.interviews[userRole].deleteInterview) {
        setInterviewToDelete(id);
        setDeleteDialogOpen(true);
      }
    },
    [userRole],
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (interviewToDelete === null) return;

    try {
      setLoading(true);
      setDeleteError(null);
      await deleteInterview(interviewToDelete);
      setInterviews((prevInterviews) => prevInterviews.filter((i) => i.InterviewID !== interviewToDelete));
      setDeleteDialogOpen(false);
      setInterviewToDelete(null);
    } catch (error) {
      console.error("Error deleting interview:", error);
      setDeleteError("Failed to delete interview. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [interviewToDelete]);

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setInterviewToDelete(null);
    setDeleteError(null);
  };

  const formatDate = (date: string | null) => {
    if (!date) return "N/A";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "N/A";
    const month = parsedDate.getMonth() + 1;
    const day = parsedDate.getDate();
    const year = parsedDate.getFullYear();
    return `${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}/${year}`;
  };

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "InterviewID", headerName: "ID", width: 70 },
      {
        field: "InterviewEntryDate",
        headerName: "Entry Date",
        flex: 1,
        valueGetter: (params: GridRenderCellParams<any, InterviewList>) => {
          // Safely handle undefined or null params.row
          return formatDate(params.row?.InterviewEntryDate ?? null);
        },
      },
      {
        field: "RecruiterName",
        headerName: "Recruiter",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "InterviewDate",
        headerName: "Interview Date",
        flex: 1,
        valueGetter: (params: GridRenderCellParams<any, InterviewList>) => {
          // Safely handle undefined or null params.row
          return formatDate(params.row?.InterviewDate ?? null);
        },
      },
      {
        field: "InterviewType",
        headerName: "Type",
        flex: 1,
      },
      {
        field: "InterviewStatus",
        headerName: "Status",
        flex: 1,
        renderCell: (params: GridRenderCellParams<InterviewList>) => (
          <Chip
            label={params.value || "N/A"}
            color={
              params.value === "Completed"
                ? "success"
                : params.value === "Scheduled"
                  ? "primary"
                  : "default"
            }
          />
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params: GridRenderCellParams<InterviewList>) => (
          <Box>
            {permissions.interviews[userRole].viewInterview && (
              <IconButton
                onClick={() => handleView(params.row.InterviewID)}
                size="small"
                color="primary"
              >
                <VisibilityIcon />
              </IconButton>
            )}
            {permissions.interviews[userRole].editInterview && (
              <IconButton
                onClick={() => handleEdit(params.row.InterviewID)}
                size="small"
                color="primary"
              >
                <EditIcon />
              </IconButton>
            )}
            {permissions.interviews[userRole].deleteInterview && (
              <IconButton
                onClick={() => handleDeleteClick(params.row.InterviewID)}
                size="small"
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ),
      },
    ],
    [handleView, handleEdit, handleDeleteClick, userRole, formatDate],
  );

  const filteredInterviews = useMemo(() => {
    return interviews.filter((interview) => {
      if (!searchTerm.trim()) return true;
      const keywords = searchTerm.toLowerCase().split(/\s+/);
      return keywords.every((keyword) => {
        return Object.values(interview).some(
          (value) =>
            value !== null &&
            value !== undefined &&
            typeof value === "string" &&
            value.toLowerCase().includes(keyword),
        );
      });
    });
  }, [interviews, searchTerm]);

  if (!permissions.interviews[userRole]?.viewInterview) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You do not have permission to view interviews. Please contact an administrator.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search interviews..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Paper elevation={3}>
        {deleteError && (
          <Alert severity="error" onClose={() => setDeleteError(null)} sx={{ mb: 2 }}>
            {deleteError}
          </Alert>
        )}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={400}>
            <CircularProgress />
          </Box>
        ) : interviews.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={400}>
            <Typography variant="h6">No interviews found</Typography>
          </Box>
        ) : (
          <DataGrid
            rows={filteredInterviews}
            columns={columns}
            getRowId={(row: InterviewList) => row.InterviewID}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            autoHeight
            disableRowSelectionOnClick
          />
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this interview? This action cannot be undone.
          </DialogContentText>
          {deleteError && (
            <DialogContentText color="error" sx={{ mt: 1 }}>
              {deleteError}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}