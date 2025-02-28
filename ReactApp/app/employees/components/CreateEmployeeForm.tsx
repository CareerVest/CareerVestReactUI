"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import type { EmployeeDetail } from "../../types/employees/employeeDetail";
import { useAuth } from "@/contexts/authContext";
import { createEmployee, fetchEmployees } from "../actions/employeeActions";
import { EmployeeList } from "@/app/types/employees/employeeList";
import permissions from "@/app/utils/permissions"; // Use raw permissions object

// Styled component for hidden file input (if needed in future, not used here currently)
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

// Define VALID_ROLES constant locally
const VALID_ROLES = [
  "Bench Sales Recruiter",
  "CEO",
  "Lead Generation And Sales Executive",
  "Marketing Manager",
  "Resume Writer",
  "Sales Executive",
  "Senior Recruiter",
  "Trainee Bench Sales Recruiter",
];

export default function CreateEmployeeForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<EmployeeDetail>({
    EmployeeID: 0, // Placeholder for new employee
    FirstName: "",
    LastName: "",
    PersonalEmailAddress: "",
    CompanyEmailAddress: "",
    PersonalPhoneNumber: "",
    PersonalPhoneCountryCode: "",
    JoinedDate: null,
    Status: "Active",
    TerminatedDate: null,
    Role: "",
    SupervisorID: null,
    SupervisorName: "",
    EmployeeReferenceID: "",
    CompanyComments: "",
    CreatedTS: null,
    UpdatedTS: null,
  });
  const [supervisors, setSupervisors] = useState<EmployeeList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({}); // Track errors for UI display
  const { roles, isInitialized } = useAuth(); // Use isInitialized for auth state

  // Determine user role with Azure AD casing, default to "default" if not initialized
  const userRole: keyof typeof permissions.employees = isInitialized && roles.length > 0 
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

  // Get current user's employee ID, default to 0 if not initialized
  const currentEmployeeId = isInitialized && roles.length > 0 
    ? parseInt(roles.find(r => r.includes("EmployeeID"))?.split("EmployeeID_")[1] || "0") 
    : 0;

  // Check if user can create employees (fallback check, though handled in NewEmployeePage)
  const canCreate = isInitialized && permissions.employees[userRole]?.addEmployee === true;

  useEffect(() => {
    if (!isInitialized) return;

    if (!canCreate) {
      setError("Unauthorized: You do not have permission to create employees.");
      return;
    }

    const fetchSupervisors = async () => {
      try {
        const employees = await fetchEmployees();
        console.log("Fetched employees for supervisors:", employees); // Debug log
        // Filter supervisors based on permissions (e.g., Admin sees all, others see only their supervisor chain)
        const validSupervisors = employees.filter((emp) => {
          if (userRole === "Admin") return true;
          if (userRole === "Senior_Recruiter") return emp.EmployeeID === currentEmployeeId || emp.SupervisorID === currentEmployeeId;
          return emp.EmployeeID === currentEmployeeId; // Others see only themselves as potential supervisors
        });
        console.log("Filtered supervisors:", validSupervisors); // Debug log
        setSupervisors(validSupervisors);
      } catch (error) {
        console.error("Failed to fetch supervisors:", error);
        setError("Failed to load supervisors. Please try again.");
      }
    };
    fetchSupervisors();
  }, [userRole, currentEmployeeId, isInitialized, canCreate]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (canCreate) { // Only allow changes if user can create
      setFormData((prevData) => ({
        ...prevData,
        [name]: value === "" ? null : value, // Handle empty inputs as null for optional fields
      }));
      // Clear validation error for this field
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    if (canCreate) { // Only allow changes if user can create
      // Determine if the value should be a number or string based on the field name
      const processedValue = name === "SupervisorID" ? (value === "" ? null : Number(value)) : (value === "" ? null : String(value));
      setFormData((prevData) => ({
        ...prevData,
        [name as string]: processedValue, // Handle empty selections as null for optional fields
      }));
      // Clear validation error for this field
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.FirstName?.trim()) {
      newErrors.FirstName = "First Name is required";
    }
    if (!formData.LastName?.trim()) {
      newErrors.LastName = "Last Name is required";
    }
    if (!formData.PersonalEmailAddress?.trim()) {
      newErrors.PersonalEmailAddress = "Personal Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.PersonalEmailAddress)) {
      newErrors.PersonalEmailAddress = "Invalid email format";
    }
    if (!formData.Role?.trim()) {
      newErrors.Role = "Role is required";
    } else if (!VALID_ROLES.includes(formData.Role)) {
      newErrors.Role = "Invalid role selected";
    }
    if (!formData.Status?.trim()) {
      newErrors.Status = "Status is required";
    }

    // Optional phone number validation (warning if invalid, not blocking submission)
    if (formData.PersonalPhoneNumber && !/^\d{10}$|^\d{3}-\d{3}-\d{4}$/.test(formData.PersonalPhoneNumber.replace(/-/g, ""))) {
      newErrors.PersonalPhoneNumber = "Phone number should be 10 digits (e.g., 1234567890 or 123-456-7890)";
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!canCreate) {
      setError("Unauthorized: You do not have permission to create employees.");
      return;
    }

    if (!validateForm()) {
      // No alert; errors are already displayed in the UI via validationErrors
      return; // Prevent form submission if validation fails
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log("Submitting form data:", formData); // Debug log
      await createEmployee(formData);
      router.push("/employees");
      router.refresh();
    } catch (error) {
      console.error("Failed to create employee:", error);
      setError("Failed to create employee. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ mt: 1, "& .MuiCard-root": { height: "100%" } }}
    >
      <Grid container spacing={0.5}>
        {permissions.employees[userRole]?.basicInfo?.view && (
          <Grid item xs={12} md={6} sx={{ mb: 1 }}>
            <Card>
              <CardContent sx={{ p: 1.5 }}>
                <Typography variant="h6" gutterBottom>Basic Information</Typography>
                <Grid container spacing={0.5}>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      required
                      fullWidth
                      id="FirstName"
                      name="FirstName"
                      label="First Name"
                      value={formData.FirstName || ""}
                      onChange={handleInputChange}
                      size="small"
                      disabled={!canCreate}
                      error={!!validationErrors.FirstName}
                      helperText={validationErrors.FirstName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      required
                      fullWidth
                      id="LastName"
                      name="LastName"
                      label="Last Name"
                      value={formData.LastName || ""}
                      onChange={handleInputChange}
                      size="small"
                      disabled={!canCreate}
                      error={!!validationErrors.LastName}
                      helperText={validationErrors.LastName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      required
                      fullWidth
                      id="PersonalEmailAddress"
                      name="PersonalEmailAddress"
                      label="Personal Email Address"
                      type="email"
                      value={formData.PersonalEmailAddress || ""}
                      onChange={handleInputChange}
                      size="small"
                      disabled={!canCreate}
                      error={!!validationErrors.PersonalEmailAddress}
                      helperText={validationErrors.PersonalEmailAddress}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="CompanyEmailAddress"
                      name="CompanyEmailAddress"
                      label="Company Email Address"
                      type="email"
                      value={formData.CompanyEmailAddress || ""}
                      onChange={handleInputChange}
                      size="small"
                      disabled={!canCreate}
                    />
                  </Grid>
                  {/* Country Code and Phone Number Side by Side */}
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <TextField
                        label="Code"
                        name="PersonalPhoneCountryCode"
                        value={formData.PersonalPhoneCountryCode || ""}
                        onChange={handleInputChange}
                        size="small"
                        sx={{ width: "30%" }}
                        disabled={!canCreate}
                        error={!!validationErrors.PersonalPhoneCountryCode}
                        helperText={validationErrors.PersonalPhoneCountryCode}
                      />
                      <TextField
                        label="Phone Number"
                        name="PersonalPhoneNumber"
                        value={formData.PersonalPhoneNumber || ""}
                        onChange={handleInputChange}
                        size="small"
                        sx={{ width: "70%" }}
                        disabled={!canCreate}
                        error={!!validationErrors.PersonalPhoneNumber}
                        helperText={validationErrors.PersonalPhoneNumber}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="JoinedDate"
                      name="JoinedDate"
                      label="Joined Date"
                      type="date"
                      value={formData.JoinedDate ? new Date(formData.JoinedDate).toISOString().split("T")[0] : ""}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      disabled={!canCreate}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
        {permissions.employees[userRole]?.basicInfo?.view && (
          <Grid item xs={12} md={6} sx={{ mb: 1 }}>
            <Card>
              <CardContent sx={{ p: 1.5 }}>
                <Typography variant="h6" gutterBottom>Role & Status</Typography>
                <Grid container spacing={0.5}>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <FormControl fullWidth size="small" sx={{ mt: 1 }} error={!!validationErrors.Role}>
                      <InputLabel id="Role-label">Role</InputLabel>
                      <Select
                        labelId="Role-label"
                        id="Role"
                        name="Role"
                        value={formData.Role || ""}
                        onChange={(event: SelectChangeEvent<string>) => handleSelectChange(event)}
                        label="Role"
                        size="small"
                        disabled={!canCreate}
                      >
                        {VALID_ROLES.map((role) => (
                          <MenuItem key={role} value={role}>
                            {role}
                          </MenuItem>
                        ))}
                      </Select>
                      {validationErrors.Role && <Typography color="error" variant="caption">{validationErrors.Role}</Typography>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <FormControl fullWidth size="small" sx={{ mt: 1 }} error={!!validationErrors.Status}>
                      <InputLabel id="Status-label">Status</InputLabel>
                      <Select
                        labelId="Status-label"
                        id="Status"
                        name="Status"
                        value={formData.Status || ""}
                        onChange={(event: SelectChangeEvent<string>) => handleSelectChange(event)}
                        label="Status"
                        size="small"
                        disabled={!canCreate}
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                      </Select>
                      {validationErrors.Status && <Typography color="error" variant="caption">{validationErrors.Status}</Typography>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="TerminatedDate"
                      name="TerminatedDate"
                      label="Terminated Date"
                      type="date"
                      value={formData.TerminatedDate ? new Date(formData.TerminatedDate).toISOString().split("T")[0] : ""}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      disabled={!canCreate}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
        {permissions.employees[userRole]?.basicInfo?.view && (
          <Grid item xs={12} md={6} sx={{ mb: 1 }}>
            <Card>
              <CardContent sx={{ p: 1.5 }}>
                <Typography variant="h6" gutterBottom>Additional Details</Typography>
                <Grid container spacing={0.5} alignItems="center">
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="EmployeeReferenceID"
                      name="EmployeeReferenceID"
                      label="Employee Reference ID"
                      value={formData.EmployeeReferenceID || ""}
                      onChange={handleInputChange}
                      size="small"
                      disabled={!canCreate}
                      sx={{ mt: 0, mb: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <FormControl fullWidth size="small" sx={{ mt: 0, mb: 0 }}>
                      <InputLabel id="SupervisorID-label">Supervisor</InputLabel>
                      <Select
                        labelId="SupervisorID-label"
                        id="SupervisorID"
                        name="SupervisorID"
                        value={formData.SupervisorID?.toString() || ""}
                        onChange={(event: SelectChangeEvent<string>) => handleSelectChange(event)}
                        label="Supervisor"
                        size="small"
                        disabled={!canCreate}
                      >
                        <MenuItem value="">None</MenuItem>
                        {supervisors.map((supervisor) => (
                          <MenuItem key={supervisor.EmployeeID} value={supervisor.EmployeeID.toString()}>
                            {`${supervisor.FirstName} ${supervisor.LastName}`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="CompanyComments"
                      name="CompanyComments"
                      label="Company Comments"
                      multiline
                      minRows={3} // Allow vertical expansion as text increases
                      maxRows={10}
                      value={formData.CompanyComments || ""}
                      onChange={handleInputChange}
                      size="small"
                      disabled={!canCreate}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
        {permissions.employees[userRole]?.basicInfo?.view && (
          <Grid item xs={12} sx={{ mb: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
              <Button onClick={() => router.push("/employees")} variant="outlined">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={isLoading || !canCreate}>
                {isLoading ? "Creating..." : "Create Employee"}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}