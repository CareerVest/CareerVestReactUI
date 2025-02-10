"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  CircularProgress,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { getInterview } from "../../actions/interviewActions"
import type { Interview } from "../../types/interview"

export default function InterviewView({ params }: { params: { id: string } }) {
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

  const handleEdit = () => {
    router.push(`/interviews/${params.id}/edit`)
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
      <Typography variant="h4" gutterBottom sx={{ color: "#682A53" }}>
        Interview Details
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Interview ID
                    </TableCell>
                    <TableCell>{interview.InterviewID}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Interview Date
                    </TableCell>
                    <TableCell>{interview.InterviewDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Technology
                    </TableCell>
                    <TableCell>{interview.Technology}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Interview Type
                    </TableCell>
                    <TableCell>{interview.InterviewType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Interview Method
                    </TableCell>
                    <TableCell>{interview.InterviewMethod}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Interview Status
                    </TableCell>
                    <TableCell>{interview.InterviewStatus}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Start Time
                    </TableCell>
                    <TableCell>{interview.InterviewStartTime}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      End Time
                    </TableCell>
                    <TableCell>{interview.InterviewEndTime}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Recruiter ID
                    </TableCell>
                    <TableCell>{interview.RecruiterID}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Client ID
                    </TableCell>
                    <TableCell>{interview.ClientID}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Interview Support
          </Typography>
          <Typography>{interview.InterviewSupport || "N/A"}</Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Interview Feedback
          </Typography>
          <Typography>{interview.InterviewFeedback || "N/A"}</Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Comments
          </Typography>
          <Typography>{interview.Comments || "N/A"}</Typography>
        </Box>
      </Paper>
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary" onClick={handleEdit}>
          Edit Interview
        </Button>
      </Box>
    </Box>
  )
}

