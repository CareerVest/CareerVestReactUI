"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Alert } from "@mui/material";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import permissions from "../utils/permissions";
import type { InterviewList as InterviewListType } from "@/app/types/interviews/interviewList";
import { fetchInterviews } from "./actions/interviewActions";
import InterviewListSkeleton from "./components/InterviewListSkeleton";
import AddInterviewButton from "./components/AddInterviewButton";
import InterviewList from "./components/InterviewList";

// Metadata (move to layout or server component if needed)
// export const metadata = {
//   title: "Interviews | CareerVest",
// };

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<InterviewListType[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isInitialized, user, login, roles } = useAuth(); // May throw if not in AuthProvider
  const router = useRouter();

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

  useEffect(() => {
    if (!isInitialized) return;

    const checkAuthAndLoad = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Delay for UX
      try {
        if (!isAuthenticated) {
          const loginSuccess = await login();
          if (!loginSuccess) {
            router.push("/login");
            return;
          }
        }

        if (!permissions.interviews[userRole]?.viewInterview) {
          return; // Don’t load data if no permission
        }

        const loadInterviews = async () => {
          try {
            const fetchedInterviews = await fetchInterviews();
            setInterviews(fetchedInterviews as InterviewListType[]);
          } catch (error) {
            if (error instanceof Error && error.message.includes("Authentication required")) {
              router.push("/login");
            }
            // Optionally show an error Alert here for non-auth errors
          } finally {
            setLoading(false);
          }
        };

        loadInterviews();
      } catch (error) {
        console.error("Auth or permission check failed:", error);
        // Fallback: If useAuth throws, redirect or show an error
        router.push("/login");
      }
    };

    checkAuthAndLoad();
  }, [isAuthenticated, isInitialized, router, login, userRole]);

  if (!isInitialized) {
    return <Box sx={{ p: 3 }}>Verifying authentication...</Box>;
  }

  if (!isAuthenticated) {
    return <Box sx={{ p: 3 }}>Redirecting to login...</Box>;
  }

  if (!permissions.interviews[userRole]?.viewInterview) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You do not have permission to view interviews. Please contact an administrator.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ color: "#682A53" }}>
          Interviews
        </Typography>
        {permissions.interviews[userRole]?.addInterview && <AddInterviewButton />}
      </Box>
      {loading ? <InterviewListSkeleton /> : <InterviewList interviews={interviews} />}
    </Box>
  );
}