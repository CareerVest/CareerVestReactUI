"use client";

import { useState } from "react";
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
  Stepper,
  Step,
  StepLabel,
  FormHelperText,
} from "@mui/material";
import { Close, Check, Cancel, ThumbUp, Add } from "@mui/icons-material";
import type {
  Interview,
  InterviewChain,
} from "@/app/types/interviewChain/interviewChain";

interface EndInterviewDialogProps {
  chain: InterviewChain;
  open: boolean;
  onClose: () => void;
  onSubmit: (
    outcome: "Next" | "Rejected" | "Offer" | "AddNew",
    newInterview?: Partial<Interview> & {
      clientName?: string;
      position?: string;
    }
  ) => void;
}

export default function EndInterviewDialog({
  chain,
  open,
  onClose,
  onSubmit,
}: EndInterviewDialogProps) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [newInterview, setNewInterview] = useState<
    Partial<Interview> & { clientName?: string; position?: string }
  >({
    type: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    location: "",
    interviewer: "",
    clientName: chain.clientName || "",
    position: chain.position || "",
  });
  const [errors, setErrors] = useState({
    type: false,
    date: false,
    clientName: false,
    position: false,
  });

  const handleInputChange = (
    field: keyof (Partial<Interview> & {
      clientName?: string;
      position?: string;
    }),
    value: string
  ) => {
    setNewInterview((prev) => ({ ...prev, [field]: value }));

    if (
      field === "type" ||
      field === "date" ||
      field === "clientName" ||
      field === "position"
    ) {
      setErrors((prev) => ({ ...prev, [field]: value === "" }));
    }
  };

  const handleSubmit = (
    selectedOutcome: "Next" | "Rejected" | "Offer" | "AddNew" = "Next"
  ) => {
    const typeError = newInterview.type === "";
    const dateError = !newInterview.date;
    const clientNameError = newInterview.clientName === "";
    const positionError = newInterview.position === "";

    if (
      selectedOutcome === "AddNew" &&
      (typeError || dateError || clientNameError || positionError)
    ) {
      setErrors({
        type: typeError,
        date: dateError,
        clientName: clientNameError,
        position: positionError,
      });
      return;
    } else if (selectedOutcome !== "AddNew" && (typeError || dateError)) {
      setErrors({
        type: typeError,
        date: dateError,
        clientName: false,
        position: false,
      });
      return;
    }

    onSubmit(selectedOutcome, newInterview);
    onClose();
  };

  const handleBack = () => {
    setActiveStep(0);
  };

  const latestInterview = chain.interviews[chain.interviews.length - 1] || {
    type: "",
    date: "",
    status: "Scheduled",
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            {chain.interviews.length > 0
              ? "End Interview"
              : "Add New Interview"}
          </Typography>
          <IconButton edge="end" onClick={onClose} aria-label="close">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            {chain.clientName} - {chain.position}
          </Typography>
          {chain.interviews.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              Ending {latestInterview.type} interview scheduled for{" "}
              {new Date(latestInterview.date).toLocaleDateString()}
            </Typography>
          )}
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          <Step>
            <StepLabel>Interview Action</StepLabel>
          </Step>
          <Step>
            <StepLabel>Details</StepLabel>
          </Step>
        </Stepper>

        {activeStep === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {chain.interviews.length > 0
                ? "What was the outcome of this interview?"
                : "Select an action"}
            </Typography>

            {chain.interviews.length > 0 ? (
              <>
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<Check />}
                  onClick={() => {
                    setActiveStep(1);
                  }}
                  fullWidth
                  sx={{ justifyContent: "flex-start", py: 1.5 }}
                >
                  Proceed to Next Round
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ThumbUp />}
                  onClick={() => handleSubmit("Offer")}
                  fullWidth
                  sx={{ justifyContent: "flex-start", py: 1.5 }}
                >
                  Extend Offer
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => handleSubmit("Rejected")}
                  fullWidth
                  sx={{ justifyContent: "flex-start", py: 1.5 }}
                >
                  Reject Candidate
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => {
                  setActiveStep(1);
                }}
                fullWidth
                sx={{ justifyContent: "flex-start", py: 1.5 }}
              >
                Add New Interview
              </Button>
            )}
          </Box>
        )}

        {activeStep === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {chain.interviews.length > 0
                ? "Schedule the next interview"
                : "Enter interview details"}
            </Typography>

            <FormControl fullWidth error={errors.clientName}>
              <InputLabel id="client-name-label">Client Name *</InputLabel>
              <TextField
                label="Client Name *"
                id="client-name-label" // Matches InputLabel's htmlFor
                value={newInterview.clientName || ""}
                onChange={(e) =>
                  handleInputChange("clientName", e.target.value)
                }
                error={errors.clientName}
                helperText={errors.clientName && "Client name is required"}
              />
            </FormControl>

            <FormControl fullWidth error={errors.position}>
              <InputLabel id="position-label">Position *</InputLabel>
              <TextField
                label="Position *"
                id="position-label" // Matches InputLabel's htmlFor
                value={newInterview.position || ""}
                onChange={(e) => handleInputChange("position", e.target.value)}
                error={errors.position}
                helperText={errors.position && "Position is required"}
              />
            </FormControl>

            <FormControl fullWidth error={errors.type}>
              <InputLabel id="interview-type-label">
                Interview Type *
              </InputLabel>
              <Select
                labelId="interview-type-label"
                value={newInterview.type}
                label="Interview Type *"
                onChange={(e) => handleInputChange("type", e.target.value)}
              >
                <MenuItem value="Technical">Technical</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Culture Fit">Culture Fit</MenuItem>
                <MenuItem value="System Design">System Design</MenuItem>
                <MenuItem value="Behavioral">Behavioral</MenuItem>
                <MenuItem value="Case Study">Case Study</MenuItem>
                <MenuItem value="Final">Final</MenuItem>
                <MenuItem value="Team Meeting">Team Meeting</MenuItem>
              </Select>
              {errors.type && (
                <FormHelperText>Interview type is required</FormHelperText>
              )}
            </FormControl>

            <TextField
              label="Interview Date *"
              type="date"
              value={newInterview.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              fullWidth
              error={errors.date}
              helperText={errors.date && "Date is required"}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Interviewer"
              value={newInterview.interviewer || ""}
              onChange={(e) => handleInputChange("interviewer", e.target.value)}
              fullWidth
            />

            <TextField
              label="Location"
              value={newInterview.location || ""}
              onChange={(e) => handleInputChange("location", e.target.value)}
              fullWidth
            />

            <TextField
              label="Notes"
              value={newInterview.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {activeStep === 0 ? (
          <Button onClick={onClose}>Cancel</Button>
        ) : (
          <>
            <Button onClick={handleBack}>Back</Button>
            <Button
              variant="contained"
              onClick={() =>
                handleSubmit(chain.interviews.length > 0 ? "Next" : "AddNew")
              }
            >
              {chain.interviews.length > 0
                ? "Schedule Next Interview"
                : "Add Interview"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
