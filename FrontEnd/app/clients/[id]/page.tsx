"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Link,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { getClient } from "../../actions/clientActions"
import type { Client, PaymentSchedule } from "../../types/client"

export default function ClientView({ params }: { params: { id: string } }) {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const clientData = await getClient(Number(params.id))
        if (clientData) {
          setClient(clientData)
        } else {
          console.error("Client not found")
          // You can set an error state here if you want to display a specific error message
        }
      } catch (error) {
        console.error("Failed to fetch client:", error)
        alert("Failed to load client data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchClient()
  }, [params.id])

  const handleBack = () => {
    router.push("/clients")
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!client) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Clients
        </Button>
        <Typography variant="h4" gutterBottom>
          Client Not Found
        </Typography>
        <Typography>
          The client you're looking for doesn't exist or has been removed. Please check the client ID and try again.
        </Typography>
      </Box>
    )
  }

  const formatDate = (date: string | null) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString()
  }

  const renderPaymentSchedule = (schedules: PaymentSchedule[], type: "Subscription" | "Post-Placement") => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Payment Date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedules.map((payment, index) => (
            <TableRow key={index}>
              <TableCell>{formatDate(payment.PaymentDate)}</TableCell>
              <TableCell>${payment.Amount.toFixed(2)}</TableCell>
              <TableCell>{payment.IsPaid ? "Paid" : "Pending"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
        Back to Clients
      </Button>
      <Typography variant="h4" gutterBottom>
        Client Details: {client.ClientName}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Client Name
                    </TableCell>
                    <TableCell>{client.ClientName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Enrollment Date
                    </TableCell>
                    <TableCell>{formatDate(client.EnrollmentDate)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Tech Stack
                    </TableCell>
                    <TableCell>{client.TechStack || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Visa Status
                    </TableCell>
                    <TableCell>{client.VisaStatus || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Personal Phone Number
                    </TableCell>
                    <TableCell>{client.PersonalPhoneNumber || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Personal Email Address
                    </TableCell>
                    <TableCell>{client.PersonalEmailAddress || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      LinkedIn URL
                    </TableCell>
                    <TableCell>
                      {client.LinkedInURL ? (
                        <Link href={client.LinkedInURL} target="_blank" rel="noopener noreferrer">
                          {client.LinkedInURL}
                        </Link>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Marketing & Status Information
              </Typography>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Marketing Start Date
                    </TableCell>
                    <TableCell>{formatDate(client.MarketingStartDate)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Marketing End Date
                    </TableCell>
                    <TableCell>{formatDate(client.MarketingEndDate)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Marketing Email ID
                    </TableCell>
                    <TableCell>{client.MarketingEmailID || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Assigned Recruiter ID
                    </TableCell>
                    <TableCell>{client.AssignedRecruiterID || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Client Status
                    </TableCell>
                    <TableCell>{client.ClientStatus || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Placed Date
                    </TableCell>
                    <TableCell>{formatDate(client.PlacedDate)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Backed Out Date
                    </TableCell>
                    <TableCell>{formatDate(client.BackedOutDate)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Backed Out Reason
                    </TableCell>
                    <TableCell>{client.BackedOutReason || "N/A"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Subscription Information
              </Typography>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Subscription Plan ID
                    </TableCell>
                    <TableCell>{client.SubscriptionPlanID || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Total Due
                    </TableCell>
                    <TableCell>${client.TotalDue.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Service Agreement
                    </TableCell>
                    <TableCell>
                      {client.SubscriptionPlanID ? (
                        <Link href={`/api/files/${client.ClientID}/service-agreement`} target="_blank">
                          View Current Service Agreement
                        </Link>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Subscription Payment Schedule
              </Typography>
              {client.PaymentSchedules && client.PaymentSchedules.length > 0 ? (
                renderPaymentSchedule(
                  client.PaymentSchedules.filter((ps) => ps.PaymentType === "Subscription"),
                  "Subscription",
                )
              ) : (
                <Typography>No subscription payment schedule available.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Post-Placement Information
              </Typography>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Post-Placement Plan ID
                    </TableCell>
                    <TableCell>{client.PostPlacementPlanID || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Total Paid
                    </TableCell>
                    <TableCell>${client.TotalPaid.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Promissory Note
                    </TableCell>
                    <TableCell>
                      {client.PostPlacementPlanID ? (
                        <Link href={`/api/files/${client.ClientID}/promissory-note`} target="_blank">
                          View Current Promissory Note
                        </Link>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Post-Placement Payment Schedule
              </Typography>
              {client.PaymentSchedules && client.PaymentSchedules.length > 0 ? (
                renderPaymentSchedule(
                  client.PaymentSchedules.filter((ps) => ps.PaymentType === "PostPlacement"),
                  "Post-Placement",
                )
              ) : (
                <Typography>No post-placement payment schedule available.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="contained" color="primary" onClick={() => router.push(`/clients/${client.ClientID}/edit`)}>
          Edit Client
        </Button>
      </Box>
    </Box>
  )
}

