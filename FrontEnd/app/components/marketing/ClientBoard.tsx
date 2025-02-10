"use client"

import type React from "react"
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText } from "@mui/material"
import type { Client, Interview } from "../../types/marketing"

interface ClientBoardProps {
  clients: Client[]
  interviews: Interview[]
  onInterviewSelect: (interview: Interview) => void
}

const ClientBoard: React.FC<ClientBoardProps> = ({ clients, interviews, onInterviewSelect }) => {
  const today = new Date().toDateString()

  return (
    <Box sx={{ display: "flex", overflowX: "auto" }}>
      <Box sx={{ minWidth: 300, mr: 2 }}>
        <Typography variant="h6" gutterBottom>
          Received Interviews Today
        </Typography>
        {clients.map((client) => {
          const clientInterviews = interviews.filter(
            (interview) =>
              interview.clientId === client.id &&
              new Date(interview.date).toDateString() === today &&
              interview.status === "completed",
          )
          if (clientInterviews.length === 0) return null
          return (
            <Card key={client.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1">{client.name}</Typography>
                <List dense>
                  {clientInterviews.map((interview) => (
                    <ListItem key={interview.id} button onClick={() => onInterviewSelect(interview)}>
                      <ListItemText
                        primary={interview.company}
                        secondary={`${new Date(interview.date).toLocaleTimeString()} - ${interview.type}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )
        })}
      </Box>
      <Box sx={{ minWidth: 300, mr: 2 }}>
        <Typography variant="h6" gutterBottom>
          Scheduled Interviews Today
        </Typography>
        {clients.map((client) => {
          const clientInterviews = interviews.filter(
            (interview) =>
              interview.clientId === client.id &&
              new Date(interview.date).toDateString() === today &&
              interview.status === "scheduled",
          )
          if (clientInterviews.length === 0) return null
          return (
            <Card key={client.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1">{client.name}</Typography>
                <List dense>
                  {clientInterviews.map((interview) => (
                    <ListItem key={interview.id} button onClick={() => onInterviewSelect(interview)}>
                      <ListItemText
                        primary={interview.company}
                        secondary={`${new Date(interview.date).toLocaleTimeString()} - ${interview.type}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )
        })}
      </Box>
      <Box sx={{ minWidth: 300 }}>
        <Typography variant="h6" gutterBottom>
          All Clients
        </Typography>
        {clients.map((client) => {
          const clientInterviews = interviews.filter((interview) => interview.clientId === client.id)
          return (
            <Card key={client.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1">{client.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {client.status}
                </Typography>
                <Typography variant="body2">Total Interviews: {clientInterviews.length}</Typography>
                <Typography variant="body2">
                  Screenings: {clientInterviews.filter((i) => i.type === "Screening").length}
                </Typography>
                <Typography variant="body2">
                  Technical: {clientInterviews.filter((i) => i.type === "Technical").length}
                </Typography>
                <Typography variant="body2">
                  Final: {clientInterviews.filter((i) => i.type === "Final").length}
                </Typography>
              </CardContent>
            </Card>
          )
        })}
      </Box>
    </Box>
  )
}

export default ClientBoard

