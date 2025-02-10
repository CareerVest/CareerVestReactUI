import { Box, Typography } from "@mui/material"
import InterviewList from "../components/interviews/InterviewList"
import AddInterviewButton from "../components/interviews/AddInterviewButton"

export const metadata = {
  title: "Interviews | CareerVest",
}

export default function InterviewsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: "#682A53" }}>
          Interviews
        </Typography>
        <AddInterviewButton />
      </Box>
      <InterviewList />
    </Box>
  )
}

