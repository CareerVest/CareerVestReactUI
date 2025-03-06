"use client";

import { useState, useEffect } from "react";
import { Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import type { MarketingInterview } from "@/app/types/MarketingActivity/Marketing";
import { fetchRecruiters, fetchClients } from "../actions/MarketingActivityActions";
import type { MarketingClient, MarketingRecruiter } from "@/app/types/MarketingActivity/Marketing";

interface InterviewSidebarProps {
  interview: MarketingInterview | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (interview: MarketingInterview) => void;
  onAdd: (interview: MarketingInterview) => void;
}

export function InterviewSidebar({ interview, isOpen, onClose, onUpdate, onAdd }: InterviewSidebarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedInterview, setEditedInterview] = useState<MarketingInterview | null>(null);
  const [recruiters, setRecruiters] = useState<MarketingRecruiter[]>([]);
  const [clients, setClients] = useState<MarketingClient[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [recruiterData, clientData] = await Promise.all([fetchRecruiters(), fetchClients()]);
        setRecruiters(recruiterData || []);
        setClients(clientData || []);
      } catch (error) {
        console.error("Error loading recruiters or clients:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (interview) {
      setEditedInterview(interview);
      setIsEditing(false);
    } else {
      setEditedInterview({
        id: "",
        clientId: "",
        clientName: "",
        type: "Screening",
        tech: "",
        status: "scheduled",
        time: "",
        date: new Date().toISOString().split("T")[0],
        entryDate: new Date().toISOString().split("T")[0],
        company: "",
        notes: "",
        feedback: "",
      });
      setIsEditing(true);
    }
  }, [interview]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedInterview(interview);
  };

  const handleChange = (field: keyof MarketingInterview, value: string) => {
    setEditedInterview((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedInterview) {
      if (interview) {
        onUpdate(editedInterview);
      } else {
        onAdd(editedInterview);
      }
      setIsEditing(false);
      onClose(); // Close the sidebar after submission, consistent with parent behavior
    }
  };

  if (!editedInterview) return null;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="client-label">Client</InputLabel>
            <Select
              labelId="client-label"
              id="clientId"
              value={editedInterview.clientId}
              label="Client"
              onChange={(e) => handleChange("clientId", e.target.value)}
              disabled={!isEditing}
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="company"
            label="Company"
            value={editedInterview.company}
            onChange={(e) => handleChange("company", e.target.value)}
            disabled={!isEditing}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="type-label">Interview Type</InputLabel>
            <Select
              labelId="type-label"
              id="type"
              value={editedInterview.type}
              label="Interview Type"
              onChange={(e) => handleChange("type", e.target.value)}
              disabled={!isEditing}
            >
              <MenuItem value="Screening">Screening</MenuItem>
              <MenuItem value="Technical">Technical</MenuItem>
              <MenuItem value="Final Round">Final Round</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              value={editedInterview.status}
              label="Status"
              onChange={(e) => handleChange("status", e.target.value)}
              disabled={!isEditing}
            >
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="tech"
            label="Technology/Role"
            value={editedInterview.tech}
            onChange={(e) => handleChange("tech", e.target.value)}
            disabled={!isEditing}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="date"
            label="Date"
            type="date"
            value={editedInterview.date}
            onChange={(e) => handleChange("date", e.target.value)}
            disabled={!isEditing}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="time"
            label="Time"
            value={editedInterview.time}
            onChange={(e) => handleChange("time", e.target.value)}
            disabled={!isEditing}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="notes"
            label="Notes"
            multiline
            rows={4}
            value={editedInterview.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            disabled={!isEditing}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="feedback"
            label="Feedback"
            multiline
            rows={4}
            value={editedInterview.feedback || ""}
            onChange={(e) => handleChange("feedback", e.target.value)}
            disabled={!isEditing}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            {isEditing ? (
              <>
                <Button
                  variant="outlined"
                  onClick={handleCancelEdit}
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
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: "#FDC500",
                    color: "#682A53",
                    "&:hover": {
                      bgcolor: "#682A53",
                      color: "white",
                    },
                  }}
                >
                  {interview ? "Save Changes" : "Add Interview"}
                </Button>
              </>
            ) : (
              <Button
                onClick={handleEditClick}
                variant="contained"
                sx={{
                  bgcolor: "#FDC500",
                  color: "#682A53",
                  "&:hover": {
                    bgcolor: "#682A53",
                    color: "white",
                  },
                }}
              >
                Edit Interview
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}