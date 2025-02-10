"use client"

import { useState, useEffect, useCallback } from "react"
import { Box, Paper, TextField, InputAdornment, IconButton, Chip, CircularProgress, Typography } from "@mui/material"
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid"
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material"
import { useRouter } from "next/navigation"
import type { Interview } from "@/app/types/interview"
import { fetchInterviews, deleteInterview } from "@/app/actions/interviewActions"

export default function InterviewList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadInterviews = async () => {
      setLoading(true)
      const interviewData = await fetchInterviews()
      setInterviews(interviewData)
      setLoading(false)
    }

    loadInterviews()
  }, [])

  const handleView = useCallback(
    (id: number) => {
      router.push(`/interviews/${id}`)
    },
    [router],
  )

  const handleEdit = useCallback(
    (id: number) => {
      router.push(`/interviews/${id}/edit`)
    },
    [router],
  )

  const handleDelete = useCallback(async (id: number) => {
    if (confirm("Are you sure you want to delete this interview?")) {
      await deleteInterview(id)
      setInterviews((prevInterviews) => prevInterviews.filter((interview) => interview.InterviewID !== id))
    }
  }, [])

  const columns: GridColDef[] = [
    { field: "InterviewID", headerName: "ID", width: 70 },
    { field: "InterviewDate", headerName: "Date", flex: 1 },
    { field: "Technology", headerName: "Technology", flex: 1 },
    { field: "InterviewType", headerName: "Type", flex: 1 },
    { field: "InterviewMethod", headerName: "Method", flex: 1 },
    {
      field: "InterviewStatus",
      headerName: "Status",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value || "N/A"}
          color={params.value === "Completed" ? "success" : params.value === "Scheduled" ? "primary" : "default"}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton onClick={() => handleView(params.row.InterviewID)} size="small" color="primary">
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => handleEdit(params.row.InterviewID)} size="small" color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.InterviewID)} size="small" color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ]

  const filteredInterviews = interviews.filter((interview) =>
    Object.values(interview).some(
      (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  )

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
            getRowId={(row) => row.InterviewID}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
          />
        )}
      </Paper>
    </Box>
  )
}

