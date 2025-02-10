"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  CircularProgress,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { getEmployee } from "../../actions/employeeActions"
import type { Employee } from "../../types/employee"

export default function EmployeeView({ params }: { params: { id: string } }) {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employeeData = await getEmployee(Number(params.id))
        setEmployee(employeeData)
      } catch (error) {
        console.error("Failed to fetch employee:", error)
        alert("Failed to load employee data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchEmployee()
  }, [params.id])

  const handleBack = () => {
    router.push("/employees")
  }

  const handleEdit = () => {
    router.push(`/employees/${params.id}/edit`)
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!employee) {
    return <Typography>Employee not found</Typography>
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
        Back to Employees
      </Button>
      <Typography variant="h4" gutterBottom sx={{ color: "#682A53" }}>
        Employee Details: {employee.FirstName} {employee.LastName}
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Employee ID
                    </TableCell>
                    <TableCell>{employee.EmployeeID}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Name
                    </TableCell>
                    <TableCell>{`${employee.FirstName} ${employee.LastName}`}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Personal Email
                    </TableCell>
                    <TableCell>{employee.PersonalEmailAddress}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Company Email
                    </TableCell>
                    <TableCell>{employee.CompanyEmailAddress || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Phone Number
                    </TableCell>
                    <TableCell>{`${employee.PersonalPhoneCountryCode || ""} ${
                      employee.PersonalPhoneNumber || "N/A"
                    }`}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Role
                    </TableCell>
                    <TableCell>{employee.Role || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Status
                    </TableCell>
                    <TableCell>{employee.Status || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Joined Date
                    </TableCell>
                    <TableCell>{employee.JoinedDate || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Employee Reference ID
                    </TableCell>
                    <TableCell>{employee.EmployeeReferenceID || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Supervisor ID
                    </TableCell>
                    <TableCell>{employee.SupervisorID || "N/A"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        {employee.CompanyComments && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Company Comments
            </Typography>
            <Typography>{employee.CompanyComments}</Typography>
          </Box>
        )}
      </Paper>
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary" onClick={handleEdit}>
          Edit Employee
        </Button>
      </Box>
    </Box>
  )
}

