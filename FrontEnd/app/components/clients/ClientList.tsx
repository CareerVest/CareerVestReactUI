"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Box, Paper, TextField, InputAdornment, IconButton, Chip, CircularProgress } from "@mui/material"
import { DataGrid, type GridColDef, type GridRenderCellParams, type GridValueGetterParams } from "@mui/x-data-grid"
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material"
import { useRouter } from "next/navigation"
import type { Client } from "@/app/types/client"
import { dummyClients } from "@/app/utils/dummyClients"

const dummyRecruiters = {
  1: "Sarah Thompson",
  2: "Michael Brown",
  3: "Emily Davis",
}

const dummySalesPersons = {
  1: "John Sales",
  2: "Alice Seller",
  3: "Bob Marketer",
}

export default function ClientList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  let width = 0 // Declare width variable

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
      setClients(dummyClients)
      setLoading(false)
    }

    fetchClients()
  }, [])

  const handleView = useCallback(
    (id: number) => {
      router.push(`/clients/${id}`)
    },
    [router],
  )

  const handleEdit = useCallback(
    (id: number) => {
      router.push(`/clients/${id}/edit`)
    },
    [router],
  )

  const handleDelete = useCallback((id: number) => {
    if (confirm("Are you sure you want to delete this client?")) {
      setClients((prevClients) => prevClients.filter((client) => client.ClientID !== id))
    }
  }, [])

  const formatDate = useCallback((dateString: string | null | undefined) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }, [])

  const safeValueGetter = useCallback((params: GridValueGetterParams, field: keyof Client) => {
    if (params.row == null) return "N/A"
    const value = params.row[field]
    return value != null ? value : "N/A"
  }, [])

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "ClientName", headerName: "Client Name", flex: 1, minWidth: 150 },
      {
        field: "EnrollmentDate",
        headerName: "Enrolled Date",
        flex: 1,
        minWidth: 120,
        valueGetter: (params: GridValueGetterParams) => formatDate(safeValueGetter(params, "EnrollmentDate") as string),
      },
      { field: "TechStack", headerName: "Tech Stack", flex: 1, minWidth: 150 },
      {
        field: "AssignedRecruiterID",
        headerName: "Recruiter",
        flex: 1,
        minWidth: 150,
        valueGetter: (params: GridValueGetterParams) => {
          const recruiterId = safeValueGetter(params, "AssignedRecruiterID") as number
          return recruiterId != null ? dummyRecruiters[recruiterId as keyof typeof dummyRecruiters] || "Unknown" : "N/A"
        },
      },
      {
        field: "ClientStatus",
        headerName: "Status",
        flex: 1,
        minWidth: 120,
        renderCell: (params: GridRenderCellParams) => (
          <Chip
            label={params.value || "N/A"}
            color={params.value === "Active" ? "success" : params.value === "Placed" ? "primary" : "default"}
          />
        ),
      },
      {
        field: "TotalDue",
        headerName: "Total Due",
        flex: 1,
        minWidth: 120,
        valueFormatter: (params) => `$${params.value.toFixed(2)}`,
      },
      {
        field: "TotalPaid",
        headerName: "Total Paid",
        flex: 1,
        minWidth: 120,
        valueFormatter: (params) => `$${params.value.toFixed(2)}`,
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams) => (
          <Box>
            <IconButton
              onClick={() => params.row?.ClientID && handleView(params.row.ClientID)}
              size="small"
              color="primary"
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton
              onClick={() => params.row?.ClientID && handleEdit(params.row.ClientID)}
              size="small"
              color="primary"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => params.row?.ClientID && handleDelete(params.row.ClientID)}
              size="small"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ),
      },
    ],
    [handleDelete, handleEdit, handleView, formatDate, safeValueGetter], // Added safeValueGetter to dependencies
  )

  const filteredClients = useMemo(
    () =>
      clients.filter((client) =>
        Object.entries(client).some(
          ([key, value]) =>
            value != null && value.toString().toLowerCase().includes(searchTerm.toLowerCase()) && key !== "ClientID", // Exclude ClientID from search
        ),
      ),
    [clients, searchTerm],
  )

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search clients..."
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
        ) : (
          <DataGrid
            rows={filteredClients}
            columns={columns}
            getRowId={(row) => row.ClientID}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableVirtualization={false}
            rowBuffer={10}
            autoHeight
            onCellClick={(params, event) => {
              event.defaultMuiPrevented = true
            }}
            onCellMouseEnter={(params, event) => {
              event.preventDefault()
            }}
            onViewportWidthChange={(widthParam) => {
              width = widthParam // Assign widthParam to width
              const newColumnVisibilityModel = {
                EnrollmentDate: width > 1200,
                TechStack: width > 1000,
                AssignedRecruiterID: width > 800,
                TotalDue: width > 600,
                TotalPaid: width > 600,
              }
              // @ts-ignore
              // The DataGrid API types are not up to date
              // This is a valid way to update column visibility
              if (width) {
                // @ts-ignore
                document.querySelector(".MuiDataGrid-root")?.api?.setColumnVisibilityModel(newColumnVisibilityModel)
              }
            }}
            columnVisibilityModel={{
              EnrollmentDate: width > 1200,
              TechStack: width > 1000,
              AssignedRecruiterID: width > 800,
              TotalDue: width > 600,
              TotalPaid: width > 600,
            }}
          />
        )}
      </Paper>
    </Box>
  )
}

