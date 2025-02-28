"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { EmployeeDetail } from "../../types/employees/employeeDetail";
import { useAuth } from "@/contexts/authContext";
import permissions from "../../utils/permissions";
import { getEmployee } from "../actions/employeeActions";

export default function EmployeeView({ params }: { params: { id: string } }) {
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [loading, setLoading] = useState(true);
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

  // Get current user's employee ID
  const currentEmployeeId = roles.length > 0 ? parseInt(roles.find(r => r.includes("EmployeeID"))?.split("EmployeeID_")[1] || "0") : 0;

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employeeData = await getEmployee(Number(params.id));
        setEmployee(employeeData);
      } catch (error) {
        console.error("Failed to fetch employee:", error);
        alert("Failed to load employee data. Please try again or contact support.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [params.id]);

  const handleBack = () => {
    router.push("/employees");
  };

  const canEdit = userRole === "Admin" || Number(params.id) === currentEmployeeId;

  const formatDate = (date: string | null | undefined): string => {
    if (!date) return "N/A";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "Invalid Date" : d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!employee) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Employees
        </Button>
        <Typography variant="h4" gutterBottom>
          Employee Not Found
        </Typography>
        <Typography>
          The employee with ID {params.id} doesn’t exist or has been removed. Please check the employee ID and try again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
        Back to Employees
      </Button>
      <Typography variant="h4" gutterBottom sx={{ color: "#682A53" }}>
        Employee Details: {employee.FirstName} {employee.LastName}
      </Typography>
      <Grid container spacing={2}>
        {permissions.employees[userRole].basicInfo.view && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Table size="small">
                  <TableBody>
                    {/* Removed Employee ID row */}
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
              </CardContent>
            </Card>
          </Grid>
        )}
        {permissions.employees[userRole].basicInfo.view && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Role & Status
                </Typography>
                <Table size="small">
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
                      <TableCell>{formatDate(employee.JoinedDate)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Terminated Date
                      </TableCell>
                      <TableCell>{formatDate(employee.TerminatedDate)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        )}
        {permissions.employees[userRole].basicInfo.view && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Additional Details
                </Typography>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Employee Reference ID
                      </TableCell>
                      <TableCell>{employee.EmployeeReferenceID || "N/A"}</TableCell>
                    </TableRow>
                    {/* Removed Supervisor ID row, kept only Supervisor Name */}
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Supervisor Name
                      </TableCell>
                      <TableCell>{employee.SupervisorName || "N/A"}</TableCell>
                    </TableRow>
                    {/* Removed Created and Updated rows */}
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Company Comments
                      </TableCell>
                      <TableCell>{employee.CompanyComments || "N/A"}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
      {canEdit && (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="contained" color="primary" onClick={() => router.push(`/employees/${params.id}/edit`)}>
            Edit Employee
          </Button>
        </Box>
      )}
    </Box>
  );
}