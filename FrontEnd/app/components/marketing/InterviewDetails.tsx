"use client"

import type React from "react"
import { Box, Typography } from "@mui/material"
import type { Interview } from "../../types/marketing"

interface InterviewDetailsProps {
  interview: Interview
}

const InterviewDetails: React.FC<InterviewDetailsProps> = ({ interview }) => {
  return (
    <Box>
      <Typography variant="body1">Company: {interview.company}</Typography>
      <Typography variant="body1">Date: {new Date(interview.date).toLocaleString()}</Typography>
      <Typography variant="body1">Type: {interview.type}</Typography>
      <Typography variant="body1">Status: {interview.status}</Typography>
    </Box>
  )
}

export default InterviewDetails

