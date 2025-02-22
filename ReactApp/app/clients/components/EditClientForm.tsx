"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  SelectChangeEvent,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  getRecruiters,
  updateClient,
} from "../../clients/actions/clientActions";
import type { ClientDetail } from "../../types/Clients/ClientDetail";
import { Employee } from "@/app/types/Clients/Client";
import { Recruiter } from "@/app/types/Clients/Recruiter";

interface PaymentSchedule {
  paymentDate: string | null;
  amount: number;
}

interface EditClientFormProps {
  client: ClientDetail;
}

export default function EditClientForm({ client }: EditClientFormProps) {
  const router = useRouter();
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [clientData, setClientData] = useState<ClientDetail>(client);
  const [subscriptionPaymentSchedule, setSubscriptionPaymentSchedule] =
    useState<PaymentSchedule[]>([]);
  const [postPlacementPaymentSchedule, setPostPlacementPaymentSchedule] =
    useState<PaymentSchedule[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const [recruitersData] = await Promise.all([getRecruiters()]);
      setRecruiters(recruitersData.$values);
    };
    fetchPlans();

    // Initialize payment schedules
    // In a real application, you would fetch these from the backend
    setSubscriptionPaymentSchedule([
      { paymentDate: "2023-07-01", amount: 1000 },
      { paymentDate: "2023-08-01", amount: 1000 },
    ]);
    setPostPlacementPaymentSchedule([
      { paymentDate: "2023-09-01", amount: 500 },
      { paymentDate: "2023-10-01", amount: 500 },
    ]);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setClientData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setClientData((prev) => ({
      ...prev,
      [name]: value === "" ? null : Number(value), // Convert to number if not empty
    }));
  };

  const addPaymentRow = (type: "subscription" | "postPlacement") => {
    const newPayment: PaymentSchedule = { paymentDate: null, amount: 0 };
    if (type === "subscription") {
      setSubscriptionPaymentSchedule([
        ...subscriptionPaymentSchedule,
        newPayment,
      ]);
    } else {
      setPostPlacementPaymentSchedule([
        ...postPlacementPaymentSchedule,
        newPayment,
      ]);
    }
  };

  const removePaymentRow = (
    index: number,
    type: "subscription" | "postPlacement"
  ) => {
    if (type === "subscription") {
      setSubscriptionPaymentSchedule(
        subscriptionPaymentSchedule.filter((_, i) => i !== index)
      );
    } else {
      setPostPlacementPaymentSchedule(
        postPlacementPaymentSchedule.filter((_, i) => i !== index)
      );
    }
  };

  const updatePaymentSchedule = (
    index: number,
    field: keyof PaymentSchedule,
    value: string | number,
    type: "subscription" | "postPlacement"
  ) => {
    const updater = (prevSchedule: PaymentSchedule[]) =>
      prevSchedule.map((payment, i) =>
        i === index ? { ...payment, [field]: value } : payment
      );

    if (type === "subscription") {
      setSubscriptionPaymentSchedule(updater);
    } else {
      setPostPlacementPaymentSchedule(updater);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await updateClient(clientData.clientID, clientData);
      router.push("/clients");
    } catch (error) {
      console.error("Failed to update client:", error);
      alert("Failed to update client. Please try again.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ mt: 1, "& .MuiCard-root": { height: "100%" } }}
    >
      <Grid container spacing={0.5}>
        {/* Basic Information - Top Left */}
        <Grid item xs={12} md={6} sx={{ mb: 1 }}>
          <Card>
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Grid container spacing={0.5}>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <TextField
                    required
                    fullWidth
                    id="ClientName"
                    name="ClientName"
                    label="Client Name"
                    value={clientData.clientName}
                    onChange={handleInputChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    id="EnrollmentDate"
                    name="EnrollmentDate"
                    label="Enrollment Date"
                    type="date"
                    value={clientData.enrollmentDate || ""}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    id="TechStack"
                    name="TechStack"
                    label="Tech Stack"
                    value={clientData.techStack || ""}
                    onChange={handleInputChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    id="VisaStatus"
                    name="VisaStatus"
                    label="Visa Status"
                    value={clientData.visaStatus || ""}
                    onChange={handleInputChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    id="PersonalPhoneNumber"
                    name="PersonalPhoneNumber"
                    label="Personal Phone Number"
                    value={clientData.personalPhoneNumber || ""}
                    onChange={handleInputChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    id="PersonalEmailAddress"
                    name="PersonalEmailAddress"
                    label="Personal Email Address"
                    type="email"
                    value={clientData.personalEmailAddress || ""}
                    onChange={handleInputChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    id="LinkedInURL"
                    name="LinkedInURL"
                    label="LinkedIn URL"
                    value={clientData.linkedInURL || ""}
                    onChange={handleInputChange}
                    size="small"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Marketing Information - Top Right */}
        <Grid item xs={12} md={6} sx={{ mb: 1 }}>
          <Card>
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="h6" gutterBottom>
                Marketing & Status Information
              </Typography>
              <Grid container spacing={0.5}>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    id="MarketingStartDate"
                    name="MarketingStartDate"
                    label="Marketing Start Date"
                    type="date"
                    value={clientData.marketingStartDate || ""}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    id="MarketingEndDate"
                    name="MarketingEndDate"
                    label="Marketing End Date"
                    type="date"
                    value={clientData.marketingEndDate || ""}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    id="MarketingEmailID"
                    name="MarketingEmailID"
                    label="Marketing Email ID"
                    type="email"
                    value={clientData.marketingEmailID || ""}
                    onChange={handleInputChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    id="MarketingEmailPassword"
                    name="MarketingEmailPassword"
                    label="Marketing Email Password"
                    type="password"
                    value={clientData.marketingEmailID || ""}
                    onChange={handleInputChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sx={{ mb: 1 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="AssignedRecruiterID-label">
                      Assigned Recruiter
                    </InputLabel>
                    <Select
                      labelId="AssignedRecruiterID-label"
                      id="AssignedRecruiterID"
                      name="assignedRecruiterID"
                      value={
                        clientData.assignedRecruiterID
                          ? String(clientData.assignedRecruiterID)
                          : ""
                      }
                      onChange={handleSelectChange}
                      size="small"
                    >
                      {recruiters.map((recruiter) => (
                        <MenuItem
                          key={recruiter.employeeID}
                          value={String(recruiter.employeeID)}
                        >
                          {`${recruiter.firstName} ${recruiter.lastName}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <FormControl fullWidth required size="small">
                    <InputLabel id="ClientStatus-label">
                      Client Status
                    </InputLabel>
                    <Select
                      labelId="ClientStatus-label"
                      id="ClientStatus"
                      name="clientStatus"
                      value={clientData.clientStatus || ""}
                      onChange={handleSelectChange}
                      size="small"
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Placed">Placed</MenuItem>
                      <MenuItem value="BackedOut">Backed Out</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    id="PlacedDate"
                    name="PlacedDate"
                    label="Placed Date"
                    type="date"
                    value={clientData.placedDate || ""}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    id="BackedOutDate"
                    name="BackedOutDate"
                    label="Backed Out Date"
                    type="date"
                    value={clientData.backedOutDate || ""}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    id="BackedOutReason"
                    name="BackedOutReason"
                    label="Backed Out Reason"
                    value={clientData.backedOutReason || ""}
                    onChange={handleInputChange}
                    size="small"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Subscription Section - Bottom Left */}
        <Grid item xs={12} md={6} sx={{ mb: 1 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="h6" gutterBottom>
                Subscription Information
              </Typography>
              <Grid container spacing={0.5}>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <FormControl fullWidth size="small">
                    <TextField
                      label="Subscription Plan Name"
                      value={clientData.subscriptionPlanName || "N/A"} // ✅ Show the plan name
                      InputProps={{ readOnly: true }} // ✅ Prevent editing
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    id="TotalDue"
                    name="TotalDue"
                    label="Total Due"
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                    value={clientData.totalDue}
                    onChange={handleInputChange}
                    size="small"
                  />
                </Grid>
              </Grid>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Subscription Payment Schedule
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Payment Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subscriptionPaymentSchedule.map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            fullWidth
                            type="date"
                            value={payment.paymentDate || ""}
                            onChange={(e) =>
                              updatePaymentSchedule(
                                index,
                                "paymentDate",
                                e.target.value,
                                "subscription"
                              )
                            }
                            InputLabelProps={{ shrink: true }}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            type="number"
                            value={payment.amount}
                            onChange={(e) =>
                              updatePaymentSchedule(
                                index,
                                "amount",
                                Number(e.target.value),
                                "subscription"
                              )
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() =>
                              removePaymentRow(index, "subscription")
                            }
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                startIcon={<AddIcon />}
                onClick={() => addPaymentRow("subscription")}
                sx={{ mt: 2 }}
              >
                Add Payment
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Post-Placement Section - Bottom Right */}
        <Grid item xs={12} md={6} sx={{ mb: 1 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="h6" gutterBottom>
                Post-Placement Information
              </Typography>
              <Grid container spacing={0.5}>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <FormControl fullWidth size="small">
                    <TextField
                      label="Post Placement Plan Name"
                      value={clientData.postPlacementPlanName || "N/A"} // ✅ Show the assigned plan name
                      InputProps={{ readOnly: true }} // ✅ Prevent editing
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    id="TotalPaid"
                    name="TotalPaid"
                    label="Total Paid"
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                    value={clientData.totalPaid}
                    onChange={handleInputChange}
                    size="small"
                  />
                </Grid>
              </Grid>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Post-Placement Payment Schedule
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Payment Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {postPlacementPaymentSchedule.map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            fullWidth
                            type="date"
                            value={payment.paymentDate || ""}
                            onChange={(e) =>
                              updatePaymentSchedule(
                                index,
                                "paymentDate",
                                e.target.value,
                                "postPlacement"
                              )
                            }
                            InputLabelProps={{ shrink: true }}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            type="number"
                            value={payment.amount}
                            onChange={(e) =>
                              updatePaymentSchedule(
                                index,
                                "amount",
                                Number(e.target.value),
                                "postPlacement"
                              )
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() =>
                              removePaymentRow(index, "postPlacement")
                            }
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                startIcon={<AddIcon />}
                onClick={() => addPaymentRow("postPlacement")}
                sx={{ mt: 2 }}
              >
                Add Payment
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Action Buttons - Bottom */}
        <Grid item xs={12} sx={{ mb: 1 }}>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
          >
            <Button onClick={() => router.push("/clients")} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update Client
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
