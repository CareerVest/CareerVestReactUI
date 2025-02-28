"use client";

import { Box, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import CreateEmployeeForm from "../components/CreateEmployeeForm";
import { useAuth } from "@/contexts/authContext";
import permissions from "@/app/utils/permissions"; // Removed AppPermissions import

// export const metadata = {
//   title: "Add New Employee | CareerVest",
// };

export default function NewEmployeePage() {
  const { roles, isInitialized } = useAuth(); // Add auth context to check permissions

  // Determine user role without AppPermissions typing, default to "default" if not initialized
  const role = isInitialized && roles.length > 0 
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

  // Check if user can create employees (only Admin can create new employees, based on permissions)
  const canCreate = isInitialized && permissions.employees[role]?.addEmployee === true;

  if (!isInitialized || !canCreate) {
    return (
      <Box sx={{ p: 3 }}>
        <Button component={Link} href="/employees" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
          Back to Employees
        </Button>
        <Typography variant="h4" gutterBottom sx={{ color: "#682A53" }}>
          Unauthorized Access
        </Typography>
        <Typography>
          You do not have permission to create new employees. Please contact an administrator.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button component={Link} href="/employees" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to Employees
      </Button>
      <Typography variant="h4" component="h1" sx={{ mb: 3, color: "#682A53" }}>
        Add New Employee
      </Typography>
      <CreateEmployeeForm />
    </Box>
  );
}