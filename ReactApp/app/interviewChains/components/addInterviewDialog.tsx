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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from "@mui/material";
import { Close, ExpandMore } from "@mui/icons-material";
import type {
  Interview,
  InterviewChain,
} from "@/app/types/interviewChain/interviewChain";
import { useInterviewForm } from "./hooks/useInterviewForm";
import interviewdropdowns from "../../utils/interviewDropdowns.json";

// Props interface already includes selectedInterview and isSubmitting
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
  } = useInterviewForm(chain, false, undefined);

  const [isFormInitialized, setIsFormInitialized] = useState(false);

  useEffect(() => {
    if (open && !isFormInitialized) {
      if (chain.interviews.length > 0) {
        // Use the selected interview if available, otherwise use the latest interview
        const interviewToUse =
          selectedInterview || chain.interviews[chain.interviews.length - 1];
        handleInputChange("RecruiterID", interviewToUse.RecruiterID || null);

        // Set the ParentInterviewChainID to the selected interview's ID
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
      handleInputChange("ChainStatus", chain.status || "Active");
      handleInputChange("InterviewStatus", "Scheduled"); // Always "Scheduled"
      handleInputChange("InterviewOutcome", "");
      handleInputChange("InterviewDate", "");
      handleInputChange("InterviewStartTime", "");
      handleInputChange("InterviewEndTime", "");
      handleInputChange("InterviewType", ""); // Initialize InterviewType
      handleInputChange("InterviewMethod", "");
      handleInputChange("Comments", "");
      setIsFormInitialized(true);
    }
    if (!open) {
      setIsFormInitialized(false);
    }
  }, [open, chain, handleInputChange, isFormInitialized, selectedInterview]);

  const handleAddSubmit = () => {
    // Prevent submission if already submitting
    if (isSubmitting || loading) return;

    validateAndSubmit("AddNew", (chainId, outcome, newInterview) => {
      // Use the selected interview ID if available
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
          <Typography variant="h6">Add New Interview</Typography>
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
            <Typography color="white">
              {isSubmitting ? "Submitting..." : "Loading..."}
            </Typography>
          </Box>
        )}

        {/* Form content */}
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
                disabled={isSubmitting || loading}
              >
                <MenuItem value="">Select Type</MenuItem>
                {interviewdropdowns?.interviewTypes?.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.InterviewType && (
                <FormHelperText>Interview Type is required</FormHelperText>
              )}
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Interview Date *"
              type="date"
              value={
                newInterview.InterviewDate
                  ? typeof newInterview.InterviewDate === "string"
                    ? (newInterview.InterviewDate as string).split("T")[0]
                    : new Date(newInterview.InterviewDate)
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
                <MenuItem value="">Select Method</MenuItem>
                {interviewdropdowns?.interviewMethods?.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </Select>
              {errors.InterviewMethod && (
                <FormHelperText>Interview Method is required</FormHelperText>
              )}
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
          onClick={handleAddSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? "Submitting..." : "Add Interview"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
