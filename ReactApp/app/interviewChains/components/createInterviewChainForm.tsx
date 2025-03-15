"use client";

import { useState, useEffect } from "react";
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
import interviewdropdowns from "../../utils/interviewDropdowns.json";
import { useInterviewForm } from "./hooks/useInterviewForm";

interface CreateInterviewChainFormProps {
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
  isSubmitting?: boolean;
}

export default function CreateInterviewChainForm({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
}: CreateInterviewChainFormProps) {
  const theme = useTheme();
  const dummyChain: InterviewChain = {
    id: "new",
    endClientName: "",
    clientName: "",
    recruiterName: "",
    position: "",
    status: "Active",
    interviews: [],
    rounds: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    latestInterview: null,
    latestInterviewDate: null,
    latestInterviewStatus: null,
    latestInterviewType: null,
  };

  const {
    newInterview,
    errors,
    recruiters,
    clients,
    loading,
    handleInputChange,
    handleAutocompleteChange,
    validateAndSubmit,
  } = useInterviewForm(dummyChain, false, undefined);

  const [isFormInitialized, setIsFormInitialized] = useState(false);

  useEffect(() => {
    if (open && !isFormInitialized) {
      handleInputChange("clientName", "");
      handleInputChange("recruiterName", "");
      handleInputChange("position", "");
      handleInputChange("ChainStatus", "Active");
      handleInputChange("InterviewStatus", "Scheduled"); // Prefilled
      handleInputChange("InterviewOutcome", ""); // Empty
      handleInputChange("RecruiterID", null);
      handleInputChange("ClientID", null);
      handleInputChange("EndClientName", "");
      handleInputChange("InterviewDate", "");
      handleInputChange("InterviewStartTime", "");
      handleInputChange("InterviewEndTime", "");
      handleInputChange("InterviewMethod", "");
      handleInputChange("InterviewType", "");
      handleInputChange("InterviewSupport", "");
      handleInputChange("Comments", "");
      setIsFormInitialized(true);
    }
    if (!open) {
      setIsFormInitialized(false);
    }
  }, [open, isFormInitialized, handleInputChange]);

  const handleCreateSubmit = () => {
    if (isSubmitting || loading) return;

    validateAndSubmit("AddNew", (chainId, outcome, newInterview) => {
      onSubmit(chainId, "AddNew", newInterview);
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
          <Typography variant="h6">Create New Interview Chain</Typography>
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
            New Interview Chain
          </Typography>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
          {/* Left Column */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <FormControl fullWidth error={errors.RecruiterID}>
              <InputLabel id="recruiter-label">Recruiter Name *</InputLabel>
              <Select
                labelId="recruiter-label"
                value={newInterview.RecruiterID || ""}
                label="Recruiter Name *"
                onChange={(e) =>
                  handleAutocompleteChange("RecruiterID", e.target.value)
                }
                size="small"
                disabled={isSubmitting || loading}
              >
                <MenuItem value="">Select Recruiter</MenuItem>
                {recruiters.map((recruiter) => (
                  <MenuItem
                    key={recruiter.employeeID}
                    value={recruiter.employeeID}
                  >
                    {`${recruiter.firstName} ${recruiter.lastName}`}
                  </MenuItem>
                ))}
              </Select>
              {errors.RecruiterID && (
                <FormHelperText>Recruiter is required</FormHelperText>
              )}
            </FormControl>
            <TextField
              label="Position *"
              value={newInterview.position || ""}
              onChange={(e) => handleInputChange("position", e.target.value)}
              fullWidth
              size="small"
              error={errors.position}
              helperText={errors.position && "Position is required"}
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
            <FormControl fullWidth error={errors.ClientID}>
              <InputLabel id="client-label">Client Name *</InputLabel>
              <Select
                labelId="client-label"
                value={newInterview.ClientID || ""}
                label="Client Name *"
                onChange={(e) =>
                  handleAutocompleteChange("ClientID", e.target.value)
                }
                size="small"
                disabled={isSubmitting || loading}
              >
                <MenuItem value="">Select Client</MenuItem>
                {clients.map((client) => (
                  <MenuItem key={client.clientID} value={client.clientID}>
                    {client.clientName}
                  </MenuItem>
                ))}
              </Select>
              {errors.ClientID && (
                <FormHelperText>Client is required</FormHelperText>
              )}
            </FormControl>
            <TextField
              label="End Client Name *"
              value={newInterview.EndClientName || ""}
              onChange={(e) =>
                handleInputChange("EndClientName", e.target.value)
              }
              fullWidth
              size="small"
              error={errors.EndClientName}
              helperText={errors.EndClientName && "End Client Name is required"}
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
          variant="contained"
          onClick={handleCreateSubmit}
          disabled={isSubmitting || loading}
          startIcon={
            (isSubmitting || loading) && <CircularProgress size={20} />
          }
        >
          {isSubmitting || loading
            ? "Creating Interview Chain"
            : "Create Interview Chain"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
