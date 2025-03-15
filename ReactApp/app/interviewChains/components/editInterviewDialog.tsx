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
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import type {
  Interview,
  InterviewChain,
} from "@/app/types/interviewChain/interviewChain";
import { useInterviewForm } from "./hooks/useInterviewForm";
import interviewdropdowns from "../../utils/interviewDropdowns.json";

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

// Helper function to convert 12-hour AM/PM time to 24-hour format with timezone adjustment
const convert12HourTo24HourLocal = (
  time: string | null | undefined
): string => {
  if (!time || typeof time !== "string" || time.trim() === "") return "";
  const [timePart, period] = time.split(" ");
  if (!timePart || !period) return time || "";
  const [hoursStr, minutesStr] = timePart.split(":");
  let hours = Number(hoursStr);
  let minutes = Number(minutesStr);

  if (isNaN(hours) || isNaN(minutes)) return time || "";

  const periodUpper = period.toUpperCase();
  if (periodUpper === "PM" && hours !== 12) {
    hours += 12;
  } else if (periodUpper === "AM" && hours === 12) {
    hours = 0;
  }

  const date = new Date();
  date.setHours(hours, minutes);
  const localHours = date.getHours();
  const localMinutes = date.getMinutes();
  return `${localHours.toString().padStart(2, "0")}:${localMinutes
    .toString()
    .padStart(2, "0")}`;
};

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
    setNewInterview,
    errors,
    loading,
    handleInputChange,
    validateAndSubmit,
  } = useInterviewForm(chain, true, interviewToEdit);

  const [isFormInitialized, setIsFormInitialized] = useState(false);

  useEffect(() => {
    if (open && !isFormInitialized && interviewToEdit) {
      console.log(
        "EditInterviewDialog: Initializing with interviewToEdit:",
        interviewToEdit
      );

      setNewInterview({
        InterviewChainID: interviewToEdit.InterviewChainID,
        ParentInterviewChainID: interviewToEdit.ParentInterviewChainID ?? null,
        EndClientName:
          interviewToEdit.EndClientName || chain.endClientName || "",
        Position: interviewToEdit.Position || chain.position || "",
        ChainStatus: interviewToEdit.ChainStatus || chain.status || "Active",
        InterviewDate: interviewToEdit.InterviewDate
          ? new Date(interviewToEdit.InterviewDate)
          : null,
        InterviewStartTime: convert12HourTo24HourLocal(
          interviewToEdit.InterviewStartTime
        ),
        InterviewEndTime: convert12HourTo24HourLocal(
          interviewToEdit.InterviewEndTime
        ),
        InterviewMethod: interviewToEdit.InterviewMethod || "",
        InterviewType: interviewToEdit.InterviewType || "",
        InterviewStatus: interviewToEdit.InterviewStatus || "Scheduled", // Default to "Scheduled"
        InterviewOutcome: interviewToEdit.InterviewOutcome || "",
        InterviewSupport: interviewToEdit.InterviewSupport || "",
        Comments: interviewToEdit.Comments || "",
        RecruiterID: interviewToEdit.RecruiterID || null,
        ClientID: null,
        clientName: chain.clientName || "",
        position: chain.position || "",
        recruiterName: chain.recruiterName || "",
      });
      console.log(
        "EditInterviewDialog: State after setNewInterview:",
        newInterview
      );
      setIsFormInitialized(true);
    }
    if (!open) {
      setIsFormInitialized(false);
    }
  }, [open, interviewToEdit, chain, setNewInterview, isFormInitialized]);

  const handleEditSubmit = () => {
    if (isSubmitting || loading) return;

    validateAndSubmit("Edit", (chainId, outcome, newInterview) => {
      onSubmit(chainId, "Edit", newInterview);
    });
  };

  // Filter out "Completed" from interviewStatuses
  const filteredInterviewStatuses = interviewdropdowns.interviewStatuses.filter(
    (status) => status !== "Completed"
  );

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
          <Typography variant="h6">Edit Interview</Typography>
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
          <Typography variant="body2" color="text.secondary">
            Editing {interviewToEdit.Position || interviewToEdit.InterviewType}{" "}
            interview scheduled for{" "}
            {interviewToEdit.InterviewDate
              ? new Date(interviewToEdit.InterviewDate).toLocaleDateString()
              : "N/A"}
          </Typography>
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
              value={newInterview.Position || ""}
              onChange={(e) => handleInputChange("Position", e.target.value)}
              fullWidth
              size="small"
              disabled={isSubmitting || loading}
            />
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
              size="small"
              error={errors.InterviewDate}
              helperText={errors.InterviewDate && "Date is required"}
              InputLabelProps={{ shrink: true }}
              disabled={isSubmitting || loading}
            />
            <TextField
              label="Start Time"
              type="time"
              value={newInterview.InterviewStartTime || ""}
              onChange={(e) =>
                handleInputChange("InterviewStartTime", e.target.value)
              }
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              disabled={isSubmitting || loading}
            />
            <FormControl fullWidth>
              <InputLabel id="interview-type-label">Interview Type</InputLabel>
              <Select
                labelId="interview-type-label"
                value={newInterview.InterviewType || ""}
                label="Interview Type"
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
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="interview-status-label">
                Interview Status
              </InputLabel>
              <Select
                labelId="interview-status-label"
                value={newInterview.InterviewStatus || "Scheduled"}
                label="Interview Status"
                onChange={(e) =>
                  handleInputChange("InterviewStatus", e.target.value)
                }
                size="small"
                disabled={isSubmitting || loading}
              >
                <MenuItem value="">Select Status</MenuItem>
                {filteredInterviewStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
              label="End Time"
              type="time"
              value={newInterview.InterviewEndTime || ""}
              onChange={(e) =>
                handleInputChange("InterviewEndTime", e.target.value)
              }
              fullWidth
              size="small"
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
                size="small"
                disabled={isSubmitting || loading}
              >
                <MenuItem value="">Select Outcome</MenuItem>
                {interviewdropdowns.interviewOutcomes.map((outcome) => (
                  <MenuItem key={outcome} value={outcome}>
                    {outcome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
          variant="contained"
          onClick={handleEditSubmit}
          disabled={isSubmitting || loading}
          startIcon={
            isSubmitting || loading ? <CircularProgress size={20} /> : null
          }
        >
          {isSubmitting || loading ? "Saving Changes" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
