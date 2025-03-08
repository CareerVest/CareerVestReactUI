"use client";

import { useState, useEffect } from "react";
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
} from "@mui/material";
import type { MarketingInterview } from "@/app/types/MarketingActivity/Marketing";
import type { InterviewDetail } from "@/app/types/interviews/interviewDetail";

interface InterviewSidebarProps {
  interview: MarketingInterview | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InterviewSidebar({
  interview,
  isOpen,
  onClose,
}: InterviewSidebarProps) {
  const [editedInterview, setEditedInterview] =
    useState<InterviewDetail | null>(null);

  useEffect(() => {
    if (interview) {
      // Map MarketingInterview to InterviewDetail for read-only display
      setEditedInterview({
        InterviewID: interview.interviewID,
        InterviewEntryDate: interview.interviewEntryDate || null,
        RecruiterID: interview.recruiterID || null,
        RecruiterName: interview.recruiterName || null,
        InterviewDate: interview.interviewDate || null,
        InterviewStartTime: interview.interviewStartTime || null,
        InterviewEndTime: interview.interviewEndTime || null,
        ClientID: interview.clientID || null,
        ClientName: interview.clientName || null,
        InterviewType: interview.interviewType || null,
        InterviewMethod: interview.interviewMethod || null,
        Technology: interview.technology || null,
        InterviewFeedback: interview.interviewFeedback || null,
        InterviewStatus: interview.interviewStatus || null,
        InterviewSupport: interview.interviewSupport || null,
        Comments: interview.comments || null,
        CreatedDate: null,
        ModifiedDate: null,
        EndClientName: interview.endClientName || null,
        CreatedTS: null,
        UpdatedTS: null,
      });
    } else {
      setEditedInterview(null);
    }
  }, [interview]);

  const handleViewDetails = () => {
    if (interview && interview.interviewID) {
      window.open(`/interviews/${interview.interviewID}`, "_blank");
    }
  };

  const formatDate = (date: string | null | undefined): string => {
    if (!date) return "N/A";
    const d = new Date(date);
    return isNaN(d.getTime())
      ? "Invalid Date"
      : d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  if (!editedInterview || !isOpen) return null;

  return (
    <Box
      sx={{
        p: 2
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#682A53", fontSize: "1.5rem" }}
      >
        Interview Details: {editedInterview.ClientName || "N/A"}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ border: "1px solid rgba(0, 0, 0, 0.12)" }}>
            <CardContent sx={{ p: 2 }}>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Interview Date
                    </TableCell>
                    <TableCell>
                      {formatDate(editedInterview.InterviewDate)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Start Time
                    </TableCell>
                    <TableCell>
                      {editedInterview.InterviewStartTime || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      End Time
                    </TableCell>
                    <TableCell>
                      {editedInterview.InterviewEndTime || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Recruiter
                    </TableCell>
                    <TableCell>
                      {editedInterview.RecruiterName || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Client
                    </TableCell>
                    <TableCell>{editedInterview.ClientName || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Technology
                    </TableCell>
                    <TableCell>{editedInterview.Technology || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Interview Type
                    </TableCell>
                    <TableCell>
                      {editedInterview.InterviewType || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Interview Method
                    </TableCell>
                    <TableCell>
                      {editedInterview.InterviewMethod || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Interview Status
                    </TableCell>
                    <TableCell>
                      {editedInterview.InterviewStatus || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Interview Support
                    </TableCell>
                    <TableCell>
                      {editedInterview.InterviewSupport || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Interview Feedback
                    </TableCell>
                    <TableCell>
                      {editedInterview.InterviewFeedback || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Comments
                    </TableCell>
                    <TableCell>{editedInterview.Comments || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      End Client Name
                    </TableCell>
                    <TableCell>
                      {editedInterview.EndClientName || "N/A"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
          >
            <Button
              variant="contained"
              onClick={handleViewDetails}
              sx={{
                bgcolor: "#FDC500",
                color: "#682A53",
                "&:hover": {
                  bgcolor: "#682A53",
                  color: "white",
                },
              }}
              disabled={!interview || !interview.interviewID}
            >
              View Details
            </Button>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                borderColor: "rgba(104, 42, 83, 0.2)",
                color: "#682A53",
                "&:hover": {
                  bgcolor: "#682A53",
                  color: "white",
                  borderColor: "#682A53",
                },
              }}
            >
              Close
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
