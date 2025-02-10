"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Box, Typography, Button, CircularProgress } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import InterviewForm from "../../../components/interviews/InterviewForm"
import { getInterview } from "../../../actions/interviewActions"
import type { Interview } from "../../../types/interview"

export default function InterviewEdit({ params }: { params: { id: string } }) {
  const [interview, setInterview] = useState<Interview | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const interviewData = await getInterview(Number(params.id))
        setInterview(interviewData)
      } catch (error) {
        console.error("Failed to fetch interview:", error)
        alert("Failed to load interview data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchInterview()
  }, [params.id])

  const handleBack = () => {
    router.push("/interviews")
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!interview) {
    return <Typography>Interview not found</Typography>
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
        Back to Interviews
      </Button>
      <Typography variant="h4" gutterBottom>
        Edit Interview
      </Typography>
      <InterviewForm initialData={interview} interviewId={interview.InterviewID} />
    </Box>
  )
}

