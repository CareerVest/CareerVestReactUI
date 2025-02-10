"use client"

import type React from "react"
import { useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  Collapse,
  IconButton,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material"
import { ExpandMore as ExpandMoreIcon, Edit as EditIcon } from "@mui/icons-material"
import type { Client, Interview } from "../../types/marketing"

interface ClientCardProps {
  client: Client
  interviews: Interview[]
  onInterviewSelect: (interview: Interview) => void
}

const ClientCard: React.FC<ClientCardProps> = ({ client, interviews, onInterviewSelect }) => {
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const interviewsToday = interviews.filter(
    (interview) => new Date(interview.date).toDateString() === new Date().toDateString(),
  )
  const receivedInterviews = interviewsToday.filter((interview) => interview.status === "completed")
  const scheduledInterviews = interviewsToday.filter((interview) => interview.status === "scheduled")

  const totalInterviews = interviews.length
  const totalScreenings = interviews.filter((interview) => interview.type === "Screening").length
  const totalTechnical = interviews.filter((interview) => interview.type === "Technical").length
  const totalFinal = interviews.filter((interview) => interview.type === "Final").length

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{client.name}</Typography>
          <Box>
            <Chip
              label={client.status}
              color={client.status === "active" ? "success" : client.status === "placed" ? "primary" : "default"}
              size="small"
              sx={{ mr: 1 }}
            />
            <IconButton onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
              <ExpandMoreIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography color="text.secondary">
          Total Interviews Today: {interviewsToday.length} | Received: {receivedInterviews.length} | Scheduled:{" "}
          {scheduledInterviews.length}
        </Typography>
      </CardContent>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Received Interviews Today
          </Typography>
          <List dense>
            {receivedInterviews.map((interview) => (
              <ListItem key={interview.id} button onClick={() => onInterviewSelect(interview)}>
                <ListItemText
                  primary={interview.company}
                  secondary={`${new Date(interview.date).toLocaleTimeString()} - ${interview.type}`}
                />
              </ListItem>
            ))}
          </List>
          <Typography variant="h6" gutterBottom>
            Scheduled Interviews Today
          </Typography>
          <List dense>
            {scheduledInterviews.map((interview) => (
              <ListItem key={interview.id} button onClick={() => onInterviewSelect(interview)}>
                <ListItemText
                  primary={interview.company}
                  secondary={`${new Date(interview.date).toLocaleTimeString()} - ${interview.type}`}
                />
              </ListItem>
            ))}
          </List>
          <Typography variant="h6" gutterBottom>
            Summary Statistics
          </Typography>
          <Typography>Total Interviews: {totalInterviews}</Typography>
          <Typography>Total Screenings: {totalScreenings}</Typography>
          <Typography>Total Technical Interviews: {totalTechnical}</Typography>
          <Typography>Total Final Round Interviews: {totalFinal}</Typography>
          <Box mt={2}>
            <Button startIcon={<EditIcon />} variant="outlined" size="small">
              Edit Client
            </Button>
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default ClientCard

