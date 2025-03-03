"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid"; // Using only GridRenderCellParams as requested
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { inactivateEmployee, fetchEmployees } from "../actions/employeeActions";
import permissions from "@/app/utils/permissions";
import type { EmployeeList } from "@/app/types/employees/employeeList";

export default function EmployeeList({
  employees: initialEmployees,
}: {
  employees: EmployeeList[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<EmployeeList[]>(
    initialEmployees || []
  ); // Default to empty array if null/undefined
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth); // Add window width for responsive behavior
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete dialog
  const [employeeToInactivate, setEmployeeToInactivate] = useState<
    number | null
  >(null); // Track employee to inactivate
  const [deleteError, setDeleteError] = useState<string | null>(null); // State for error messages
  const router = useRouter();
  const [message, setMessage] = useState<{ type: string; text: string } | null>(
    null
  );
  const { roles } = useAuth();

  // Determine user role with Azure AD casing
  const userRole =
    roles.length > 0
      ? roles.includes("Admin")
        ? "Admin"
        : roles.includes("Sales_Executive")
        ? "Sales_Executive"
        : roles.includes("Senior_Recruiter")
        ? "Senior_Recruiter"
        : roles.includes("recruiter")
        ? "recruiter"
        : roles.includes("Resume_Writer")
        ? "Resume_Writer"
        : "default"
      : "default";

  // Get current user's employee ID
  const currentEmployeeId =
    roles.length > 0
      ? parseInt(
          roles
            .find((r) => r.includes("EmployeeID"))
            ?.split("EmployeeID_")[1] || "0"
        )
      : 0;

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true);
      try {
        const employeeData = await fetchEmployees();
        // Filter out any invalid rows (e.g., missing EmployeeID or empty objects) and only show active employees
        const validActiveEmployees = employeeData.filter(
          (emp) => emp.EmployeeID != null && emp.EmployeeID > 0 //&&
          //emp.Status !== "Inactive"
        );
        setEmployees(validActiveEmployees);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  const handleView = useCallback(
    (id: number) => {
      if (permissions.employees[userRole].viewEmployee) {
        router.push(`/employees/${id}`);
      }
    },
    [router, userRole]
  );

  const handleEdit = useCallback(
    (id: number) => {
      if (permissions.employees[userRole].editEmployee) {
        router.push(`/employees/${id}/edit`);
        // if (userRole === "Admin" || id === currentEmployeeId) {
        //   router.push(`/employees/${id}/edit`);
        // } else {
        //   alert("You do not have permission to edit this employee.");
        // }
      }
    },
    [router, userRole, currentEmployeeId]
  );

  const handleDeleteClick = useCallback(
    (id: number) => {
      if (permissions.employees[userRole].deleteEmployee) {
        setEmployeeToInactivate(id);
        setDeleteDialogOpen(true);
      }
    },
    [userRole]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (employeeToInactivate === null) return;

    try {
      setLoading(true);
      setDeleteError(null);
      const success = await inactivateEmployee(employeeToInactivate); // Updated to expect boolean
      if (success) {
        // Update the employee list by removing the inactivated employee from the active list
        setEmployees(
          employees.filter((emp) => emp.EmployeeID !== employeeToInactivate)
        );
        console.log("✅ Employee marked as inactive successfully");

        // Simplified feedback message since we no longer receive reassignment counts
        setMessage({
          type: "success",
          text: "Employee marked as inactive successfully.",
        });
        setTimeout(() => setMessage(null), 3000); // Hide after 3 seconds

        setDeleteDialogOpen(false);
        setEmployeeToInactivate(null);
      } else {
        throw new Error("Failed to mark employee as inactive.");
      }
    } catch (error) {
      console.error("Error marking employee as inactive:", error);
      if (error instanceof Error) {
        setDeleteError(
          error.message ||
            "Failed to mark employee as inactive. Please try again."
        );
      } else {
        setDeleteError(
          "Failed to mark employee as inactive. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [employeeToInactivate, employees]);

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEmployeeToInactivate(null);
    setDeleteError(null);
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "N/A";
    const parsedDate = date instanceof Date ? date : new Date(date);
    if (isNaN(parsedDate.getTime())) return "N/A";
    const month = parsedDate.getMonth() + 1;
    const day = parsedDate.getDate();
    const year = parsedDate.getFullYear();
    return `${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "FirstName", headerName: "First Name", flex: 1 },
      { field: "LastName", headerName: "Last Name", flex: 1 },
      {
        field: "JoinedDate",
        headerName: "Joined Date",
        flex: 1,
        minWidth: 120, // Match ClientList column widths
        valueGetter: (params: GridRenderCellParams<any, EmployeeList>) => {
          if (!params) return "N/A"; // Safely handle undefined params or row
          // Use JoinedDate from params.row, ensuring it's a string
          const joinedDate = params;
          if (typeof joinedDate !== "string" || !joinedDate) return "N/A";
          return formatDate(joinedDate);
        },
      },
      {
        field: "SupervisorName",
        headerName: "Supervisor Name",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "CompanyEmailAddress",
        headerName: "Company Email",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "Status",
        headerName: "Status",
        flex: 1,
        minWidth: 120,
        renderCell: (params: GridRenderCellParams<EmployeeList>) => (
          <Chip
            label={params.value || "N/A"}
            color={
              params.value === "Active"
                ? "success"
                : params.value === "Inactive"
                ? "error"
                : "default"
            }
          />
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams<EmployeeList>) => (
          <Box>
            {permissions.employees[userRole].viewEmployee && (
              <IconButton
                onClick={() => handleView(params.row.EmployeeID)}
                size="small"
                color="primary"
              >
                <VisibilityIcon />
              </IconButton>
            )}
            {permissions.employees[userRole].editEmployee && (
              <IconButton
                onClick={() => handleEdit(params.row.EmployeeID)}
                size="small"
                color="primary"
              >
                <EditIcon />
              </IconButton>
            )}
            {permissions.employees[userRole].deleteEmployee && (
              <IconButton
                onClick={() => handleDeleteClick(params.row.EmployeeID)}
                size="small"
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ),
      },
    ],
    [handleView, handleEdit, handleDeleteClick, userRole, formatDate]
  );

  const filteredEmployees = employees.filter((employee) => {
    // Split search term into words and filter based on all keywords matching any string field
    if (!searchTerm.trim()) return true; // Return all if search is empty

    const keywords = searchTerm.toLowerCase().split(/\s+/);

    return keywords.every((keyword) => {
      return Object.values(employee).some((value) => 
            value !== null &&
            value !== undefined &&
            typeof value === "string" &&
            value.toLowerCase().includes(keyword)
          );
        });
      });

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
        {deleteError && (
          <Alert
            severity="error"
            onClose={() => setDeleteError(null)}
            sx={{ mb: 2 }}
          >
            {deleteError}
          </Alert>
        )}
        {message && (
          <Alert
            severity={message.type as "success" | "error"}
            onClose={() => setMessage(null)}
            sx={{ mb: 2 }}
          >
            {message.text}
          </Alert>
        )}
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={400}
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={filteredEmployees.filter(
              (emp: EmployeeList) =>
                emp.EmployeeID != null && emp.EmployeeID > 0
            )} // Explicitly type rows as EmployeeList
            columns={columns}
            getRowId={(row: EmployeeList) => row.EmployeeID} // Explicitly type row as EmployeeList
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            autoHeight
            disableRowSelectionOnClick
            columnVisibilityModel={{
              JoinedDate: windowWidth > 1200, // Responsive visibility for JoinedDate
              SupervisorName: windowWidth > 1000, // Responsive visibility for SupervisorName
              CompanyEmailAddress: windowWidth > 800, // Responsive visibility for CompanyEmailAddress
            }}
          />
        )}
      </Paper>

      {/* Inactivate Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="inactivate-dialog-title"
        aria-describedby="inactivate-dialog-description"
      >
        <DialogTitle id="inactivate-dialog-title">
          Confirm Inactivation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="inactivate-dialog-description">
            Are you sure you want to mark this employee as inactive? This action
            will mark them as inactive, and all associated clients and
            subordinates will be reassigned to their supervisor. This cannot be
            undone.
          </DialogContentText>
          {deleteError && (
            <DialogContentText color="error" sx={{ mt: 1 }}>
              {deleteError}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Inactivating..." : "Inactivate"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
