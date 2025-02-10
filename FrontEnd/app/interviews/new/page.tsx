import { Box, Typography, Button } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import InterviewForm from "../../components/interviews/InterviewForm"
import Link from "next/link"

export const metadata = {
  title: "Create New Interview | CareerVest",
}

export default function NewInterviewPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Button component={Link} href="/interviews" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to Interviews
      </Button>
      <Typography variant="h4" component="h1" sx={{ mb: 3, color: "#682A53" }}>
        Create New Interview
      </Typography>
      <InterviewForm />
    </Box>
  )
}

