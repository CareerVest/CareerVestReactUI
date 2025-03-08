"use client";

import { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { theme } from "@/styles/theme";
import Sidebar from "@/app/sharedComponents/sidebar";
import { AuthProvider } from "@/contexts/authContext";
import { useAuth } from "@/contexts/authContext";
import permissions from "@/app/utils/permissions";
import { dummyInterviewChains } from "../interviewChains";

// Define the type for InterviewChain
interface InterviewChain {
  InterviewChainID: number;
  ClientID: number;
  EndClientName: string;
  InterviewType: string;
  InterviewDate: string;
  InterviewStartTime: string;
  InterviewEndTime: string;
  InterviewMethod: string;
  InterviewStatus: string;
  InterviewSupport: string;
  Outcome: string | null;
  ParentInterviewChainID: number | null;
  CreatedDate: string;
  ModifiedDate: string;
}

export default function DataSyncDashboard() {
  const { isAuthenticated, isInitialized, roles, login } = useAuth();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [authChecked, setAuthChecked] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedChain, setSelectedChain] = useState<InterviewChain | null>(
    null
  );

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

  const canSync = permissions.interviewChains[userRole]?.editInterviewChain; // Updated to use interviewChains permissions

  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("isAuthenticated") === "true";
      setAuthChecked(auth);

      if (!auth) {
        router.replace("/login");
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [router]);

  // Redirect if user can't sync
  useEffect(() => {
    if (!isInitialized) return;

    const checkAccess = async () => {
      try {
        if (!isAuthenticated) {
          const loginSuccess = await login();
          if (!loginSuccess) router.push("/login");
          return;
        }
        if (!canSync) {
          router.push("/interview-chains");
        }
      } catch (error) {
        console.error("Auth or permission check failed:", error);
        router.push("/login");
      }
    };
    checkAccess();
  }, [isAuthenticated, isInitialized, router, login, canSync]);

  const columns: GridColDef[] = [
    { field: "InterviewChainID", headerName: "Chain ID", width: 100 },
    { field: "ClientID", headerName: "Client ID", width: 100 },
    { field: "EndClientName", headerName: "End Client", width: 150 },
    { field: "InterviewDate", headerName: "Date", width: 120 },
    { field: "ParentInterviewChainID", headerName: "Parent ID", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setSelectedChain(params.row);
            setOpen(true);
          }}
        >
          Adjust Chain
        </Button>
      ),
    },
  ];

  const handleAdjustChain = () => {
    if (selectedChain) {
      console.log("Adjusting chain for", selectedChain.InterviewChainID);
    }
    setOpen(false);
  };

  // Define sidebar widths
  const sidebarWidthExpanded = 280;
  const sidebarWidthCollapsed = 80;

  // Handle loading states
  if (authChecked === null) {
    return (
      <html lang="en">
        <body>
          <div style={{ textAlign: "center", marginTop: "20%" }}>
            Loading...
          </div>
        </body>
      </html>
    );
  }

  if (!isInitialized)
    return <Box sx={{ p: 3 }}>Verifying authentication...</Box>;
  if (!isAuthenticated) return <Box sx={{ p: 3 }}>Redirecting to login...</Box>;
  if (!canSync) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You do not have permission to sync interview chains.
        </Alert>
      </Box>
    );
  }

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <Box sx={{ minHeight: "100vh", display: "flex" }}>
              {isAuthenticated && (
                <Sidebar
                  permissions={permissions}
                  userRole={userRole}
                  isCollapsed={isCollapsed}
                  setIsCollapsed={setIsCollapsed}
                />
              )}
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  bgcolor: "background.default",
                  width: `calc(100% - ${
                    isCollapsed ? sidebarWidthCollapsed : sidebarWidthExpanded
                  }px)`,
                  transition: "width 0.3s ease",
                  p: 3,
                }}
              >
                <Typography variant="h4" sx={{ color: "#682A53", mb: 3 }}>
                  Interview Chains Sync Dashboard
                </Typography>
                <DataGrid
                  rows={dummyInterviewChains}
                  columns={columns}
                  getRowId={(row) => row.InterviewChainID}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10, page: 0 },
                    },
                  }}
                  pageSizeOptions={[10, 25, 50]}
                  paginationMode="client"
                  autoHeight
                  disableRowSelectionOnClick
                  sx={{
                    borderRadius: 2,
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                  }}
                />
                <Dialog open={open} onClose={() => setOpen(false)}>
                  <DialogTitle>
                    Adjust Chain for ID:{" "}
                    {selectedChain ? selectedChain.InterviewChainID : "N/A"}
                  </DialogTitle>
                  <DialogContent>
                    <Alert severity="info">
                      Set new ParentInterviewChainID or detach (simulated).
                    </Alert>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleAdjustChain} color="primary">
                      Save
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            </Box>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
