"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableRow,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getInterview } from "../actions/interviewActions";
import { useAuth } from "@/contexts/authContext";
import permissions from "../../utils/permissions";
import type { InterviewDetail } from "@/app/types/interviews/interviewDetail";

export default function InterviewView({ params }: { params: { id: string } }) {
  const [interview, setInterview] = useState<InterviewDetail | null>(null);
  const [loading, setLoading] = useState(true);
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

  const canView = isAuthenticated && permissions.interviews[userRole]?.viewInterview === true;
  const canEdit = permissions.interviews[userRole]?.editInterview === true;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!canView) {
      router.push("/interviews");
      return;
    }

    const fetchInterview = async () => {
      try {
        const interviewData = await getInterview(Number(params.id));
        setInterview(interviewData);
      } catch (error) {
        console.error("Failed to fetch interview:", error);
        alert("Failed to load interview data. Please try again or contact support.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [params.id, isAuthenticated, router, canView]);

  const handleBack = () => {
    router.push("/interviews");
  };

  const formatDate = (date: string | null | undefined): string => {
    if (!date) return "N/A";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "Invalid Date" : d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!interview) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Interviews
        </Button>
        <Typography variant="h4" gutterBottom>
          Interview Not Found
        </Typography>
        <Typography>
          The interview with ID {params.id} doesn’t exist or has been removed. Please check the interview ID and try again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
        Back to Interviews
      </Button>
      <Typography variant="h4" gutterBottom sx={{ color: "#682A53" }}>
        Interview Details: {interview.ClientName || "N/A"}
      </Typography>
      <Grid container spacing={2}>
        {permissions.interviews[userRole]?.basicInfo?.view && (
          <Grid item xs={12} md={6}>
            <Card sx={{ border: "1px solid rgba(0, 0, 0, 0.12)" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">Interview Date</TableCell>
                      <TableCell>{formatDate(interview.InterviewDate)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Start Time</TableCell>
                      <TableCell>{interview.InterviewStartTime || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">End Time</TableCell>
                      <TableCell>{interview.InterviewEndTime || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Recruiter</TableCell>
                      <TableCell>{interview.RecruiterName || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Client</TableCell>
                      <TableCell>{interview.ClientName || "N/A"}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        )}
        {permissions.interviews[userRole]?.basicInfo?.view && (
          <Grid item xs={12} md={6}>
            <Card sx={{ border: "1px solid rgba(0, 0, 0, 0.12)" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Interview Details
                </Typography>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">Technology</TableCell>
                      <TableCell>{interview.Technology || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Interview Type</TableCell>
                      <TableCell>{interview.InterviewType || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Interview Method</TableCell>
                      <TableCell>{interview.InterviewMethod || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Interview Status</TableCell>
                      <TableCell>{interview.InterviewStatus || "N/A"}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        )}
        {permissions.interviews[userRole]?.basicInfo?.view && (
          <Grid item xs={12} md={6}>
            <Card sx={{ border: "1px solid rgba(0, 0, 0, 0.12)" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Additional Details
                </Typography>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">Interview Support</TableCell>
                      <TableCell>{interview.InterviewSupport || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Interview Feedback</TableCell>
                      <TableCell>{interview.InterviewFeedback || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Comments</TableCell>
                      <TableCell>{interview.Comments || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">End Client Name</TableCell>
                      <TableCell>{interview.EndClientName || "N/A"}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
      {canEdit && (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push(`/interviews/${params.id}/edit`)}
          >
            Edit Interview
          </Button>
        </Box>
      )}
    </Box>
  );
}