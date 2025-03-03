"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, CircularProgress, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "@/contexts/authContext";
import permissions from "@/app/utils/permissions";
import type { InterviewDetail } from "@/app/types/interviews/interviewDetail";
import { getInterview, updateInterview } from "../../actions/interviewActions";
import InterviewEditForm from "../../components/EditInterviewForm";

export default function InterviewEdit({ params }: { params: { id: string } }) {
  const [interview, setInterview] = useState<InterviewDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated, roles } = useAuth();

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

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!permissions.interviews[userRole]?.editInterview) {
      router.push("/interviews");
      return;
    }

    const fetchInterview = async () => {
      setLoading(true);
      setError(null);
      try {
        const interviewData = await getInterview(Number(params.id));
        if (!interviewData) {
          setError("Interview not found.");
          router.push("/interviews");
          return;
        }
        setInterview(interviewData); // Data is already normalized by getInterview
      } catch (error: any) {
        console.error("Failed to fetch interview:", error);
        setError("Failed to load interview data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [params.id, isAuthenticated, router, userRole]);

  const handleBack = () => {
    router.push("/interviews");
  };

  const handleUpdate = async (updatedData: InterviewDetail) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const success = await updateInterview(Number(params.id), updatedData);
      if (success) {
        setSuccess("Interview updated successfully!");
        setInterview(updatedData); // Update local state with new data
        router.push("/interviews"); // Redirect after successful update
      } else {
        setError("Failed to update interview. Please try again.");
      }
    } catch (error: any) {
      console.error("Failed to update interview:", error);
      setError("Failed to update interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !interview) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Interviews
        </Button>
        <Alert severity="error">{error || "Interview not found. Redirecting..."}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
        Back to Interviews
      </Button>
      <Typography variant="h4" gutterBottom sx={{ color: "#682A53" }}>
        Edit Interview
      </Typography>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
      <InterviewEditForm
        initialData={interview}
        interviewId={interview.InterviewID}
        onSubmit={handleUpdate}
        loading={loading}
      />
    </Box>
  );
}