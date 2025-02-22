import { Box, Typography, Button } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import CreateClientForm from "../components/CreateClientForm"
import Link from "next/link"

export const metadata = {
  title: "Add New Client | CareerVest",
}

export default function NewClientPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Button component={Link} href="/clients" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to Clients
      </Button>
      <Typography variant="h4" component="h1" sx={{ mb: 3, color: "#682A53" }}>
        Add New Client
      </Typography>
      <CreateClientForm />
    </Box>
  )
}

