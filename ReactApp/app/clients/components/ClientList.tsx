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

interface ClientListProps {
  clients: ClientList[];
}

// const dummyRecruiters = {
//   1: "Sarah Thompson",
//   2: "Michael Brown",
//   3: "Emily Davis",
// };

export default function ClientList({ clients }: ClientListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const router = useRouter();

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleView = useCallback(
    (id: number) => {
      router.push(`/clients/${id}`);
    },
    [router]
  );

  const handleEdit = useCallback(
    (id: number) => {
      router.push(`/clients/${id}/edit`);
    },
    [router]
  );

  const handleDelete = useCallback((id: number) => {
    if (confirm("Are you sure you want to delete this client?")) {
    }
  }, []);

  const formatDate = (date: string | Date | null) => {
    if (!date) return "N/A"; // Handle null or undefined
    const parsedDate = date instanceof Date ? date : new Date(date); // Ensure it's a Date object
    if (isNaN(parsedDate.getTime())) return "N/A"; // Handle invalid dates
    const month = parsedDate.getMonth() + 1; // Months are zero-based
    const day = parsedDate.getDate();
    const year = parsedDate.getFullYear();
    return `${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")}/${year}`;
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
          if (!params) return "N/A"; // ✅ Null safety check

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
            <IconButton
              onClick={() => handleView(params.row.clientID)}
              size="small"
              color="primary"
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton
              onClick={() => handleEdit(params.row.clientID)}
              size="small"
              color="primary"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => handleDelete(params.row.clientID)}
              size="small"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ),
      },
    ],
    [handleView, handleEdit, handleDelete, formatDate]
  );

  // 🔍 Robust Search: Supports multiple terms like "r, placed, net"
  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return clients;

    const keywords = searchTerm.toLowerCase().split(/\s+/); // Split by spaces or commas

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
              assignedRecruiterID: windowWidth > 800,
              totalDue: windowWidth > 600,
              totalPaid: windowWidth > 600,
            }}
          />
        )}
      </Paper>
    </Box>
  );
}
