"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Dialog,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab"; // Added TimelineConnector
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
import { useRouter, useParams } from "next/navigation";
import { theme } from "@/styles/theme";
import Sidebar from "@/app/sharedComponents/sidebar";
import { AuthProvider } from "@/contexts/authContext";
import { useAuth } from "@/contexts/authContext";
import permissions from "@/app/utils/permissions";
import { dummyInterviewChains } from "@/app/interviewChains/interviewChains";

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

export default function InterviewChainDetail() {
  const { id } = useParams();
  const { isAuthenticated, isInitialized, roles, login } = useAuth();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [authChecked, setAuthChecked] = useState<boolean | null>(null);

  const userRole =
    roles.length > 0
      ? roles.includes("Admin")
        ? "Admin"
        : roles.includes("recruiter")
        ? "recruiter"
        : "default"
      : "default";
  const canView =
    permissions.interviewChains[userRole]?.viewInterviewChain === true;
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

  // Redirect if user can't view
  useEffect(() => {
    if (!isInitialized) return;

    const checkAccess = async () => {
      try {
        if (!isAuthenticated) {
          const loginSuccess = await login();
          if (!loginSuccess) router.push("/login");
          return;
        }
        if (!canView) {
          router.push("/interview-chains");
        }
      } catch (error) {
        console.error("Auth or permission check failed:", error);
        router.push("/login");
      }
    };
    checkAccess();
  }, [isAuthenticated, isInitialized, router, login, canView]);

  const getChain = (id: string | string[]) => {
    const chain: InterviewChain[] = [];
    let current = dummyInterviewChains.find(
      (i: InterviewChain) => i.InterviewChainID === Number(id)
    );
    while (current) {
      chain.unshift(current);
      current = dummyInterviewChains.find(
        (i: InterviewChain) =>
          i.InterviewChainID === current?.ParentInterviewChainID
      );
    }
    return chain;
  };

  const chain = getChain(id);

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
  if (!canView) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You do not have permission to view interview chains.
        </Alert>
      </Box>
    );
  }

  if (chain.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/interview-chains")}
          sx={{ mb: 2 }}
        >
          Back to Interview Chains
        </Button>
        <Alert severity="warning">
          No chain found for Interview Chain ID: {id}
        </Alert>
      </Box>
    );
  }

  const handleEndInterview = (interviewChainId: number) => {
    // Simulate ending (replace with API call)
    console.log(`Ending interview chain ${interviewChainId}`);
    router.push("/interview-chains");
  };

  // Define sidebar widths
  const sidebarWidthExpanded = 280;
  const sidebarWidthCollapsed = 80;

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
                <Typography variant="h4" sx={{ color: "#682A53", mb: 3 }}>
                  Interview Chain for ID: {id}
                </Typography>
                <Card
                  sx={{
                    borderRadius: 12,
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <CardContent>
                    <Timeline>
                      {chain.map((interview: InterviewChain, index: number) => (
                        <TimelineItem key={interview.InterviewChainID}>
                          <TimelineSeparator>
                            <TimelineDot
                              color={
                                interview.InterviewStatus === "Completed"
                                  ? "success"
                                  : "primary"
                              }
                            />
                            {index < chain.length - 1 && <TimelineConnector />}{" "}
                            {/* Add TimelineConnector for all but the last item */}
                          </TimelineSeparator>
                          <TimelineContent>
                            <Card sx={{ mb: 2, borderRadius: 8 }}>
                              <CardContent>
                                <Typography variant="h6">
                                  {interview.InterviewType}
                                </Typography>
                                <Typography variant="body1">
                                  {interview.InterviewDate} |{" "}
                                  {interview.InterviewStatus}
                                  {interview.Outcome &&
                                    ` | Outcome: ${interview.Outcome}`}
                                </Typography>
                                {canEdit &&
                                  interview.InterviewStatus !== "Completed" && (
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      size="small"
                                      onClick={() =>
                                        handleEndInterview(
                                          interview.InterviewChainID
                                        )
                                      }
                                      sx={{ mt: 1, borderRadius: 1 }}
                                    >
                                      End Interview
                                    </Button>
                                  )}
                              </CardContent>
                            </Card>
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
