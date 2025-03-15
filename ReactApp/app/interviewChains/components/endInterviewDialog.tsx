"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Close, Check, ThumbUp, Cancel } from "@mui/icons-material";
import { endInterviewChain } from "../actions/interviewChainActions";
import type {
  InterviewChain,
  Interview,
  InterviewChainEnd,
} from "@/app/types/interviewChain/interviewChain";

interface EndInterviewDialogProps {
  chain: InterviewChain;
  open: boolean;
  onClose: () => void;
  onSubmit: (
    chainId: string,
    outcome: "Next" | "Rejected" | "Offer" | "AddNew" | "Edit",
    newInterview?: Partial<Interview> & {
      clientName?: string;
      position?: string;
      recruiterName?: string;
    }
  ) => void;
  onOpenAddInterview: () => void;
  selectedInterview?: Interview;
  isSubmitting?: boolean;
}

export default function EndInterviewDialog({
  chain,
  open,
  onClose,
  onSubmit,
  onOpenAddInterview,
  selectedInterview,
  isSubmitting = false,
}: EndInterviewDialogProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const interviewToEnd =
    selectedInterview || chain.interviews[chain.interviews.length - 1];

  const handleEndSubmit = async (outcome: "Next" | "Rejected" | "Offer") => {
    if (isSubmitting || loading) return;

    setLoading(true);
    try {
      if (outcome === "Next") {
        onOpenAddInterview();
      } else {
        const payload: InterviewChainEnd = {
          interviewChainID: interviewToEnd.InterviewChainID,
          interviewOutcome: outcome,
          interviewFeedback: null,
          comments: null,
        };

        console.log("Ending interview with payload:", payload);
        await endInterviewChain(interviewToEnd.InterviewChainID, payload);
        onSubmit(interviewToEnd.InterviewChainID.toString(), outcome, {});
        onClose();
      }
    } catch (error) {
      console.error("Failed to end interview:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isSubmitting || loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">End Interview</Typography>
          <IconButton
            edge="end"
            onClick={onClose}
            aria-label="close"
            disabled={isSubmitting || loading}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          maxHeight: "60vh",
          overflowY: "auto",
          padding: 2,
          position: "relative",
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            {chain.clientName} - {chain.position}
          </Typography>
          {interviewToEnd && (
            <Typography variant="body2" color="text.secondary">
              Ending {interviewToEnd.Position || interviewToEnd.InterviewType}{" "}
              interview scheduled for{" "}
              {interviewToEnd.InterviewDate
                ? new Date(interviewToEnd.InterviewDate).toLocaleDateString()
                : "N/A"}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            What was the outcome of this interview?
          </Typography>
          <Button
            variant="contained"
            color="info"
            startIcon={loading ? <CircularProgress size={20} /> : <Check />}
            onClick={() => handleEndSubmit("Next")}
            fullWidth
            sx={{ justifyContent: "flex-start", py: 1 }}
            disabled={isSubmitting || loading}
          >
            {loading ? "Proceeding to Next Round" : "Proceed to Next Round"}
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<ThumbUp />}
            onClick={() => handleEndSubmit("Offer")}
            fullWidth
            sx={{ justifyContent: "flex-start", py: 1 }}
            disabled={isSubmitting || loading}
          >
            Extend Offer
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Cancel />}
            onClick={() => handleEndSubmit("Rejected")}
            fullWidth
            sx={{ justifyContent: "flex-start", py: 1 }}
            disabled={isSubmitting || loading}
          >
            Reject Candidate
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={isSubmitting || loading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
