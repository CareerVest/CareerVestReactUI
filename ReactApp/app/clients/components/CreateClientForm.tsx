"use client";

import { useState, useEffect } from "react";
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
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { createClient, getRecruiters } from "../actions/clientActions";
import type {
  Client,
  Employee,
  SubscriptionPlan,
  PostPlacementPlan,
} from "../../types/Clients/Client";
import { styled } from "@mui/material/styles";

interface PaymentSchedule {
  paymentDate: string | null;
  amount: number;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function CreateClientForm() {
  const router = useRouter();
  const [recruiters, setRecruiters] = useState<Employee[]>([]);
  const [clientData, setClientData] = useState<Client>({
    clientID: 0,
    clientName: "",
    enrollmentDate: null,
    techStack: "",
    personalPhoneNumber: "",
    personalEmailAddress: "",
    assignedRecruiterID: null,
    visaStatus: "",
    linkedInURL: "",
    clientStatus: 0,
    subscriptionPlanID: null,
    postPlacementPlanID: null,
    marketingStartDate: null,
    marketingEndDate: null,
    marketingEmailID: "",
    marketingEmailPassword: "",
    placedDate: null,
    backedOutDate: null,
    backedOutReason: "",
    totalDue: 0.0,
    totalPaid: 0.0,
  });
  const [subscriptionPaymentSchedule, setSubscriptionPaymentSchedule] = useState<PaymentSchedule[]>([]);
  const [postPlacementPaymentSchedule, setPostPlacementPaymentSchedule] = useState<PaymentSchedule[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [postPlacementPlans, setPostPlacementPlans] = useState<PostPlacementPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recruitersData = await getRecruiters();
        // Check if recruitersData has a $values property and it's an array
        if (recruitersData && Array.isArray(recruitersData.$values)) {
          setRecruiters(recruitersData.$values);
        } else {
          console.error("getRecruiters did not return an array in $values:", recruitersData);
          setRecruiters([]); // Fallback to empty array if $values is missing or not an array
        }
      } catch (error) {
        console.error("Failed to fetch recruiters:", error);
        setRecruiters([]); // Fallback to empty array on error
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setClientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<number>) => {
    const name = event.target.name as keyof Client;
    setClientData((prevData) => ({
      ...prevData,
      [name]: event.target.value,
    }));
  };

  const addPaymentRow = (type: "subscription" | "postPlacement") => {
    const newPayment: PaymentSchedule = { paymentDate: null, amount: 0 };
    if (type === "subscription") {
      setSubscriptionPaymentSchedule([...subscriptionPaymentSchedule, newPayment]);
    } else {
      setPostPlacementPaymentSchedule([...postPlacementPaymentSchedule, newPayment]);
    }
  };

  const removePaymentRow = (index: number, type: "subscription" | "postPlacement") => {
    if (type === "subscription") {
      setSubscriptionPaymentSchedule(subscriptionPaymentSchedule.filter((_, i) => i !== index));
    } else {
      setPostPlacementPaymentSchedule(postPlacementPaymentSchedule.filter((_, i) => i !== index));
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
    setIsLoading(true);
    try {
      await createClient(clientData);
      router.push("/clients");
      router.refresh();
    } catch (error) {
      console.error("Failed to create client:", error);
      alert("Failed to create client. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, "& .MuiCard-root": { height: "100%" } }}>
      <Grid container spacing={0.5}>
        {/* Basic Information - Top Left */}
        <Grid item xs={12} md={6} sx={{ mb: 1 }}>
          <Card>
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="h6" gutterBottom>Basic Information</Typography>
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
              <Typography variant="h6" gutterBottom>Marketing & Status Information</Typography>
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
                    value={clientData.marketingEmailPassword || ""}
                    onChange={handleInputChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sx={{ mb: 1 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="AssignedRecruiterID-label">Assigned Recruiter</InputLabel>
                    <Select
                      labelId="AssignedRecruiterID-label"
                      id="AssignedRecruiterID"
                      name="AssignedRecruiterID"
                      value={clientData.assignedRecruiterID || ""}
                      onChange={handleSelectChange}
                      size="small"
                    >
                      {Array.isArray(recruiters) && recruiters.length > 0 ? (
                        recruiters.map((recruiter) => (
                          <MenuItem key={recruiter.employeeID} value={recruiter.employeeID}>
                            {`${recruiter.firstName} ${recruiter.lastName}`}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No recruiters available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <FormControl fullWidth required size="small">
                    <InputLabel id="ClientStatus-label">Client Status</InputLabel>
                    <Select
                      labelId="ClientStatus-label"
                      id="ClientStatus"
                      name="ClientStatus"
                      value={clientData.clientStatus || ""}
                      onChange={handleSelectChange}
                      size="small"
                    >
                      <MenuItem value={0}>Active</MenuItem>
                      <MenuItem value={1}>Placed</MenuItem>
                      <MenuItem value={2}>Backed Out</MenuItem>
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
              <Typography variant="h6" gutterBottom>Subscription Information</Typography>
              <Grid container spacing={0.5}>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="SubscriptionPlanID-label">Subscription Plan Name</InputLabel>
                    <Select
                      labelId="SubscriptionPlanID-label"
                      id="SubscriptionPlanID"
                      name="SubscriptionPlanID"
                      value={clientData.subscriptionPlanID || ""}
                      onChange={handleSelectChange}
                    >
                      {subscriptionPlans.map((plan) => (
                        <MenuItem key={plan.subscriptionPlanID} value={plan.subscriptionPlanID}>
                          {plan.planName}
                        </MenuItem>
                      ))}
                    </Select>
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
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    value={clientData.totalDue || ""}
                    onChange={handleInputChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sx={{ mb: 1 }}>
                  <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ width: "100%" }}>
                    Upload Service Agreement
                    <VisuallyHiddenInput type="file" />
                  </Button>
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
                              updatePaymentSchedule(index, "paymentDate", e.target.value, "subscription")
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
                              updatePaymentSchedule(index, "amount", Number(e.target.value), "subscription")
                            }
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => removePaymentRow(index, "subscription")}
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
              <Button startIcon={<AddIcon />} onClick={() => addPaymentRow("subscription")} sx={{ mt: 2 }}>
                Add Payment
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Post-Placement Section - Bottom Right */}
        <Grid item xs={12} md={6} sx={{ mb: 1 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="h6" gutterBottom>Post-Placement Information</Typography>
              <Grid container spacing={0.5}>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="PostPlacementPlanID-label">Post Placement Plan Name</InputLabel>
                    <Select
                      labelId="PostPlacementPlanID-label"
                      id="PostPlacementPlanID"
                      name="PostPlacementPlanID"
                      value={clientData.postPlacementPlanID || ""}
                      onChange={handleSelectChange}
                    >
                      {postPlacementPlans.map((plan) => (
                        <MenuItem key={plan.postPlacementPlanID} value={plan.postPlacementPlanID}>
                          {plan.planName}
                        </MenuItem>
                      ))}
                    </Select>
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
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    value={clientData.totalPaid || ""}
                    onChange={handleInputChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sx={{ mb: 1 }}>
                  <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ width: "100%" }}>
                    Upload Promissory Note
                    <VisuallyHiddenInput type="file" />
                  </Button>
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
                              updatePaymentSchedule(index, "paymentDate", e.target.value, "postPlacement")
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
                              updatePaymentSchedule(index, "amount", Number(e.target.value), "postPlacement")
                            }
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => removePaymentRow(index, "postPlacement")}
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
              <Button startIcon={<AddIcon />} onClick={() => addPaymentRow("postPlacement")} sx={{ mt: 2 }}>
                Add Payment
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Action Buttons - Bottom */}
        <Grid item xs={12} sx={{ mb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
            <Button onClick={() => router.push("/clients")} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Client"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}