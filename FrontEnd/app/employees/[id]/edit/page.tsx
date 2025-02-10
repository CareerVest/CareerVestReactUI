"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Box, Typography, Button, CircularProgress } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import EmployeeForm from "../../../components/employees/EmployeeForm"
import { getEmployee } from "../../../actions/employeeActions"
import type { Employee } from "../../../types/employee"

export default function EmployeeEdit({ params }: { params: { id: string } }) {
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
      <Typography variant="h4" gutterBottom>
        Edit Employee: {employee.FirstName} {employee.LastName}
      </Typography>
      <EmployeeForm employee={employee} />
    </Box>
  )
}

