"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  useTheme,
  FormHelperText,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import type {
  Interview,
  InterviewChain,
} from "@/app/types/interviewChain/interviewChain";
import { useInterviewForm } from "./hooks/useInterviewForm";
import interviewdropdowns from "../../utils/interviewDropdowns.json";

// Update the interface to include isSubmitting
interface EditInterviewDialogProps {
  chain: InterviewChain;
  open: boolean;
  onClose: () => void;
  onSubmit: (
    chainId: string,
    outcome: "Edit",
    newInterview?: Partial<Interview> & {
      clientName?: string;
      position?: string;
      recruiterName?: string;
    }
  ) => void;
  interviewToEdit: Interview;
  isSubmitting?: boolean;
}

export default function EditInterviewDialog({
  chain,
  open,
  onClose,
  onSubmit,
  interviewToEdit,
  isSubmitting = false,
}: EditInterviewDialogProps) {
  const theme = useTheme();
  const {
    newInterview,
    errors,
    loading,
    handleInputChange,
    validateAndSubmit,
  } = useInterviewForm(chain, true, interviewToEdit);

  const [isFormInitialized, setIsFormInitialized] = useState(false);

  useEffect(() => {
    if (open && !isFormInitialized && interviewToEdit) {
      // Initialize form fields
      handleInputChange("InterviewChainID", interviewToEdit.InterviewChainID);
      handleInputChange(
        "ParentInterviewChainID",
        interviewToEdit.ParentInterviewChainID ?? null
      );
      handleInputChange(
        "EndClientName",
        interviewToEdit.EndClientName || chain.endClientName || ""
      );
      handleInputChange(
        "Position",
        interviewToEdit.Position || chain.position || ""
      );
      handleInputChange(
        "ChainStatus",
        interviewToEdit.ChainStatus || chain.status || "Active"
      );
      handleInputChange("InterviewDate", interviewToEdit.InterviewDate || null);
      handleInputChange(
        "InterviewStartTime",
        interviewToEdit.InterviewStartTime || null
      );
      handleInputChange(
        "InterviewEndTime",
        interviewToEdit.InterviewEndTime || null
      );
      handleInputChange(
        "InterviewMethod",
        interviewToEdit.InterviewMethod || null
      );
      handleInputChange("InterviewType", interviewToEdit.InterviewType || null);
      handleInputChange(
        "InterviewStatus",
        interviewToEdit.InterviewStatus || "Scheduled"
      );
      handleInputChange(
        "InterviewOutcome",
        interviewToEdit.InterviewOutcome || null
      );
      handleInputChange("Comments", interviewToEdit.Comments || null);
      handleInputChange("RecruiterID", interviewToEdit.RecruiterID || null);
      handleInputChange("clientName", chain.clientName || "");
      handleInputChange("position", chain.position || "");
      handleInputChange("recruiterName", chain.recruiterName || "");

      // Trigger initial validation
      validateAndSubmit("Edit", () => {}); // Run validation without submitting
      setIsFormInitialized(true);
    }
    if (!open) {
      setIsFormInitialized(false);
    }
  }, [
    open,
    interviewToEdit,
    chain,
    handleInputChange,
    validateAndSubmit,
    isFormInitialized,
  ]);

  const handleEditSubmit = () => {
    // Prevent submission if already submitting
    if (isSubmitting || loading) return;

    validateAndSubmit("Edit", (chainId, outcome, newInterview) => {
      onSubmit(chainId, "Edit", newInterview);
    });
  };

  return (
    <Dialog
      open={open}
      onClose={isSubmitting || loading ? undefined : onClose} // Prevent closing during submission
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
          <Typography variant="h6">Edit Interview</Typography>
          <IconButton
            edge="end"
            onClick={onClose}
            aria-label="close"
            disabled={isSubmitting || loading} // Disable during submission
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
        {(loading || isSubmitting) && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <Typography color="white">Saving...</Typography>
          </Box>
        )}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            {chain.clientName} - {chain.position}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Editing {interviewToEdit.Position || interviewToEdit.InterviewType}{" "}
            interview scheduled for{" "}
            {interviewToEdit.InterviewDate
              ? new Date(interviewToEdit.InterviewDate).toLocaleDateString()
              : "N/A"}
          </Typography>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Recruiter Name"
              value={newInterview.recruiterName || ""}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: "#f5f5f5", color: "#666" }}
              disabled={isSubmitting || loading}
            />
            <TextField
              label="Client Name"
              value={newInterview.clientName || ""}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: "#f5f5f5", color: "#666" }}
              disabled={isSubmitting || loading}
            />
            <TextField
              label="Position"
              value={newInterview.position || ""}
              onChange={(e) => handleInputChange("position", e.target.value)}
              fullWidth
              disabled={isSubmitting || loading}
            />
            <FormControl fullWidth>
              <InputLabel id="chain-status-label">Chain Status</InputLabel>
              <Select
                labelId="chain-status-label"
                value={newInterview.ChainStatus || ""}
                label="Chain Status"
                disabled
                sx={{ backgroundColor: "#f5f5f5" }}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Successful">Successful</MenuItem>
                <MenuItem value="Unsuccessful">Unsuccessful</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth error={errors.interviewStatus}>
              <InputLabel id="interview-status-label">
                Interview Status
              </InputLabel>
              <Select
                labelId="interview-status-label"
                value={newInterview.InterviewStatus || ""}
                label="Interview Status"
                onChange={(e) =>
                  handleInputChange("InterviewStatus", e.target.value)
                }
                disabled={isSubmitting || loading}
              >
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
              {errors.interviewStatus && (
                <FormHelperText>Interview Status is required</FormHelperText>
              )}
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Interview Date *"
              type="date"
              value={
                newInterview.InterviewDate
                  ? new Date(newInterview.InterviewDate)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleInputChange("InterviewDate", e.target.value)
              }
              fullWidth
              error={errors.InterviewDate}
              helperText={errors.InterviewDate && "Date is required"}
              InputLabelProps={{ shrink: true }}
              disabled={isSubmitting || loading}
            />
            <TextField
              label="Interview Start Time"
              type="time"
              value={newInterview.InterviewStartTime || ""}
              onChange={(e) =>
                handleInputChange("InterviewStartTime", e.target.value)
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={isSubmitting || loading}
            />
            <TextField
              label="Interview End Time"
              type="time"
              value={newInterview.InterviewEndTime || ""}
              onChange={(e) =>
                handleInputChange("InterviewEndTime", e.target.value)
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={isSubmitting || loading}
            />
            <FormControl fullWidth error={errors.InterviewMethod}>
              <InputLabel id="interview-method-label">
                Interview Method *
              </InputLabel>
              <Select
                labelId="interview-method-label"
                value={newInterview.InterviewMethod || ""}
                label="Interview Method *"
                onChange={(e) =>
                  handleInputChange("InterviewMethod", e.target.value)
                }
                disabled={isSubmitting || loading}
              >
                {interviewdropdowns.interviewMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </Select>
              {errors.InterviewMethod && (
                <FormHelperText>Interview Method is required</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="interview-outcome-label">
                Interview Outcome
              </InputLabel>
              <Select
                labelId="interview-outcome-label"
                value={newInterview.InterviewOutcome || ""}
                label="Interview Outcome"
                onChange={(e) =>
                  handleInputChange("InterviewOutcome", e.target.value)
                }
                disabled={isSubmitting || loading}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="Next">Next</MenuItem>
                <MenuItem value="Offer">Offer</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
            <TextField
              label="Comments"
              value={newInterview.Comments || ""}
              onChange={(e) => handleInputChange("Comments", e.target.value)}
              fullWidth
              multiline
              rows={3}
              disabled={isSubmitting || loading}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={isSubmitting || loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleEditSubmit}
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
