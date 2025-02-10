import type React from "react"
import { Paper, Typography } from "@mui/material"
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from "@mui/lab"
import { Event as EventIcon } from "@mui/icons-material"
import type { Interview } from "../types"

interface InterviewTimelineProps {
  interviews: Interview[]
  onInterviewSelect: (interview: Interview) => void
}

const InterviewTimeline: React.FC<InterviewTimelineProps> = ({ interviews, onInterviewSelect }) => {
  const sortedInterviews = [...interviews].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Interview Timeline
      </Typography>
      <Timeline position="alternate">
        {sortedInterviews.map((interview) => (
          <TimelineItem key={interview.id}>
            <TimelineSeparator>
              <TimelineDot color={new Date(interview.date) < new Date() ? "grey" : "primary"}>
                <EventIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={3} sx={{ p: 2, cursor: "pointer" }} onClick={() => onInterviewSelect(interview)}>
                <Typography variant="h6" component="h1">
                  {interview.clientName}
                </Typography>
                <Typography>{new Date(interview.date).toLocaleString()}</Typography>
                <Typography>{interview.company}</Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Paper>
  )
}

export default InterviewTimeline

