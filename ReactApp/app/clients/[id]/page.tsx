"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  IconButton,
  InputAdornment,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getClient } from "../actions/clientActions";
import type { ClientDetail, PaymentSchedule } from "../../types/Clients/ClientDetail";
import { useAuth } from "@/contexts/authContext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import permissions from "../../utils/permissions";

export default function ClientView({ params }: { params: { id: string } }) {
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { roles } = useAuth();

  const userRole =
    roles.length > 0
      ? roles.includes("Admin")
        ? "Admin"
        : roles.includes("Sales_Executive")
        ? "Sales_Executive"
        : roles.includes("Senior_Recruiter")
        ? "Senior_Recruiter"
        : roles.includes("recruiter")
        ? "recruiter"
        : "default"
      : "default";

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const clientData = await getClient(Number(params.id));
        if (clientData) {
          setClient(clientData);
        } else {
          console.error("Client not found");
        }
      } catch (error) {
        console.error("Failed to fetch client:", error);
        alert("Failed to load client data. Please try again or contact support.");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [params.id]);

  const handleBack = () => {
    router.push("/clients");
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const canEdit =
    !!permissions.clients[userRole].basicInfo.edit ||
    (typeof permissions.clients[userRole].marketingInfo.edit === "object"
      ? Object.values(permissions.clients[userRole].marketingInfo.edit).some((v) => v)
      : !!permissions.clients[userRole].marketingInfo.edit) ||
    !!permissions.clients[userRole].subscriptionInfo.edit ||
    !!permissions.clients[userRole].postPlacementInfo.edit;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
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
          The client with ID {params.id} doesn’t exist or has been removed. Please
          check the client ID and try again.
        </Typography>
      </Box>
    );
  }

  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return "N/A";
    const d = date instanceof Date ? date : new Date(date);
    console.log(`Formatting date ${date} to ${d.toString()}`); // Debug log
    return isNaN(d.getTime()) ? "Invalid Date" : d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderPaymentSchedule = (
    schedules: PaymentSchedule[],
    type: "Subscription" | "Post-Placement"
  ) => (
    <TableContainer component={Paper} sx={{ mt: 2, mb: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{type} Payment Date</TableCell>
            <TableCell>{type} Amount</TableCell>
            <TableCell>{type} Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedules.length > 0 ? (
            schedules.map((payment, index) => (
              <TableRow key={index}>
                <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                <TableCell>{payment.isPaid ? "Paid" : "Pending"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} align="center">
                No {type.toLowerCase()} payment schedule available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
        Back to Clients
      </Button>
      <Typography variant="h4" gutterBottom>
        Client Details: {client.clientName}
      </Typography>
      <Grid container spacing={2}>
        {permissions.clients[userRole].basicInfo.view && (
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
                      <TableCell>{client.clientName || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Enrollment Date
                      </TableCell>
                      <TableCell>{formatDate(client.enrollmentDate)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Tech Stack
                      </TableCell>
                      <TableCell>{client.techStack || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Visa Status
                      </TableCell>
                      <TableCell>{client.visaStatus || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Personal Phone Number
                      </TableCell>
                      <TableCell>{client.personalPhoneNumber || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Personal Email Address
                      </TableCell>
                      <TableCell>{client.personalEmailAddress || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        LinkedIn URL
                      </TableCell>
                      <TableCell>
                        {client.linkedInURL ? (
                          <Link
                            href={client.linkedInURL}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {client.linkedInURL}
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
        )}
        {permissions.clients[userRole].marketingInfo.view && (
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
                      <TableCell>{formatDate(client.marketingStartDate)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Marketing End Date
                      </TableCell>
                      <TableCell>{formatDate(client.marketingEndDate)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Marketing Email ID
                      </TableCell>
                      <TableCell>{client.marketingEmailID || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Marketing Email Password
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography>
                            {showPassword
                              ? client.marketingEmailPassword || "N/A"
                              : "••••••••"}
                          </Typography>
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                            size="small"
                            sx={{ ml: 1 }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Assigned Recruiter Name
                      </TableCell>
                      <TableCell>{client.assignedRecruiterName || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Client Status
                      </TableCell>
                      <TableCell>{client.clientStatus || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Placed Date
                      </TableCell>
                      <TableCell>{formatDate(client.placedDate)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Backed Out Date
                      </TableCell>
                      <TableCell>{formatDate(client.backedOutDate)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Backed Out Reason
                      </TableCell>
                      <TableCell>{client.backedOutReason || "N/A"}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        )}
        {permissions.clients[userRole].subscriptionInfo.view && (
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
                        Subscription Plan Name
                      </TableCell>
                      <TableCell>{client.subscriptionPlanName || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Payment Start Date
                      </TableCell>
                      <TableCell>
                        {formatDate(client.subscriptionPlan?.subscriptionPlanPaymentStartDate)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Total Due
                      </TableCell>
                      <TableCell>${(client.totalDue || 0).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Service Agreement
                      </TableCell>
                      <TableCell>
                        {client.serviceAgreementUrl ? (
                          <Link
                            href={client.serviceAgreementUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Service Agreement
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
                {client.paymentSchedules && client.paymentSchedules.length > 0 ? (
                  renderPaymentSchedule(
                    client.paymentSchedules.filter((ps) => ps.paymentType === "Subscription"),
                    "Subscription"
                  )
                ) : (
                  <Typography>No subscription payment schedule available.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
        {permissions.clients[userRole].postPlacementInfo.view && (
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
                        Post-Placement Plan Name
                      </TableCell>
                      <TableCell>{client.postPlacementPlanName || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Payment Start Date
                      </TableCell>
                      <TableCell>
                        {formatDate(client.postPlacementPlan?.postPlacementPlanPaymentStartDate)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Total Paid
                      </TableCell>
                      <TableCell>${(client.totalPaid || 0).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Promissory Note
                      </TableCell>
                      <TableCell>
                        {client.promissoryNoteUrl ? (
                          <Link
                            href={client.promissoryNoteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Promissory Note
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
                {client.paymentSchedules && client.paymentSchedules.length > 0 ? (
                  renderPaymentSchedule(
                    client.paymentSchedules.filter((ps) => ps.paymentType === "PostPlacement"),
                    "Post-Placement"
                  )
                ) : (
                  <Typography>No post-placement payment schedule available.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
      {canEdit && (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push(`/clients/${client.clientID}/edit`)}
          >
            Edit Client
          </Button>
        </Box>
      )}
    </Box>
  );
}
