import { Card, CardContent, CardHeader, Typography, Box } from "@mui/material"
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from "@mui/lab"

const activities = [
  {
    id: 1,
    user: "Sarah Johnson",
    action: "Added new client",
    target: "Tech Solutions Inc",
    time: "2 hours ago",
    type: "client",
  },
  {
    id: 2,
    user: "Mike Wilson",
    action: "Completed interview with",
    target: "John Developer",
    time: "4 hours ago",
    type: "interview",
  },
  {
    id: 3,
    user: "Emily Brown",
    action: "Updated marketing campaign",
    target: "Q1 Growth Initiative",
    time: "6 hours ago",
    type: "marketing",
  },
]

export function ActivityTimeline() {
  return (
    <Card>
      <CardHeader title="Recent Activity" />
      <CardContent>
        <Timeline>
          {activities.map((activity, index) => (
            <TimelineItem key={activity.id}>
              <TimelineSeparator>
                <TimelineDot color="primary" />
                {index < activities.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" component="span">
                    {activity.user}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activity.action} <strong>{activity.target}</strong>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {activity.time}
                  </Typography>
                </Box>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  )
}

