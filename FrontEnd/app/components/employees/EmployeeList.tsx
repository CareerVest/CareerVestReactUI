"use client"

import { useState, useEffect, useCallback } from "react"
import { Box, Paper, TextField, InputAdornment, IconButton, Chip, CircularProgress } from "@mui/material"
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid"
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material"
import { useRouter } from "next/navigation"
import type { Employee } from "@/app/types/employee"
import { fetchEmployees, deleteEmployee } from "@/app/actions/employeeActions"

export default function EmployeeList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true)
      const employeeData = await fetchEmployees()
      setEmployees(employeeData)
      setLoading(false)
    }

    loadEmployees()
  }, [])

  const handleView = useCallback(
    (id: number) => {
      router.push(`/employees/${id}`)
    },
    [router],
  )

  const handleEdit = useCallback(
    (id: number) => {
      router.push(`/employees/${id}/edit`)
    },
    [router],
  )

  const handleDelete = useCallback(async (id: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      await deleteEmployee(id)
      setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.EmployeeID !== id))
    }
  }, [])

  const columns: GridColDef[] = [
    { field: "EmployeeID", headerName: "ID", width: 70 },
    { field: "FirstName", headerName: "First Name", flex: 1 },
    { field: "LastName", headerName: "Last Name", flex: 1 },
    { field: "PersonalEmailAddress", headerName: "Personal Email", flex: 1 },
    { field: "CompanyEmailAddress", headerName: "Company Email", flex: 1 },
    { field: "Role", headerName: "Role", flex: 1 },
    {
      field: "Status",
      headerName: "Status",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value || "N/A"}
          color={params.value === "Active" ? "success" : params.value === "Terminated" ? "error" : "default"}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton onClick={() => handleView(params.row.EmployeeID)} size="small" color="primary">
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => handleEdit(params.row.EmployeeID)} size="small" color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.EmployeeID)} size="small" color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ]

  const filteredEmployees = employees.filter((employee) =>
    Object.values(employee).some((value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search employees..."
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
            rows={filteredEmployees}
            columns={columns}
            getRowId={(row) => row.EmployeeID}
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

