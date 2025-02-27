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
  Link,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { updateClient, getRecruiters } from "../actions/clientActions";
import type { ClientDetail, PaymentSchedule } from "../../types/Clients/ClientDetail";
import type { Employee } from "../../types/Clients/Client";
import { styled } from "@mui/material/styles";

// Styled component for hidden file input
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

// Updated to handle Date | string | null | undefined and return string for input
const formatDateForInput = (date: Date | string | null | undefined): string => {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
};

// Convert input string to Date for state
const parseDateForState = (dateStr: string | null): Date | null => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
};

interface EditClientFormProps {
  client: ClientDetail;
  userRole: string;
  permissions: any;
  canEdit: boolean;
}

export default function EditClientForm({ client, userRole, permissions, canEdit }: EditClientFormProps) {
  const router = useRouter();
  const [recruiters, setRecruiters] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serviceAgreementFile, setServiceAgreementFile] = useState<File | null>(null);
  const [promissoryNoteFile, setPromissoryNoteFile] = useState<File | null>(null);
  const [serviceAgreementFileName, setServiceAgreementFileName] = useState<string>("");
  const [promissoryNoteFileName, setPromissoryNoteFileName] = useState<string>("");
  const [subscriptionPlanName, setSubscriptionPlanName] = useState<string>(client.subscriptionPlan?.planName || "");
  const [postPlacementPlanName, setPostPlacementPlanName] = useState<string>(client.postPlacementPlan?.planName || "");
  const [subscriptionStartDate, setSubscriptionStartDate] = useState<string | null>(null);
  const [postPlacementStartDate, setPostPlacementStartDate] = useState<string | null>(null);

  // Initialize state with proper Date types and handle undefined safely
  const initialClientData: ClientDetail = {
    ...client,
    enrollmentDate: client.enrollmentDate ? new Date(client.enrollmentDate) : null,
    marketingStartDate: client.marketingStartDate ? new Date(client.marketingStartDate) : null,
    marketingEndDate: client.marketingEndDate ? new Date(client.marketingEndDate) : null,
    placedDate: client.placedDate ? new Date(client.placedDate) : null,
    backedOutDate: client.backedOutDate ? new Date(client.backedOutDate) : null,
    paymentSchedules: client.paymentSchedules
      ? client.paymentSchedules.map((ps) => ({
          ...ps,
          paymentDate: ps.paymentDate ? new Date(ps.paymentDate) : null,
          createdTS: ps.createdTS ? new Date(ps.createdTS) : null,
          updatedTS: ps.updatedTS ? new Date(ps.updatedTS) : null,
        }))
      : [],
    subscriptionPlan: client.subscriptionPlan || {
      subscriptionPlanID: 0,
      planName: "",
      serviceAgreementUrl: null,
      subscriptionPlanPaymentStartDate: null,
      totalSubscriptionAmount: 0,
      createdTS: null,
      createdBy: null,
      updatedTS: null,
      updatedBy: null,
    },
    postPlacementPlan: client.postPlacementPlan || {
      postPlacementPlanID: 0,
      planName: "",
      promissoryNoteUrl: null,
      postPlacementPlanPaymentStartDate: null,
      totalPostPlacementAmount: 0,
      createdTS: null,
      createdBy: null,
      updatedTS: null,
      updatedBy: null,
    },
    clientStatus: client.clientStatus || "Active",
  };

  const [clientData, setClientData] = useState<ClientDetail>(initialClientData);
  const [subscriptionPaymentSchedule, setSubscriptionPaymentSchedule] = useState<PaymentSchedule[]>(
    initialClientData.paymentSchedules.filter((ps) => ps.paymentType === "Subscription")
  );
  const [postPlacementPaymentSchedule, setPostPlacementPaymentSchedule] = useState<PaymentSchedule[]>(
    initialClientData.paymentSchedules.filter((ps) => ps.paymentType === "PostPlacement")
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recruitersData = await getRecruiters();
        if (recruitersData && Array.isArray(recruitersData.$values)) {
          setRecruiters(recruitersData.$values);
        } else {
          console.error("getRecruiters did not return an array in $values:", recruitersData);
          setRecruiters([]);
        }
      } catch (error) {
        console.error("Failed to fetch recruiters:", error);
        setRecruiters([]);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const totalDue = subscriptionPaymentSchedule.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const totalPaid = postPlacementPaymentSchedule.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    setClientData((prevData) => ({
      ...prevData,
      totalDue,
      totalPaid,
      paymentSchedules: [
        ...subscriptionPaymentSchedule.map((ps) => ({
          ...ps,
          paymentDate: ps.paymentDate ? new Date(ps.paymentDate) : null,
          isPaid: ps.isPaid ?? false,
          paymentType: "Subscription" as const,
          paymentScheduleID: ps.paymentScheduleID || 0,
          createdTS: ps.createdTS || null,
          createdBy: ps.createdBy || null,
          updatedTS: ps.updatedTS || null,
          updatedBy: ps.updatedBy || null,
        })),
        ...postPlacementPaymentSchedule.map((ps) => ({
          ...ps,
          paymentDate: ps.paymentDate ? new Date(ps.paymentDate) : null,
          isPaid: ps.isPaid ?? false,
          paymentType: "PostPlacement" as const,
          paymentScheduleID: ps.paymentScheduleID || 0,
          createdTS: ps.createdTS || null,
          createdBy: ps.createdBy || null,
          updatedTS: ps.updatedTS || null,
          updatedBy: ps.updatedBy || null,
        })),
      ],
    }));
  }, [subscriptionPaymentSchedule, postPlacementPaymentSchedule]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const marketingEdit = permissions[userRole].marketingInfo.edit;
    const isEditable =
      userRole === "Admin" ||
      userRole === "Sales_Executive" ||
      (typeof marketingEdit === "object" && marketingEdit[name.split(".")[0]] && permissions[userRole].marketingInfo.view) ||
      (permissions[userRole].basicInfo.edit && Object.keys(client).includes(name.split(".")[0])) ||
      (permissions[userRole].subscriptionInfo.edit &&
        ["subscriptionPlan.planName", "subscriptionPlan.subscriptionPlanPaymentStartDate", "subscriptionPlan.totalSubscriptionAmount"].includes(name)) ||
      (permissions[userRole].postPlacementInfo.edit &&
        ["postPlacementPlan.planName", "postPlacementPlan.postPlacementPlanPaymentStartDate", "postPlacementPlan.totalPostPlacementAmount"].includes(name));
    if (isEditable) {
      setClientData((prevData) => {
        if (name.includes(".")) {
          const parts = name.split(".");
          if (parts.length !== 2) {
            console.warn(`Invalid nested field name: ${name}`);
            return prevData; // Return unchanged state for invalid names
          }
          const [prefix, field] = parts;
          const nestedValue = prevData[prefix as keyof ClientDetail];
          if (!nestedValue || typeof nestedValue !== "object") {
            console.warn(`Invalid prefix object for ${prefix}`);
            return prevData; // Safeguard against non-object prefix
          }
          const newValue =
            field === "subscriptionPlanPaymentStartDate" || field === "postPlacementPlanPaymentStartDate"
              ? parseDateForState(value)
              : value;
          return {
            ...prevData,
            [prefix]: {
              ...nestedValue,
              [field]: newValue,
            },
          };
        }
        return {
          ...prevData,
          [name]: value,
        };
      });
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string | number>) => {
    const name = event.target.name as keyof ClientDetail;
    const marketingEdit = permissions[userRole].marketingInfo.edit;
    const isEditable =
      userRole === "Admin" ||
      userRole === "Sales_Executive" ||
      (typeof marketingEdit === "object" && marketingEdit[name] && permissions[userRole].marketingInfo.view);
    if (isEditable) {
      const value = name === "assignedRecruiterID" ? Number(event.target.value) : event.target.value;
      setClientData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const addPaymentRow = (type: "subscription" | "postPlacement") => {
    const newPayment: PaymentSchedule = {
      paymentDate: null,
      amount: 0,
      isPaid: false,
      paymentType: type === "subscription" ? "Subscription" : "PostPlacement",
      clientID: client.clientID,
      subscriptionPlanID: type === "subscription" ? client.subscriptionPlanID : null,
      postPlacementPlanID: type === "postPlacement" ? client.postPlacementPlanID : null,
      paymentScheduleID: 0, // Default, will be set by backend
      createdTS: null,
      createdBy: null,
      updatedTS: null,
      updatedBy: null,
    };
    if (type === "subscription" && permissions[userRole].subscriptionInfo.edit) {
      setSubscriptionPaymentSchedule([...subscriptionPaymentSchedule, newPayment]);
    } else if (type === "postPlacement" && permissions[userRole].postPlacementInfo.edit) {
      setPostPlacementPaymentSchedule([...postPlacementPaymentSchedule, newPayment]);
    }
  };

  const removePaymentRow = (index: number, type: "subscription" | "postPlacement") => {
    if (type === "subscription" && permissions[userRole].subscriptionInfo.edit) {
      setSubscriptionPaymentSchedule(subscriptionPaymentSchedule.filter((_, i) => i !== index));
    } else if (type === "postPlacement" && permissions[userRole].postPlacementInfo.edit) {
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
        i === index
          ? {
              ...payment,
              [field]:
                field === "paymentDate"
                  ? parseDateForState(value as string)
                  : field === "amount"
                  ? Number(value)
                  : value,
            }
          : payment
      );
    if (type === "subscription" && permissions[userRole].subscriptionInfo.edit) {
      setSubscriptionPaymentSchedule(updater(subscriptionPaymentSchedule));
    } else if (type === "postPlacement" && permissions[userRole].postPlacementInfo.edit) {
      setPostPlacementPaymentSchedule(updater(postPlacementPaymentSchedule));
    }
  };

  const handleServiceAgreementChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setServiceAgreementFile(file);
    setServiceAgreementFileName(file ? file.name : "");
  };

  const handlePromissoryNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setPromissoryNoteFile(file);
    setPromissoryNoteFileName(file ? file.name : "");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canEdit) return;
    setIsLoading(true);
    try {
      const submitData: ClientDetail = {
        ...clientData,
        enrollmentDate: clientData.enrollmentDate ? new Date(clientData.enrollmentDate) : null,
        marketingStartDate: clientData.marketingStartDate ? new Date(clientData.marketingStartDate) : null,
        marketingEndDate: clientData.marketingEndDate ? new Date(clientData.marketingEndDate) : null,
        placedDate: clientData.placedDate ? new Date(clientData.placedDate) : null,
        backedOutDate: clientData.backedOutDate ? new Date(clientData.backedOutDate) : null,
        paymentSchedules: [
          ...subscriptionPaymentSchedule,
          ...postPlacementPaymentSchedule,
        ].map((ps) => ({
          ...ps,
          paymentDate: ps.paymentDate ? new Date(ps.paymentDate) : null,
          createdTS: ps.createdTS ? new Date(ps.createdTS) : null,
          updatedTS: ps.updatedTS ? new Date(ps.updatedTS) : null,
        })),
      };
      await updateClient(client.clientID, submitData, serviceAgreementFile, promissoryNoteFile);
      router.push(`/clients/${client.clientID}`);
      router.refresh();
    } catch (error) {
      console.error("Failed to update client:", error);
      alert("Failed to update client. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, "& .MuiCard-root": { height: "100%" } }}>
      <Grid container spacing={0.5}>
        {permissions[userRole].basicInfo.view && (
          <Grid item xs={12} md={6} sx={{ mb: 1 }}>
            <Card>
              <CardContent sx={{ p: 1.5 }}>
                <Typography variant="h6" gutterBottom>Basic Information</Typography>
                <Grid container spacing={0.5}>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      required
                      fullWidth
                      id="clientName"
                      name="clientName"
                      label="Client Name"
                      value={clientData.clientName || ""}
                      onChange={handleInputChange}
                      size="small"
                      disabled={!permissions[userRole].basicInfo.edit}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="enrollmentDate"
                      name="enrollmentDate"
                      label="Enrollment Date"
                      type="date"
                      value={formatDateForInput(clientData.enrollmentDate) || ""}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      disabled={!permissions[userRole].basicInfo.edit}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="techStack"
                      name="techStack"
                      label="Tech Stack"
                      value={clientData.techStack || ""}
                      onChange={handleInputChange}
                      size="small"
                      disabled={!permissions[userRole].basicInfo.edit}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="visaStatus"
                      name="visaStatus"
                      label="Visa Status"
                      value={clientData.visaStatus || ""}
                      onChange={handleInputChange}
                      size="small"
                      disabled={!permissions[userRole].basicInfo.edit}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="personalPhoneNumber"
                      name="personalPhoneNumber"
                      label="Personal Phone Number"
                      value={clientData.personalPhoneNumber || ""}
                      onChange={handleInputChange}
                      size="small"
                      disabled={!permissions[userRole].basicInfo.edit}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="personalEmailAddress"
                      name="personalEmailAddress"
                      label="Personal Email Address"
                      type="email"
                      value={clientData.personalEmailAddress || ""}
                      onChange={handleInputChange}
                      size="small"
                      disabled={!permissions[userRole].basicInfo.edit}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="linkedInURL"
                      name="linkedInURL"
                      label="LinkedIn URL"
                      value={clientData.linkedInURL || ""}
                      onChange={handleInputChange}
                      size="small"
                      disabled={!permissions[userRole].basicInfo.edit}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {permissions[userRole].marketingInfo.view && (
          <Grid item xs={12} md={6} sx={{ mb: 1 }}>
            <Card>
              <CardContent sx={{ p: 1.5 }}>
                <Typography variant="h6" gutterBottom>Marketing & Status Information</Typography>
                <Grid container spacing={0.5}>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="marketingStartDate"
                      name="marketingStartDate"
                      label="Marketing Start Date"
                      type="date"
                      value={formatDateForInput(clientData.marketingStartDate) || ""}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      disabled={
                        typeof permissions[userRole].marketingInfo.edit === "object" &&
                        !permissions[userRole].marketingInfo.edit.marketingStartDate
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="marketingEndDate"
                      name="marketingEndDate"
                      label="Marketing End Date"
                      type="date"
                      value={formatDateForInput(clientData.marketingEndDate) || ""}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      disabled={
                        typeof permissions[userRole].marketingInfo.edit === "object" &&
                        !permissions[userRole].marketingInfo.edit.marketingEndDate
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="marketingEmailID"
                      name="marketingEmailID"
                      label="Marketing Email ID"
                      type="email"
                      value={clientData.marketingEmailID || ""}
                      onChange={handleInputChange}
                      size="small"
                      disabled={
                        typeof permissions[userRole].marketingInfo.edit === "object" &&
                        !permissions[userRole].marketingInfo.edit.marketingEmailID
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="marketingEmailPassword"
                      name="marketingEmailPassword"
                      label="Marketing Email Password"
                      type={showPassword ? "text" : "password"}
                      value={clientData.marketingEmailPassword || ""}
                      onChange={handleInputChange}
                      size="small"
                      disabled={
                        typeof permissions[userRole].marketingInfo.edit === "object" &&
                        !permissions[userRole].marketingInfo.edit.marketingEmailPassword
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ mb: 1 }}>
                    <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                      <InputLabel id="assignedRecruiterID-label">Assigned Recruiter</InputLabel>
                      <Select
                        labelId="assignedRecruiterID-label"
                        id="assignedRecruiterID"
                        name="assignedRecruiterID"
                        label="Assigned Recruiter"
                        value={clientData.assignedRecruiterID ?? ""}
                        onChange={handleSelectChange}
                        size="small"
                        disabled={
                          typeof permissions[userRole].marketingInfo.edit === "object" &&
                          !permissions[userRole].marketingInfo.edit.assignedRecruiterID
                        }
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
                    <FormControl fullWidth required size="small" sx={{ mt: 1 }}>
                      <InputLabel id="clientStatus-label">Client Status</InputLabel>
                      <Select
                        labelId="clientStatus-label"
                        id="clientStatus"
                        name="clientStatus"
                        label="Client Status"
                        value={clientData.clientStatus ?? "Active"}
                        onChange={handleSelectChange}
                        size="small"
                        disabled={
                          typeof permissions[userRole].marketingInfo.edit === "object" &&
                          !permissions[userRole].marketingInfo.edit.clientStatus
                        }
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Placed">Placed</MenuItem>
                        <MenuItem value="Backed Out">Backed Out</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="placedDate"
                      name="placedDate"
                      label="Placed Date"
                      type="date"
                      value={formatDateForInput(clientData.placedDate) || ""}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      disabled={
                        typeof permissions[userRole].marketingInfo.edit === "object" &&
                        !permissions[userRole].marketingInfo.edit.placedDate
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="backedOutDate"
                      name="backedOutDate"
                      label="Backed Out Date"
                      type="date"
                      value={formatDateForInput(clientData.backedOutDate) || ""}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      disabled={
                        typeof permissions[userRole].marketingInfo.edit === "object" &&
                        !permissions[userRole].marketingInfo.edit.backedOutDate
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="backedOutReason"
                      name="backedOutReason"
                      label="Backed Out Reason"
                      value={clientData.backedOutReason || ""}
                      onChange={handleInputChange}
                      size="small"
                      disabled={
                        typeof permissions[userRole].marketingInfo.edit === "object" &&
                        !permissions[userRole].marketingInfo.edit.backedOutReason
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {permissions[userRole].subscriptionInfo.view && (
          <Grid item xs={12} md={6} sx={{ mb: 1 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 1.5 }}>
                <Typography variant="h6" gutterBottom>Subscription Information</Typography>
                <Grid container spacing={0.5}>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="subscriptionPlanName"
                      label="Subscription Plan Name"
                      value={subscriptionPlanName}
                      onChange={(e) => setSubscriptionPlanName(e.target.value)}
                      size="small"
                      disabled={!permissions[userRole].subscriptionInfo.edit}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="subscriptionStartDate"
                      label="Payment Start Date"
                      type="date"
                      value={subscriptionStartDate || ""}
                      onChange={(e) => setSubscriptionStartDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      disabled={!permissions[userRole].subscriptionInfo.edit}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="totalDue"
                      name="totalDue"
                      label="Total Due"
                      type="number"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        readOnly: true,
                      }}
                      value={clientData.totalDue.toFixed(2)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ mb: 1 }}>
                    {clientData.serviceAgreementUrl ? (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Link
                          href={clientData.serviceAgreementUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ textDecoration: "underline", color: "primary.main" }}
                        >
                          View Current Service Agreement
                        </Link>
                        {permissions[userRole].subscriptionInfo.edit && (
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Button
                              component="label"
                              variant="outlined"
                              startIcon={<CloudUploadIcon />}
                              sx={{ width: "100%" }}
                            >
                              Upload New Service Agreement
                              <VisuallyHiddenInput
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleServiceAgreementChange}
                              />
                            </Button>
                            {serviceAgreementFileName && (
                              <Typography variant="body2" color="textSecondary">
                                Selected: {serviceAgreementFileName}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<CloudUploadIcon />}
                          sx={{ width: "100%" }}
                          disabled={!permissions[userRole].subscriptionInfo.edit}
                        >
                          Upload Service Agreement
                          <VisuallyHiddenInput
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleServiceAgreementChange}
                          />
                        </Button>
                        {serviceAgreementFileName && (
                          <Typography variant="body2" color="textSecondary">
                            Selected: {serviceAgreementFileName}
                          </Typography>
                        )}
                      </Box>
                    )}
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
                              value={formatDateForInput(payment.paymentDate) || ""}
                              onChange={(e) =>
                                updatePaymentSchedule(index, "paymentDate", e.target.value, "subscription")
                              }
                              InputLabelProps={{ shrink: true }}
                              size="small"
                              disabled={!permissions[userRole].subscriptionInfo.edit}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              type="number"
                              value={payment.amount === 0 ? "" : payment.amount}
                              onChange={(e) =>
                                updatePaymentSchedule(index, "amount", e.target.value, "subscription")
                              }
                              InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                              }}
                              size="small"
                              disabled={!permissions[userRole].subscriptionInfo.edit}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => removePaymentRow(index, "subscription")}
                              color="error"
                              size="small"
                              disabled={!permissions[userRole].subscriptionInfo.edit}
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
                  sx={{ mt: 2, color: "yellow" }}
                  disabled={!permissions[userRole].subscriptionInfo.edit}
                >
                  Add
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        {permissions[userRole].postPlacementInfo.view && (
          <Grid item xs={12} md={6} sx={{ mb: 1 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 1.5 }}>
                <Typography variant="h6" gutterBottom>Post-Placement Information</Typography>
                <Grid container spacing={0.5}>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="postPlacementPlanName"
                      label="Post Placement Plan Name"
                      value={postPlacementPlanName}
                      onChange={(e) => setPostPlacementPlanName(e.target.value)}
                      size="small"
                      disabled={!permissions[userRole].postPlacementInfo.edit}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="postPlacementStartDate"
                      label="Payment Start Date"
                      type="date"
                      value={postPlacementStartDate || ""}
                      onChange={(e) => setPostPlacementStartDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      disabled={!permissions[userRole].postPlacementInfo.edit}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="totalPaid"
                      name="totalPaid"
                      label="Total Paid"
                      type="number"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        readOnly: true,
                      }}
                      value={clientData.totalPaid.toFixed(2)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ mb: 1 }}>
                    {clientData.promissoryNoteUrl ? (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Link
                          href={clientData.promissoryNoteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ textDecoration: "underline", color: "primary.main" }}
                        >
                          View Current Promissory Note
                        </Link>
                        {permissions[userRole].postPlacementInfo.edit && (
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Button
                              component="label"
                              variant="outlined"
                              startIcon={<CloudUploadIcon />}
                              sx={{ width: "100%" }}
                            >
                              Upload New Promissory Note
                              <VisuallyHiddenInput
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handlePromissoryNoteChange}
                              />
                            </Button>
                            {promissoryNoteFileName && (
                              <Typography variant="body2" color="textSecondary">
                                Selected: {promissoryNoteFileName}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<CloudUploadIcon />}
                          sx={{ width: "100%" }}
                          disabled={!permissions[userRole].postPlacementInfo.edit}
                        >
                          Upload Promissory Note
                          <VisuallyHiddenInput
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handlePromissoryNoteChange}
                          />
                        </Button>
                        {promissoryNoteFileName && (
                          <Typography variant="body2" color="textSecondary">
                            Selected: {promissoryNoteFileName}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Grid>
                </Grid>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Post-Placement Payment Schedule
                </Typography>
                <TableContainer component={Paper} sx={{ mt: 2}}>
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
                              value={formatDateForInput(payment.paymentDate) || ""}
                              onChange={(e) =>
                                updatePaymentSchedule(index, "paymentDate", e.target.value, "postPlacement")
                              }
                              InputLabelProps={{ shrink: true }}
                              size="small"
                              disabled={!permissions[userRole].postPlacementInfo.edit}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              type="number"
                              value={payment.amount === 0 ? "" : payment.amount}
                              onChange={(e) =>
                                updatePaymentSchedule(index, "amount", e.target.value, "postPlacement")
                              }
                              InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                              }}
                              size="small"
                              disabled={!permissions[userRole].postPlacementInfo.edit}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => removePaymentRow(index, "postPlacement")}
                              color="error"
                              size="small"
                              disabled={!permissions[userRole].postPlacementInfo.edit}
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
                  sx={{ mt: 2, color: "yellow" }}
                  disabled={!permissions[userRole].postPlacementInfo.edit}
                >
                  Add
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        {canEdit && (
          <Grid item xs={12} sx={{ mb: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
              <Button onClick={() => router.push("/clients")} variant="outlined">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}