"use client"

import { useState } from "react"
import { Box, Typography } from "@mui/material"
import OrgChart from "../components/supervisors/OrgChart"
import EmployeeDetails from "../components/supervisors/EmployeeDetails"
import { orgData, getAllRecruiters } from "../utils/orgData"
import type { Employee } from "../types/employee"

export default function SupervisorsPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false)

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsRightPanelOpen(true)
  }

  const handleCloseRightPanel = () => {
    setIsRightPanelOpen(false)
  }

  const handleClientReassign = (clientId: string, newRecruiterId: string) => {
    // In a real application, this would make an API call to update the database
    console.log(`Reassigning client ${clientId} to recruiter ${newRecruiterId}`)
    // You would then refresh the data or update the state accordingly
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", p: 3 }}>
      <Box
        sx={{
          flexGrow: 1,
          transition: "width 0.3s ease",
          width: isRightPanelOpen ? "calc(100% - 400px)" : "100%",
          overflowX: "auto",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: "#682A53" }}>
          Careervest Team Hierarchy
        </Typography>
        <OrgChart data={orgData} onEmployeeClick={handleEmployeeClick} />
      </Box>
      {isRightPanelOpen && selectedEmployee && (
        <Box
          sx={{
            width: 400,
            backgroundColor: "#f5f5f5",
            borderLeft: "1px solid #e0e0e0",
            p: 2,
            overflowY: "auto",
          }}
        >
          <EmployeeDetails
            employee={selectedEmployee}
            onClose={handleCloseRightPanel}
            allRecruiters={getAllRecruiters(orgData)}
            onClientReassign={handleClientReassign}
          />
        </Box>
      )}
    </Box>
  )
}

