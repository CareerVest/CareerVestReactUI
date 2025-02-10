import type React from "react"
import { Paper, Typography, Grid } from "@mui/material"
import type { Client, Interview } from "../types"

interface RecruiterSummaryProps {
  clients: Client[]
  interviews: Interview[]
}

const RecruiterSummary: React.FC<RecruiterSummaryProps> = ({ clients, interviews }) => {
  const totalClients = clients.length
  const totalInterviews = interviews.length
  const todayInterviews = interviews.filter(
    (interview) => new Date(interview.date).toDateString() === new Date().toDateString(),
  ).length
  const newInterviews = interviews.filter(
    (interview) => new Date(interview.createdAt).toDateString() === new Date().toDateString(),
  ).length

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Recruiter Summary
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2">Total Clients:</Typography>
          <Typography variant="h6">{totalClients}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">Total Interviews:</Typography>
          <Typography variant="h6">{totalInterviews}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">Today's Interviews:</Typography>
          <Typography variant="h6">{todayInterviews}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">New Interviews:</Typography>
          <Typography variant="h6">{newInterviews}</Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default RecruiterSummary

