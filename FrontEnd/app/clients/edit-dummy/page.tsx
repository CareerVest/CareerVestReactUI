"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Box, Typography, Button, CircularProgress } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import EditClientForm from "../../components/clients/EditClientForm"
import type { Client } from "../../types/client"

const dummyClient: Client = {
  ClientID: 1,
  ClientName: "John Doe",
  EnrollmentDate: "2023-01-15",
  TechStack: "React, Node.js",
  MarketingStartDate: "2023-02-01",
  PlacedDate: null,
  BackedOutDate: null,
  BackedOutReason: null,
  PersonalPhoneNumber: "+1 (555) 123-4567",
  PersonalEmailAddress: "john.doe@example.com",
  MarketingEmailID: "john.doe.marketing@careervest.com",
  MarketingEmailPassword: "password123",
  AssignedRecruiterID: 1,
  VisaStatus: "H1B",
  LinkedInURL: "https://www.linkedin.com/in/johndoe",
  MarketingEndDate: null,
  JobOutcome: null,
  JobStartDate: null,
  JobSalary: null,
  PercentageFee: null,
  ResumeBlobKey: "resume_john_doe.pdf",
  ClientStatus: "Active",
  CreatedTS: "2023-01-15T10:00:00Z",
  UpdatedTS: "2023-02-01T14:30:00Z",
  CreatedBy: "Admin",
  UpdatedBy: "Admin",
  SubscriptionPlanID: 1,
  PostPlacementPlanID: null,
  TotalDue: 5000,
  TotalPaid: 2500,
}

export default function DummyClientEdit() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleBack = () => {
    router.push("/clients")
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
        Back to Clients
      </Button>
      <Typography variant="h4" gutterBottom>
        Edit Client: {dummyClient.ClientName}
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <EditClientForm client={dummyClient} />
      )}
    </Box>
  )
}

