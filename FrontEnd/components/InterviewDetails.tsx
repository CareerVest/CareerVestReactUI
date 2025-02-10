import type React from "react"
import { Paper, Typography, Grid } from "@mui/material"
import type { Client, Interview } from "../types"

interface InterviewDetailsProps {
  interview: Interview | null
  client: Client | null
}

const InterviewDetails: React.FC<InterviewDetailsProps> = ({ interview, client }) => {
  if (!interview && !client) {
    return (
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Interview Details
        </Typography>
        <Typography>Select an interview or client to view details</Typography>
      </Paper>
    )
  }

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {interview ? "Interview Details" : "Client Details"}
      </Typography>
      <Grid container spacing={2}>
        {interview && (
          <>
            <Grid item xs={6}>
              <Typography variant="body2">Client:</Typography>
              <Typography variant="body1">{interview.clientName}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Company:</Typography>
              <Typography variant="body1">{interview.company}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Date:</Typography>
              <Typography variant="body1">{new Date(interview.date).toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Stage:</Typography>
              <Typography variant="body1">{interview.stage}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">Notes:</Typography>
              <Typography variant="body1">{interview.notes}</Typography>
            </Grid>
          </>
        )}
        {client && !interview && (
          <>
            <Grid item xs={6}>
              <Typography variant="body2">Name:</Typography>
              <Typography variant="body1">{client.name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Tech Stack:</Typography>
              <Typography variant="body1">{client.techStack}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Status:</Typography>
              <Typography variant="body1">{client.status}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Last Activity:</Typography>
              <Typography variant="body1">{new Date(client.lastActivityDate).toLocaleDateString()}</Typography>
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  )
}

export default InterviewDetails

