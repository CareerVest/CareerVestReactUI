"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import permissions from "../../utils/permissions";
import CreateInterviewForm from "../components/CreateInterviewForm";

// export const metadata = {
//   title: "Create New Interview | CareerVest",
// };

export default function NewInterviewPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, roles } = useAuth();
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
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!permissions.interviews[userRole]?.addInterview) {
      router.push("/interviews");
      return;
    }
  }, [isAuthenticated, router, userRole]);

  const handleFormSubmit = (data: any) => {
    setLoading(true);
    setError(null);
    // No need to handle submission here—InterviewForm handles it
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Please log in to create an interview.</Alert>
      </Box>
    );
  }

  if (!permissions.interviews[userRole]?.addInterview) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">You do not have permission to create interviews. Please contact an administrator.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button component={Link} href="/interviews" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to Interviews
      </Button>
      <Typography variant="h4" component="h1" sx={{ mb: 3, color: "#682A53" }}>
        Create New Interview
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2 }}>
          <CircularProgress />
        </Box>
      )}
      <CreateInterviewForm onSubmit={handleFormSubmit} />
    </Box>
  );
}