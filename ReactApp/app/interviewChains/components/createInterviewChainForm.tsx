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
      handleInputChange("InterviewStatus", "Scheduled");
      handleInputChange("InterviewOutcome", "");
      handleInputChange("RecruiterID", null);
      handleInputChange("ClientID", null);
      handleInputChange("EndClientName", "");
      handleInputChange("InterviewDate", "");
      handleInputChange("InterviewStartTime", "");
      handleInputChange("InterviewEndTime", "");
      handleInputChange("InterviewMethod", "");
      handleInputChange("InterviewType", ""); // Initialize InterviewType
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
            <Typography color="white">Creating...</Typography>
          </Box>
        )}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            New Interview Chain
          </Typography>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
          <Box>
            <FormControl fullWidth error={errors.RecruiterID} sx={{ mb: 1 }}>
              <InputLabel id="recruiter-label">Recruiter *</InputLabel>
              <Select
                labelId="recruiter-label"
                value={newInterview.RecruiterID || ""}
                label="Recruiter *"
                onChange={(e) =>
                  handleAutocompleteChange("RecruiterID", e.target.value)
                }
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
            <FormControl fullWidth error={errors.ClientID} sx={{ mb: 1 }}>
              <InputLabel id="client-label">Client *</InputLabel>
              <Select
                labelId="client-label"
                value={newInterview.ClientID || ""}
                label="Client *"
                onChange={(e) =>
                  handleAutocompleteChange("ClientID", e.target.value)
                }
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
              label="Position *"
              value={newInterview.position || ""}
              onChange={(e) => handleInputChange("position", e.target.value)}
              fullWidth
              error={errors.position}
              helperText={errors.position && "Position is required"}
              sx={{ mb: 1 }}
              disabled={isSubmitting || loading}
            />
            <TextField
              label="End Client Name *"
              value={newInterview.EndClientName || ""}
              onChange={(e) =>
                handleInputChange("EndClientName", e.target.value)
              }
              fullWidth
              error={errors.EndClientName}
              helperText={errors.EndClientName && "End Client Name is required"}
              sx={{ mb: 1 }}
              disabled={isSubmitting || loading}
            />
            <FormControl fullWidth sx={{ mb: 1 }}>
              <InputLabel id="chain-status-label">Chain Status</InputLabel>
              <Select
                labelId="chain-status-label"
                value={newInterview.ChainStatus || "Active"}
                label="Chain Status"
                onChange={(e) =>
                  handleInputChange("ChainStatus", e.target.value)
                }
                disabled={isSubmitting || loading}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Successful">Successful</MenuItem>
                <MenuItem value="Unsuccessful">Unsuccessful</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              error={errors.interviewStatus}
              sx={{ mb: 1 }}
            >
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
          <Box>
            <TextField
              label="Interview Date *"
              type="date"
              value={
                newInterview.InterviewDate
                  ? (newInterview.InterviewDate as Date)
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
              sx={{ mb: 1 }}
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
              sx={{ mb: 1 }}
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
              sx={{ mb: 1 }}
              disabled={isSubmitting || loading}
            />
            <FormControl
              fullWidth
              error={errors.InterviewMethod}
              sx={{ mb: 1 }}
            >
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
            <FormControl fullWidth error={errors.InterviewType} sx={{ mb: 1 }}>
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
          onClick={handleCreateSubmit}
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? "Creating..." : "Create Interview Chain"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
