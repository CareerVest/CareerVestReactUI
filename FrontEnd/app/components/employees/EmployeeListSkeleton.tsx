import { Box, Paper, Skeleton } from "@mui/material"

export default function EmployeeListSkeleton() {
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={52} sx={{ mb: 1 }} />
        ))}
      </Paper>
    </Box>
  )
}

