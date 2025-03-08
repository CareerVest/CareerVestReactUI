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
import { useRouter, useParams } from "next/navigation";
import { theme } from "@/styles/theme";
import Sidebar from "@/app/sharedComponents/sidebar";
import { AuthProvider } from "@/contexts/authContext";
import { useAuth } from "@/contexts/authContext";
import permissions from "@/app/utils/permissions";
import { dummyInterviewChains } from "@/app/interviewChains/interviewChains";
import InterviewEditChainForm from "@/app/interviewChains/components/interviewEditChainForm";

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
  Comments?: string; // Added Comments as an optional property
}

export default function EditInterviewChain() {
  const { id } = useParams();
  const { isAuthenticated, isInitialized, roles, login } = useAuth();
  const router = useRouter();
  const [chain, setChain] = useState<InterviewChain | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Corrected from state to useState
  const [success, setSuccess] = useState<string | null>(null);
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
  const canEdit =
    permissions.interviewChains[userRole]?.editInterviewChain === true;

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

  // Fetch chain and redirect if user can't edit
  useEffect(() => {
    if (!isInitialized) return;

    const checkAccessAndFetch = async () => {
      try {
        if (!isAuthenticated) {
          const loginSuccess = await login();
          if (!loginSuccess) router.push("/login");
          return;
        }
        if (!canEdit) {
          router.push("/interview-chains");
          return;
        }
        const fetchedChain = dummyInterviewChains.find(
          (c: InterviewChain) => c.InterviewChainID === Number(id)
        );
        if (fetchedChain) {
          setChain(fetchedChain);
        } else {
          setError("Interview chain not found.");
        }
      } catch (error) {
        console.error("Error fetching interview chain:", error);
        setError("Failed to fetch interview chain.");
      } finally {
        setLoading(false);
      }
    };
    checkAccessAndFetch();
  }, [isAuthenticated, isInitialized, router, login, canEdit, id]);

  const handleUpdate = (updatedData: InterviewChain) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const index = dummyInterviewChains.findIndex(
      (c: InterviewChain) => c.InterviewChainID === Number(id)
    );
    if (index !== -1) {
      dummyInterviewChains[index] = {
        ...updatedData,
        ModifiedDate: new Date().toISOString(),
      };
      setSuccess("Interview chain updated successfully!");
      setTimeout(() => router.push("/interview-chains"), 1000);
    } else {
      setError("Failed to update interview chain.");
    }
    setLoading(false);
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
  if (!canEdit) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You do not have permission to edit interview chains.
        </Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !chain) {
    return (
      <Box sx={{ p: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/interview-chains")}
          sx={{ mb: 2 }}
        >
          Back to Interview Chains
        </Button>
        <Alert severity="error">{error || "Interview chain not found."}</Alert>
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
                  onClick={() => router.push("/interview-chains")}
                  sx={{ mb: 2 }}
                >
                  Back to Interview Chains
                </Button>
                <Typography variant="h4" sx={{ mb: 3, color: "#682A53" }}>
                  Edit Interview Chain
                </Typography>
                {success && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                  </Alert>
                )}
                {chain && (
                  <InterviewEditChainForm
                    initialData={chain}
                    interviewChainId={Number(id)}
                    onSubmit={handleUpdate}
                    loading={loading}
                  />
                )}
              </Box>
            </Box>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
