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
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import type { ClientList } from "@/app/types/Clients/ClientList";
<<<<<<< HEAD
import { useAuth } from "@/contexts/authContext"; // Removed AddClientButton import
=======
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)

interface ClientListProps {
  clients: ClientList[];
}

<<<<<<< HEAD
// Define permissions for ClientList page
interface ClientListPermissions {
  viewList: boolean;
  addClient: boolean; // Still needed for logic, but not rendering button here
  viewClient: boolean;
  editClient: boolean;
  deleteClient: boolean;
}

const permissions: Record<string, ClientListPermissions> = {
  Admin: {
    viewList: true,
    addClient: true,
    viewClient: true,
    editClient: true,
    deleteClient: true,
  },
  Senior_Recruiter: {
    viewList: true,
    addClient: false,
    viewClient: true,
    editClient: true,
    deleteClient: false,
  },
  Sales_Executive: {
    viewList: true,
    addClient: false,
    viewClient: true,
    editClient: false,
    deleteClient: false,
  },
  recruiter: {
    viewList: true,
    addClient: false,
    viewClient: true,
    editClient: false,
    deleteClient: false,
  },
  default: {
    viewList: true,
    addClient: false,
    viewClient: true,
    editClient: false,
    deleteClient: false,
  },
};
=======
// const dummyRecruiters = {
//   1: "Sarah Thompson",
//   2: "Michael Brown",
//   3: "Emily Davis",
// };
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)

export default function ClientList({ clients }: ClientListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
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
              : "default") 
    : "default";

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleView = useCallback(
    (id: number) => {
      if (permissions[userRole].viewClient) {
        router.push(`/clients/${id}`);
      }
    },
    [router, userRole]
  );

  const handleEdit = useCallback(
    (id: number) => {
      if (permissions[userRole].editClient) {
        router.push(`/clients/${id}/edit`);
      }
    },
    [router, userRole]
  );

  const handleDelete = useCallback((id: number) => {
<<<<<<< HEAD
    if (permissions[userRole].deleteClient && confirm("Are you sure you want to delete this client?")) {
      // Add delete logic here if implemented
=======
    if (confirm("Are you sure you want to delete this client?")) {
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
    }
  }, [userRole]);

  const formatDate = (date: string | Date | null) => {
<<<<<<< HEAD
    if (!date) return "N/A";
    const parsedDate = date instanceof Date ? date : new Date(date);
    if (isNaN(parsedDate.getTime())) return "N/A";
    const month = parsedDate.getMonth() + 1;
    const day = parsedDate.getDate();
    const year = parsedDate.getFullYear();
    return `${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}/${year}`;
=======
    if (!date) return "N/A"; // Handle null or undefined
    const parsedDate = date instanceof Date ? date : new Date(date); // Ensure it's a Date object
    if (isNaN(parsedDate.getTime())) return "N/A"; // Handle invalid dates
    const month = parsedDate.getMonth() + 1; // Months are zero-based
    const day = parsedDate.getDate();
    const year = parsedDate.getFullYear();
    return `${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")}/${year}`;
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "clientName",
        headerName: "Client Name",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "enrollmentDate",
        headerName: "Enrolled Date",
        flex: 1,
        minWidth: 120,
        valueGetter: (params) => {
          return formatDate(params);
        },
      },
      {
        field: "techStack",
        headerName: "Tech Stack",
        flex: 1,
        minWidth: 150,
        valueGetter: (params: GridRenderCellParams<any, ClientList>) => {
          if (!params) return "N/A";
          return params;
        },
      },
      {
        field: "salesPerson",
        headerName: "Sales Person",
        flex: 1,
        minWidth: 150,
        valueGetter: (params: GridRenderCellParams<any, ClientList>) => {
          if (!params) return "N/A";
          return params;
        },
      },
      {
        field: "assignedRecruiterName",
        headerName: "Recruiter",
        flex: 1,
        minWidth: 150,
        valueGetter: (params: GridRenderCellParams<any, ClientList>) => {
<<<<<<< HEAD
          if (!params) return "N/A";
=======
          if (!params) return "N/A"; // ✅ Null safety check

>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
          return params;
        },
      },
      {
        field: "clientStatus",
        headerName: "Status",
        flex: 1,
        minWidth: 120,
        renderCell: (params: GridRenderCellParams) => (
          <Chip
            label={params.value || "N/A"}
            color={
              params.value === "Active"
                ? "success"
                : params.value === "Placed"
                ? "primary"
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
        renderCell: (params: GridRenderCellParams) => (
          <Box>
            {permissions[userRole].viewClient && (
              <IconButton
                onClick={() => handleView(params.row.clientID)}
                size="small"
                color="primary"
              >
                <VisibilityIcon />
              </IconButton>
            )}
            {permissions[userRole].editClient && (
              <IconButton
                onClick={() => handleEdit(params.row.clientID)}
                size="small"
                color="primary"
              >
                <EditIcon />
              </IconButton>
            )}
            {permissions[userRole].deleteClient && (
              <IconButton
                onClick={() => handleDelete(params.row.clientID)}
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
    [handleView, handleEdit, handleDelete, formatDate, userRole]
  );

  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return clients;

    const keywords = searchTerm.toLowerCase().split(/\s+/);

    return clients.filter((client) =>
      keywords.every((keyword) =>
        Object.values(client).some(
          (value) => value && value.toString().toLowerCase().includes(keyword)
        )
      )
    );
  }, [clients, searchTerm]);

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
            rows={filteredClients}
            columns={columns}
            getRowId={(row) => row.clientID}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25, 50]}
            autoHeight
            disableRowSelectionOnClick
            columnVisibilityModel={{
              enrollmentDate: windowWidth > 1200,
              techStack: windowWidth > 1000,
              assignedRecruiterName: windowWidth > 800,
              totalDue: windowWidth > 600,
              totalPaid: windowWidth > 600,
            }}
          />
        )}
      </Paper>
    </Box>
  );
}