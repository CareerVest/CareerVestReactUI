"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Box, Container, Grid, Typography, Paper, Select, MenuItem, FormControl, InputLabel } from "@mui/material"
import RecruiterSummary from "./RecruiterSummary"
import ClientDemographics from "./ClientDemographics"
import InterviewTimeline from "./InterviewTimeline"
import ClientList from "./ClientList"
import InterviewDetails from "./InterviewDetails"
import QuickActions from "./QuickActions"
import FilterSearch from "./FilterSearch"

import type { Recruiter, Client, Interview } from "../types"
import { fetchRecruiters, fetchClients, fetchInterviews } from "../api"

const MarketingActivityDashboard: React.FC = () => {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([])
  const [selectedRecruiter, setSelectedRecruiter] = useState<string>("all")
  const [clients, setClients] = useState<Client[]>([])
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const recruiterData = await fetchRecruiters()
      const clientData = await fetchClients()
      const interviewData = await fetchInterviews()
      setRecruiters(recruiterData)
      setClients(clientData)
      setInterviews(interviewData)
    }
    loadData()
  }, [])

  const handleRecruiterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedRecruiter(event.target.value as string)
  }

  const filteredClients =
    selectedRecruiter === "all" ? clients : clients.filter((client) => client.recruiterId === selectedRecruiter)

  const filteredInterviews =
    selectedRecruiter === "all"
      ? interviews
      : interviews.filter((interview) => filteredClients.some((client) => client.id === interview.clientId))

  return (
    <Container maxWidth="xl">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Marketing Activity Dashboard
        </Typography>
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="recruiter-select-label">Recruiter</InputLabel>
            <Select
              labelId="recruiter-select-label"
              id="recruiter-select"
              value={selectedRecruiter}
              label="Recruiter"
              onChange={handleRecruiterChange}
            >
              <MenuItem value="all">All Recruiters</MenuItem>
              {recruiters.map((recruiter) => (
                <MenuItem key={recruiter.id} value={recruiter.id}>
                  {recruiter.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <RecruiterSummary clients={filteredClients} interviews={filteredInterviews} />
          </Grid>
          <Grid item xs={12} md={9}>
            <ClientDemographics clients={filteredClients} />
          </Grid>
          <Grid item xs={12}>
            <InterviewTimeline interviews={filteredInterviews} onInterviewSelect={setSelectedInterview} />
          </Grid>
          <Grid item xs={12} md={6}>
            <ClientList clients={filteredClients} onClientSelect={setSelectedClient} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InterviewDetails interview={selectedInterview} client={selectedClient} />
          </Grid>
          <Grid item xs={12}>
            <QuickActions />
          </Grid>
          <Grid item xs={12}>
            <FilterSearch
              onFilterChange={() => {
                /* Implement filter logic */
              }}
              onSearch={() => {
                /* Implement search logic */
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default MarketingActivityDashboard

