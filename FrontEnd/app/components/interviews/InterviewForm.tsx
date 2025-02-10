"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Box, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import { createInterview, updateInterview } from "@/app/actions/interviewActions"
import type { Interview, InterviewFormData } from "@/app/types/interview"

interface InterviewFormProps {
  initialData?: Interview
  interviewId?: number
}

export default function InterviewForm({ initialData, interviewId }: InterviewFormProps) {
  const [formData, setFormData] = useState<InterviewFormData>(
    initialData || {
      InterviewEntryDate: null,
      RecruiterID: null,
      Technology: null,
      InterviewDate: null,
      InterviewStartTime: null,
      InterviewMethod: null,
      ClientID: null,
      InterviewType: null,
      InterviewStatus: null,
      InterviewSupport: null,
      InterviewFeedback: null,
      Comments: null,
      EndClientName: null,
      InterviewEndTime: null,
    },
  )
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name as string]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      if (interviewId) {
        await updateInterview(interviewId, formData)
      } else {
        await createInterview(formData)
      }
      router.push("/interviews")
      router.refresh()
    } catch (error) {
      console.error("Failed to save interview:", error)
      alert("Failed to save interview. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="InterviewEntryDate"
            name="InterviewEntryDate"
            label="Interview Entry Date"
            type="date"
            value={formData.InterviewEntryDate || ""}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="RecruiterID"
            name="RecruiterID"
            label="Recruiter ID"
            type="number"
            value={formData.RecruiterID || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="Technology"
            name="Technology"
            label="Technology"
            value={formData.Technology || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="InterviewDate"
            name="InterviewDate"
            label="Interview Date"
            type="date"
            value={formData.InterviewDate || ""}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="InterviewStartTime"
            name="InterviewStartTime"
            label="Interview Start Time"
            type="time"
            value={formData.InterviewStartTime || ""}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="interview-method-label">Interview Method</InputLabel>
            <Select
              labelId="interview-method-label"
              id="InterviewMethod"
              name="InterviewMethod"
              value={formData.InterviewMethod || ""}
              onChange={handleChange}
              label="Interview Method"
            >
              <MenuItem value="Video Call">Video Call</MenuItem>
              <MenuItem value="Phone">Phone</MenuItem>
              <MenuItem value="In-person">In-person</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="ClientID"
            name="ClientID"
            label="Client ID"
            type="number"
            value={formData.ClientID || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="interview-type-label">Interview Type</InputLabel>
            <Select
              labelId="interview-type-label"
              id="InterviewType"
              name="InterviewType"
              value={formData.InterviewType || ""}
              onChange={handleChange}
              label="Interview Type"
            >
              <MenuItem value="Technical">Technical</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Behavioral">Behavioral</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="interview-status-label">Interview Status</InputLabel>
            <Select
              labelId="interview-status-label"
              id="InterviewStatus"
              name="InterviewStatus"
              value={formData.InterviewStatus || ""}
              onChange={handleChange}
              label="Interview Status"
            >
              <MenuItem value="Scheduled">Scheduled</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="interview-support-label">Interview Support</InputLabel>
            <Select
              labelId="interview-support-label"
              id="InterviewSupport"
              name="InterviewSupport"
              value={formData.InterviewSupport || ""}
              onChange={handleChange}
              label="Interview Support"
            >
              <MenuItem value="None required">None required</MenuItem>
              <MenuItem value="Technical Support">Technical Support</MenuItem>
              <MenuItem value="Language Support">Language Support</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="interview-feedback-label">Interview Feedback</InputLabel>
            <Select
              labelId="interview-feedback-label"
              id="InterviewFeedback"
              name="InterviewFeedback"
              value={formData.InterviewFeedback || ""}
              onChange={handleChange}
              label="Interview Feedback"
            >
              <MenuItem value="Excellent">Excellent</MenuItem>
              <MenuItem value="Good">Good</MenuItem>
              <MenuItem value="Average">Average</MenuItem>
              <MenuItem value="Below Average">Below Average</MenuItem>
              <MenuItem value="Poor">Poor</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="Comments"
            name="Comments"
            label="Comments"
            value={formData.Comments || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="EndClientName"
            name="EndClientName"
            label="End Client Name"
            value={formData.EndClientName || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="InterviewEndTime"
            name="InterviewEndTime"
            label="Interview End Time"
            type="time"
            value={formData.InterviewEndTime || ""}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
        {isLoading ? "Saving..." : interviewId ? "Update Interview" : "Create Interview"}
      </Button>
    </Box>
  )
}

