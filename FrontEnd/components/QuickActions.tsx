import type React from "react"
import { Paper, Typography, Button, Grid } from "@mui/material"
import { Add as AddIcon, Edit as EditIcon, Refresh as RefreshIcon } from "@mui/icons-material"

const QuickActions: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
          <Button variant="contained" startIcon={<AddIcon />}>
            Schedule Interview
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" startIcon={<EditIcon />}>
            Update Client Status
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" startIcon={<RefreshIcon />}>
            Refresh Data
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default QuickActions

