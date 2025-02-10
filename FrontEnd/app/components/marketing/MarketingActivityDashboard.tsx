"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Drawer,
} from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"
import ClientBoard from "./ClientBoard"
import InterviewDetails from "./InterviewDetails"
import { fetchClients, fetchInterviews, fetchRecruiters } from "../../actions/marketingActions"
import type { Client, Interview, Recruiter } from "../../types/marketing"

const MarketingActivityDashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [recruiters, setRecruiters] = useState<Recruiter[]>([])
  const [selectedRecruiter, setSelectedRecruiter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const [clientData, interviewData, recruiterData] = await Promise.all([
        fetchClients(),
        fetchInterviews(),
        fetchRecruiters(),
      ])
      setClients(clientData)
      setInterviews(interviewData)
      setRecruiters(recruiterData)
    }
    loadData()
  }, [])

  const filteredClients = clients.filter(
    (client) =>
      (selectedRecruiter === "all" || client.recruiterId === selectedRecruiter) &&
      client.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleRecruiterSelect = (recruiterId: string) => {
    setSelectedRecruiter(recruiterId)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleInterviewSelect = (interview: Interview) => {
    setSelectedInterview(interview)
  }

  const handleCloseInterviewDetails = () => {
    setSelectedInterview(null)
  }

  const clientsWithActivityToday = filteredClients.filter((client) =>
    interviews.some(
      (interview) =>
        interview.clientId === client.id && new Date(interview.date).toDateString() === new Date().toDateString(),
    ),
  )

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Left Sidebar */}
      <Box sx={{ width: 250, borderRight: 1, borderColor: "divider", p: 2, overflowY: "auto" }}>
        <Typography variant="h6" gutterBottom>
          Recruiters
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton selected={selectedRecruiter === "all"} onClick={() => handleRecruiterSelect("all")}>
              <ListItemText primary="All Recruiters" />
            </ListItemButton>
          </ListItem>
          {recruiters.map((recruiter) => (
            <ListItem key={recruiter.id} disablePadding>
              <ListItemButton
                selected={selectedRecruiter === recruiter.id}
                onClick={() => handleRecruiterSelect(recruiter.id)}
              >
                <ListItemText primary={recruiter.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Middle Section */}
      <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
        <Typography variant="h4" gutterBottom>
          Marketing Activity Dashboard
        </Typography>
        <TextField
          fullWidth
          label="Search Clients"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Typography>
              Total Clients: {filteredClients.length} | Clients with Activity Today: {clientsWithActivityToday.length}
            </Typography>
          </CardContent>
        </Card>

        <ClientBoard clients={filteredClients} interviews={interviews} onInterviewSelect={handleInterviewSelect} />
      </Box>

      {/* Right Sidebar (Interview Details Drawer) */}
      <Drawer
        anchor="right"
        open={selectedInterview !== null}
        onClose={handleCloseInterviewDetails}
        sx={{ width: 300 }}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Interview Details
          </Typography>
          {selectedInterview && <InterviewDetails interview={selectedInterview} />}
        </Box>
      </Drawer>
    </Box>
  )
}

export default MarketingActivityDashboard

