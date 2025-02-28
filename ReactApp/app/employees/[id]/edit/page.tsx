"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, CircularProgress, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmployeeForm from "../../components/EditEmployeeForm";
import { getEmployee } from "../../actions/employeeActions";
import type { EmployeeDetail } from "../../../types/employees/employeeDetail";
import { useAuth } from "@/contexts/authContext";
import permissions from "../../../utils/permissions";

export default function EmployeeEdit({ params }: { params: { id: string } }) {
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { roles, isInitialized } = useAuth(); // Added isInitialized to check auth state

  // Determine user role with Azure AD casing, default to "default" if roles are not initialized
  const userRole = isInitialized && roles.length > 0 
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

  // Get current user's employee ID, default to 0 if roles are not initialized
  const currentEmployeeId = isInitialized && roles.length > 0 
    ? parseInt(roles.find(r => r.includes("EmployeeID"))?.split("EmployeeID_")[1] || "0") 
    : 0;

  useEffect(() => {
    if (!isInitialized) return;

    const fetchEmployee = async () => {
      try {
        const employeeData = await getEmployee(Number(params.id));
        if (!employeeData) {
          setError("Employee not found.");
          return;
        }
        setEmployee(employeeData);
      } catch (fetchError) {
        console.error("Failed to fetch employee:", fetchError);
        setError("Failed to fetch employee data. Please try again or contact support.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [params.id, isInitialized]);

  const handleBack = () => {
    router.push("/employees");
  };

  // Check if user can edit (Admin can edit all, others can edit only their own record)
  const canEdit = userRole === "Admin" || Number(params.id) === currentEmployeeId;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Employees
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!employee) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Employees
        </Button>
        <Typography variant="h5" color="error">
          Employee not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
        Back to Employees
      </Button>
      {canEdit ? (
        <Typography variant="h4" gutterBottom sx={{ color: "#682A53" }}>
          Edit Employee: {employee.FirstName} {employee.LastName}
        </Typography>
      ) : (
        <Typography variant="h4" gutterBottom sx={{ color: "#682A53" }}>
          View Employee: {employee.FirstName} {employee.LastName}
        </Typography>
      )}
      <EmployeeForm employee={employee} userRole={userRole} permissions={permissions.employees} canEdit={canEdit} />
    </Box>
  );
}