"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  FormHelperText,
  Grid,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import type {
  Interview,
  InterviewChain,
} from "@/app/types/interviewChain/interviewChain";
import { useInterviewForm } from "./hooks/useInterviewForm";
import interviewdropdowns from "../../utils/interviewDropdowns.json";

interface AddInterviewDialogProps {
  chain: InterviewChain;
  open: boolean;
  onClose: () => void;
  onSubmit: (
    chainId: string,
    outcome: "AddNew",
    newInterview?: Partial<Interview> & {
      clientName?: string;
      position?: string;
      recruiterName?: string;
    }
  ) => void;
  selectedInterview?: Interview;
  isSubmitting?: boolean;
}

export default function AddInterviewDialog({
  chain,
  open,
  onClose,
  onSubmit,
  selectedInterview,
  isSubmitting = false,
}: AddInterviewDialogProps) {
  const theme = useTheme();
  const {
    newInterview,
    errors,
    recruiters,
    clients,
    loading,
    handleInputChange,
    validateAndSubmit,
  } = useInterviewForm(chain, false, undefined, selectedInterview);

  const [isFormInitialized, setIsFormInitialized] = useState(false);

  useEffect(() => {
    if (open && !isFormInitialized) {
      if (chain.interviews.length > 0) {
        const interviewToUse =
          selectedInterview || chain.interviews[chain.interviews.length - 1];
        handleInputChange("RecruiterID", interviewToUse.RecruiterID || null);

        if (selectedInterview) {
          console.log(
            "Setting ParentInterviewChainID to:",
            selectedInterview.InterviewChainID
          );
          handleInputChange(
            "ParentInterviewChainID",
            selectedInterview.InterviewChainID
          );
        }
      }
      handleInputChange("clientName", chain.clientName || "");
      handleInputChange("position", chain.position || "");
      handleInputChange("recruiterName", chain.recruiterName || "");
      handleInputChange("EndClientName", chain.endClientName || "");
      handleInputChange("ChainStatus", chain.status || "Active");
      handleInputChange("InterviewStatus", "Scheduled"); // Prefilled
      handleInputChange("InterviewOutcome", ""); // Empty
      handleInputChange("InterviewDate", "");
      handleInputChange("InterviewStartTime", "");
      handleInputChange("InterviewEndTime", "");
      handleInputChange("InterviewType", "");
      handleInputChange("InterviewMethod", "");
      handleInputChange("InterviewSupport", "");
      handleInputChange("Comments", "");
      setIsFormInitialized(true);
    }
    if (!open) {
      setIsFormInitialized(false);
    }
  }, [open, chain, handleInputChange, isFormInitialized, selectedInterview]);

  const handleAddSubmit = () => {
    if (isSubmitting || loading) return;

    validateAndSubmit("AddNew", (chainId, outcome, newInterview) => {
      const targetId = selectedInterview?.InterviewChainID
        ? selectedInterview.InterviewChainID.toString()
        : chainId;
      console.log("Submitting new interview with parent ID:", targetId);
      onSubmit(targetId, "AddNew", newInterview);
    });
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
          <Typography variant="h6">Add New Interview</Typography>
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
      <DialogContent sx={{ maxHeight: "60vh", overflowY: "auto", padding: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            {chain.clientName} - {chain.position}
          </Typography>
          {selectedInterview && (
            <Typography variant="body2" color="text.secondary">
              Adding new interview after{" "}
              {selectedInterview.InterviewType || "previous"} interview
              {selectedInterview.InterviewDate
                ? ` scheduled on ${new Date(
                    selectedInterview.InterviewDate
                  ).toLocaleDateString()}`
                : ""}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
          {/* Left Column */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <TextField
              label="Recruiter Name"
              value={newInterview.recruiterName || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: "#f5f5f5", color: "#666" }}
              disabled
            />
            <TextField
              label="Position"
              value={newInterview.position || ""}
              onChange={(e) => handleInputChange("position", e.target.value)}
              fullWidth
              size="small"
              disabled={isSubmitting || loading}
            />
            <TextField
              label="Interview Date *"
              type="date"
              value={newInterview.InterviewDate || ""}
              onChange={(e) =>
                handleInputChange("InterviewDate", e.target.value)
              }
              fullWidth
              size="small"
              error={errors.InterviewDate}
              helperText={errors.InterviewDate && "Date is required"}
              InputLabelProps={{ shrink: true }}
              disabled={isSubmitting || loading}
            />
            <TextField
              label="Start Time *"
              type="time"
              value={newInterview.InterviewStartTime || ""}
              onChange={(e) =>
                handleInputChange("InterviewStartTime", e.target.value)
              }
              fullWidth
              size="small"
              error={errors.InterviewStartTime}
              helperText={errors.InterviewStartTime && "Start time is required"}
              InputLabelProps={{ shrink: true }}
              disabled={isSubmitting || loading}
            />
            <FormControl fullWidth error={errors.InterviewType}>
              <InputLabel id="interview-type-label">
                Interview Type *
              </InputLabel>
              <Select
                labelId="interview-type-label"
                value={newInterview.InterviewType || ""}
                label="Interview Type *"
                onChange={(e) =>
                  handleInputChange("InterviewType", e.target.value)
                }
                size="small"
                disabled={isSubmitting || loading}
              >
                <MenuItem value="">Select Type</MenuItem>
                {interviewdropdowns.interviewTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.InterviewType && (
                <FormHelperText>Interview Type is required</FormHelperText>
              )}
            </FormControl>
            <TextField
              label="Interview Status"
              value={newInterview.InterviewStatus || "Scheduled"}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: "#f5f5f5", color: "#666" }}
              disabled
            />
          </Box>

          {/* Right Column */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <TextField
              label="Client Name"
              value={newInterview.clientName || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: "#f5f5f5", color: "#666" }}
              disabled
            />
            <TextField
              label="End Client Name"
              value={newInterview.EndClientName || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: "#f5f5f5", color: "#666" }}
              disabled
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
                size="small"
                disabled={isSubmitting || loading}
              >
                <MenuItem value="">Select Method</MenuItem>
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
            <TextField
              label="End Time *"
              type="time"
              value={newInterview.InterviewEndTime || ""}
              onChange={(e) =>
                handleInputChange("InterviewEndTime", e.target.value)
              }
              fullWidth
              size="small"
              error={errors.InterviewEndTime}
              helperText={errors.InterviewEndTime && "End time is required"}
              InputLabelProps={{ shrink: true }}
              disabled={isSubmitting || loading}
            />
            <FormControl fullWidth>
              <InputLabel id="interview-support-label">Support</InputLabel>
              <Select
                labelId="interview-support-label"
                value={newInterview.InterviewSupport || ""}
                label="Support"
                onChange={(e) =>
                  handleInputChange("InterviewSupport", e.target.value)
                }
                size="small"
                disabled={isSubmitting || loading}
              >
                <MenuItem value="">Select Support</MenuItem>
                {interviewdropdowns.interviewSupports.map((support) => (
                  <MenuItem key={support} value={support}>
                    {support}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Interview Outcome"
              value={newInterview.InterviewOutcome || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: "#f5f5f5", color: "#666" }}
              disabled
            />
          </Box>

          {/* Full Width Comments */}
          <Box sx={{ gridColumn: "1 / -1", mt: 1 }}>
            <TextField
              label="Comments"
              value={newInterview.Comments || ""}
              onChange={(e) => handleInputChange("Comments", e.target.value)}
              fullWidth
              size="small"
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
          onClick={handleAddSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting || loading}
          startIcon={
            (isSubmitting || loading) && <CircularProgress size={20} />
          }
        >
          {isSubmitting || loading ? "Adding Interview" : "Add Interview"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
