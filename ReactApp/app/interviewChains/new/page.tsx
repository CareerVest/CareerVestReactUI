"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { theme } from "@/styles/theme";
import Sidebar from "@/app/sharedComponents/sidebar";
import { AuthProvider } from "@/contexts/authContext";
import { useAuth } from "@/contexts/authContext";
import permissions from "@/app/utils/permissions";
import { dummyInterviewChains } from "../interviewChains"; // Fixed import path
import CreateInterviewChainForm from "../components/createInterviewChainForm"; // Fixed import path

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

export default function NewInterviewChainPage() {
  const { isAuthenticated, isInitialized, roles, login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [authChecked, setAuthChecked] = useState<boolean | null>(null);

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

  const canCreate = permissions.interviewChains[userRole]?.addInterviewChain;

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

  // Redirect if user can't create
  useEffect(() => {
    if (!isInitialized) return;

    const checkAccess = async () => {
      try {
        if (!isAuthenticated) {
          const loginSuccess = await login();
          if (!loginSuccess) router.push("/login");
          return;
        }
        if (!canCreate) {
          router.push("/interview-chains");
        }
      } catch (error) {
        console.error("Auth or permission check failed:", error);
        router.push("/login");
      }
    };
    checkAccess();
  }, [isAuthenticated, isInitialized, router, login, canCreate]);

  const handleFormSubmit = (data: Partial<InterviewChain>) => {
    setLoading(true);
    setError(null);

    // Validate required fields
    const requiredFields = {
      ClientID: data.ClientID || 0, // Default to 0 if not provided (adjust as needed)
      EndClientName: data.EndClientName || "Unknown",
      InterviewType: data.InterviewType || "Unknown",
      InterviewDate:
        data.InterviewDate || new Date().toISOString().split("T")[0],
      InterviewStartTime: data.InterviewStartTime || "00:00",
      InterviewEndTime: data.InterviewEndTime || "00:00",
      InterviewMethod: data.InterviewMethod || "Unknown",
      InterviewStatus: data.InterviewStatus || "Scheduled",
      InterviewSupport: data.InterviewSupport || "",
      Outcome: data.Outcome || null,
      ParentInterviewChainID: data.ParentInterviewChainID || null,
    };

    // Simulate API call
    console.log("Creating interview chain:", data);
    const newChain: InterviewChain = {
      ...requiredFields,
      InterviewChainID: dummyInterviewChains.length + 1,
      CreatedDate: new Date().toISOString(),
      ModifiedDate: new Date().toISOString(),
    };
    dummyInterviewChains.push(newChain);
    setTimeout(() => {
      setLoading(false);
      router.push("/interview-chains");
    }, 1000); // Simulate delay
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
  if (!canCreate) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You do not have permission to create interview chains.
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
                <Button
                  startIcon={<ArrowBackIcon />}
                  component="a"
                  href="/interview-chains"
                  sx={{ mb: 2 }}
                >
                  Back to Interview Chains
                </Button>
                <Typography variant="h4" sx={{ mb: 3, color: "#682A53" }}>
                  Create New Interview Chain
                </Typography>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                {loading && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 2 }}
                  >
                    <CircularProgress />
                  </Box>
                )}
                <CreateInterviewChainForm onSubmit={handleFormSubmit} />
              </Box>
            </Box>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
