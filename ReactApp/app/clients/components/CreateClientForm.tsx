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
<<<<<<< HEAD
  Alert,
=======
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
<<<<<<< HEAD
  Visibility,
  VisibilityOff,
=======
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
} from "@mui/icons-material";
import { createClient, getRecruiters } from "../actions/clientActions";
import type {
  Client,
  Employee,
  SubscriptionPlan,
  PostPlacementPlan,
<<<<<<< HEAD
  PaymentSchedule,
} from "../../types/Clients/Client";
import { styled } from "@mui/material/styles";
import { useAuth } from "@/contexts/authContext";
import permissions from "../../utils/permissions";

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

// Format Date for input (string in yyyy-MM-dd format)
const formatDateForInput = (date: Date | string | null | undefined): string => {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
};

// Parse input string to Date for state
const parseDateForState = (dateStr: string | null): Date | null => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
};

export default function CreateClientForm() {
  const router = useRouter();
  const { roles } = useAuth();
  const [recruiters, setRecruiters] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serviceAgreementFile, setServiceAgreementFile] = useState<File | null>(
    null
  );
  const [promissoryNoteFile, setPromissoryNoteFile] = useState<File | null>(
    null
  );
  const [serviceAgreementFileName, setServiceAgreementFileName] =
    useState<string>("");
  const [promissoryNoteFileName, setPromissoryNoteFileName] =
    useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Initialize state with Client type and proper defaults
  const initialClientData: Client = {
    clientID: 0,
    clientName: "",
    enrollmentDate: null,
    techStack: "",
    personalPhoneNumber: "",
    personalEmailAddress: "",
    assignedRecruiterID: null,
    assignedRecruiterName: "",
    visaStatus: "",
    linkedInURL: "",
    clientStatus: "Active",
    subscriptionPlanID: null,
    totalDue: 0.0,
    totalPaid: 0.0,
    postPlacementPlanID: null,
    marketingStartDate: null,
    marketingEndDate: null,
    marketingEmailID: "",
    marketingEmailPassword: "",
    placedDate: null,
    backedOutDate: null,
    backedOutReason: "",
    paymentSchedules: [],
    serviceAgreementUrl: null,
    promissoryNoteUrl: null,
    subscriptionPlan: {
      subscriptionPlanID: 0,
      planName: "",
      serviceAgreementUrl: null,
      subscriptionPlanPaymentStartDate: null,
      totalSubscriptionAmount: null,
      createdTS: null,
      createdBy: null,
      updatedTS: null,
      updatedBy: null,
    },
    postPlacementPlan: {
      postPlacementPlanID: 0,
      planName: "",
      promissoryNoteUrl: null,
      postPlacementPlanPaymentStartDate: null,
      totalPostPlacementAmount: null,
      createdTS: null,
      createdBy: null,
      updatedTS: null,
      updatedBy: null,
    },
  };

  const [clientData, setClientData] = useState<Client>(initialClientData);
  const [subscriptionPaymentSchedule, setSubscriptionPaymentSchedule] =
    useState<PaymentSchedule[]>([]);
  const [postPlacementPaymentSchedule, setPostPlacementPaymentSchedule] =
    useState<PaymentSchedule[]>([]);

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
    const fetchData = async () => {
      try {
        const recruitersData = await getRecruiters();
        if (recruitersData && Array.isArray(recruitersData.$values)) {
          setRecruiters(recruitersData.$values);
        } else {
          console.error(
            "getRecruiters did not return an array in $values:",
            recruitersData
          );
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
    const totalDue = subscriptionPaymentSchedule.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );
    const totalPaid = postPlacementPaymentSchedule.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );
    setClientData((prevData) => ({
      ...prevData,
      totalDue,
      totalPaid,
      paymentSchedules: [
        ...subscriptionPaymentSchedule.map((ps) => ({
          ...ps,
          paymentType: "Subscription" as const,
          paymentScheduleID: 0,
          clientID: 0,
          createdTS: null,
          createdBy: null,
          updatedTS: null,
          updatedBy: null,
        })),
        ...postPlacementPaymentSchedule.map((ps) => ({
          ...ps,
          paymentType: "PostPlacement" as const,
          paymentScheduleID: 0,
          clientID: 0,
          createdTS: null,
          createdBy: null,
          updatedTS: null,
          updatedBy: null,
        })),
      ],
    }));
  }, [subscriptionPaymentSchedule, postPlacementPaymentSchedule]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const marketingEdit = permissions.clients[userRole].marketingInfo.edit;
    const isEditable =
      userRole === "Admin" ||
      userRole === "Sales_Executive" ||
      (typeof marketingEdit === "object" &&
        marketingEdit[name] &&
        permissions.clients[userRole].marketingInfo.view) ||
      (permissions.clients[userRole].basicInfo.edit &&
        Object.keys(initialClientData).includes(name)) ||
      (permissions.clients[userRole].subscriptionInfo.edit &&
        [
          "subscriptionPlan.planName",
          "subscriptionPlan.subscriptionPlanPaymentStartDate",
          "subscriptionPlan.totalSubscriptionAmount",
        ].includes(name)) ||
      (permissions.clients[userRole].postPlacementInfo.edit &&
        [
          "postPlacementPlan.planName",
          "postPlacementPlan.postPlacementPlanPaymentStartDate",
          "postPlacementPlan.totalPostPlacementAmount",
        ].includes(name));
    if (isEditable) {
      setClientData((prevData) => {
        if (name.includes(".")) {
          const parts = name.split(".");
          if (parts.length !== 2) {
            console.warn(`Invalid nested field name: ${name}`);
            return prevData; // Return unchanged state for invalid names
          }
          const [prefix, field] = parts;
          const nestedValue = prevData[prefix as keyof Client];
          if (!nestedValue || typeof nestedValue !== "object") {
            console.warn(`Invalid prefix object for ${prefix}`);
            return prevData; // Safeguard against non-object prefix
          }
          const newValue =
            field === "subscriptionPlanPaymentStartDate" ||
            field === "postPlacementPlanPaymentStartDate"
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
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string | number>) => {
    const name = event.target.name as keyof Client;
    const marketingEdit = permissions.clients[userRole].marketingInfo.edit;
    const isEditable =
      userRole === "Admin" ||
      userRole === "Sales_Executive" ||
      (typeof marketingEdit === "object" &&
        marketingEdit[name] &&
        permissions.clients[userRole].marketingInfo.view);
    if (isEditable) {
      const value = event.target.value as string | number;
      setClientData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const addPaymentRow = (type: "subscription" | "postPlacement") => {
    const newPayment: PaymentSchedule = {
      paymentDate: null,
      amount: 0,
      paymentType: type === "subscription" ? "Subscription" : "PostPlacement",
      paymentScheduleID: 0,
      clientID: 0,
      subscriptionPlanID: null,
      postPlacementPlanID: null,
      createdTS: null,
      createdBy: null,
      updatedTS: null,
      updatedBy: null,
      isPaid: false
    };
    if (
      type === "subscription" &&
      permissions.clients[userRole].subscriptionInfo.edit
    ) {
      setSubscriptionPaymentSchedule([
        ...subscriptionPaymentSchedule,
        newPayment,
      ]);
    } else if (
      type === "postPlacement" &&
      permissions.clients[userRole].postPlacementInfo.edit
    ) {
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
    if (
      type === "subscription" &&
      permissions.clients[userRole].subscriptionInfo.edit
    ) {
      setSubscriptionPaymentSchedule(
        subscriptionPaymentSchedule.filter((_, i) => i !== index)
      );
    } else if (
      type === "postPlacement" &&
      permissions.clients[userRole].postPlacementInfo.edit
    ) {
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
    if (
      type === "subscription" &&
      permissions.clients[userRole].subscriptionInfo.edit
    ) {
      setSubscriptionPaymentSchedule(updater(subscriptionPaymentSchedule));
    } else if (
      type === "postPlacement" &&
      permissions.clients[userRole].postPlacementInfo.edit
    ) {
      setPostPlacementPaymentSchedule(updater(postPlacementPaymentSchedule));
    }
  };

  const handleServiceAgreementChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    setServiceAgreementFile(file);
    setServiceAgreementFileName(file ? file.name : "");
  };

  const handlePromissoryNoteChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    setPromissoryNoteFile(file);
    setPromissoryNoteFileName(file ? file.name : "");
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!clientData.clientName.trim())
      newErrors.clientName = "Client Name is required";
    if (!clientData.enrollmentDate)
      newErrors.enrollmentDate = "Enrollment Date is required";
    if (
      !clientData.marketingStartDate &&
      typeof permissions.clients[userRole].marketingInfo.edit === "object" &&
      permissions.clients[userRole].marketingInfo.edit.marketingStartDate
    )
      newErrors.marketingStartDate = "Marketing Start Date is required";
    if (
      clientData.personalEmailAddress &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.personalEmailAddress)
    )
      newErrors.personalEmailAddress = "Invalid email format";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const submitData: Client = {
        ...clientData,
        enrollmentDate: clientData.enrollmentDate
          ? new Date(clientData.enrollmentDate)
          : null,
        marketingStartDate: clientData.marketingStartDate
          ? new Date(clientData.marketingStartDate)
          : null,
        marketingEndDate: clientData.marketingEndDate
          ? new Date(clientData.marketingEndDate)
          : null,
        placedDate: clientData.placedDate
          ? new Date(clientData.placedDate)
          : null,
        backedOutDate: clientData.backedOutDate
          ? new Date(clientData.backedOutDate)
          : null,
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
      const success = await createClient(submitData, serviceAgreementFile, promissoryNoteFile);
      if (success) {
        // Redirect to client search page and refresh data
        router.push("/clients"); // Adjust the route as needed
        router.refresh(); // Optional: Refresh the page to load updated data
      }
    } catch (error) {
      console.error("Failed to create client:", error);
      alert("Failed to create client. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ mt: 1, "& .MuiCard-root": { height: "100%" } }}
    >
      <Grid container spacing={0.5}>
        {permissions.clients[userRole].basicInfo.view && (
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
                      id="clientName"
                      name="clientName"
                      label="Client Name"
                      value={clientData.clientName || ""}
                      onChange={handleInputChange}
                      size="small"
                      disabled={!permissions.clients[userRole].basicInfo.edit}
                      error={!!errors.clientName}
                      helperText={errors.clientName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="enrollmentDate"
                      name="enrollmentDate"
                      label="Enrollment Date"
                      type="date"
                      value={
                        formatDateForInput(clientData.enrollmentDate) || ""
                      }
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      disabled={!permissions.clients[userRole].basicInfo.edit}
                      error={!!errors.enrollmentDate}
                      helperText={errors.enrollmentDate}
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
                      disabled={!permissions.clients[userRole].basicInfo.edit}
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
                      disabled={!permissions.clients[userRole].basicInfo.edit}
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
                      disabled={!permissions.clients[userRole].basicInfo.edit}
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
                      disabled={!permissions.clients[userRole].basicInfo.edit}
                      error={!!errors.personalEmailAddress}
                      helperText={errors.personalEmailAddress}
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
                      disabled={!permissions.clients[userRole].basicInfo.edit}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {permissions.clients[userRole].marketingInfo.view && (
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
                      id="marketingStartDate"
                      name="marketingStartDate"
                      label="Marketing Start Date"
                      type="date"
                      value={
                        formatDateForInput(clientData.marketingStartDate) || ""
                      }
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      disabled={
                        typeof permissions.clients[userRole].marketingInfo
                          .edit === "object" &&
                        !permissions.clients[userRole].marketingInfo.edit
                          .marketingStartDate
                      }
                      error={!!errors.marketingStartDate}
                      helperText={errors.marketingStartDate}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="marketingEndDate"
                      name="marketingEndDate"
                      label="Marketing End Date"
                      type="date"
                      value={
                        formatDateForInput(clientData.marketingEndDate) || ""
                      }
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      disabled={
                        typeof permissions.clients[userRole].marketingInfo
                          .edit === "object" &&
                        !permissions.clients[userRole].marketingInfo.edit
                          .marketingEndDate
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
                        typeof permissions.clients[userRole].marketingInfo
                          .edit === "object" &&
                        !permissions.clients[userRole].marketingInfo.edit
                          .marketingEmailID
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
                        typeof permissions.clients[userRole].marketingInfo
                          .edit === "object" &&
                        !permissions.clients[userRole].marketingInfo.edit
                          .marketingEmailPassword
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ mb: 1 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="assignedRecruiterID-label">
                        Assigned Recruiter
                      </InputLabel>
                      <Select
                        labelId="assignedRecruiterID-label"
                        id="assignedRecruiterID"
                        name="assignedRecruiterID"
                        label="Assigned Recruiter"
                        value={clientData.assignedRecruiterID ?? ""}
                        onChange={handleSelectChange}
                        size="small"
                        disabled={
                          typeof permissions.clients[userRole].marketingInfo
                            .edit === "object" &&
                          !permissions.clients[userRole].marketingInfo.edit
                            .assignedRecruiterID
                        }
                      >
                        {Array.isArray(recruiters) && recruiters.length > 0 ? (
                          recruiters.map((recruiter) => (
                            <MenuItem
                              key={recruiter.employeeID}
                              value={recruiter.employeeID}
                            >
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
                      <InputLabel id="clientStatus-label">
                        Client Status
                      </InputLabel>
                      <Select
                        labelId="clientStatus-label"
                        id="clientStatus"
                        name="clientStatus"
                        label="Client Status"
                        value={clientData.clientStatus || "Active"}
                        onChange={handleSelectChange}
                        size="small"
                        disabled={
                          typeof permissions.clients[userRole].marketingInfo
                            .edit === "object" &&
                          !permissions.clients[userRole].marketingInfo.edit
                            .clientStatus
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
                        typeof permissions.clients[userRole].marketingInfo
                          .edit === "object" &&
                        !permissions.clients[userRole].marketingInfo.edit
                          .placedDate
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
                        typeof permissions.clients[userRole].marketingInfo
                          .edit === "object" &&
                        !permissions.clients[userRole].marketingInfo.edit
                          .backedOutDate
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
                        typeof permissions.clients[userRole].marketingInfo
                          .edit === "object" &&
                        !permissions.clients[userRole].marketingInfo.edit
                          .backedOutReason
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {permissions.clients[userRole].subscriptionInfo.view && (
          <Grid item xs={12} md={6} sx={{ mb: 1 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 1.5 }}>
                <Typography variant="h6" gutterBottom>
                  Subscription Information
                </Typography>
                <Grid container spacing={0.5}>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="subscriptionPlan.planName"
                      name="subscriptionPlan.planName"
                      label="Subscription Plan Name"
                      value={clientData.subscriptionPlan?.planName || ""}
                      onChange={handleInputChange}
                      size="small"
                      disabled={
                        !permissions.clients[userRole].subscriptionInfo.edit
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={3} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="subscriptionPlan.subscriptionPlanPaymentStartDate"
                      name="subscriptionPlan.subscriptionPlanPaymentStartDate"
                      label="Payment Start Date"
                      type="date"
                      value={
                        formatDateForInput(
                          clientData.subscriptionPlan
                            ?.subscriptionPlanPaymentStartDate
                        ) || ""
                      }
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      disabled={
                        !permissions.clients[userRole].subscriptionInfo.edit
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={3} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="subscriptionPlan.totalSubscriptionAmount"
                      name="subscriptionPlan.totalSubscriptionAmount"
                      label="Total Subscription Amount"
                      type="number"
                      value={
                        clientData.subscriptionPlan?.totalSubscriptionAmount ||
                        0
                      }
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      size="small"
                      disabled={
                        !permissions.clients[userRole].subscriptionInfo.edit
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ mb: 1 }}>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        sx={{ width: "100%" }}
                        disabled={
                          !permissions.clients[userRole].subscriptionInfo.edit
                        }
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
                              value={
                                formatDateForInput(payment.paymentDate) || ""
                              }
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
                              disabled={
                                !permissions.clients[userRole].subscriptionInfo
                                  .edit
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              type="number"
                              value={payment.amount === 0 ? "" : payment.amount}
                              onChange={(e) =>
                                updatePaymentSchedule(
                                  index,
                                  "amount",
                                  e.target.value,
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
                              disabled={
                                !permissions.clients[userRole].subscriptionInfo
                                  .edit
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() =>
                                removePaymentRow(index, "subscription")
                              }
                              color="error"
                              size="small"
                              disabled={
                                !permissions.clients[userRole].subscriptionInfo
                                  .edit
                              }
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
                  disabled={
                    !permissions.clients[userRole].subscriptionInfo.edit
                  }
                >
                  Add
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        {permissions.clients[userRole].postPlacementInfo.view &&
          clientData.clientStatus === "Placed" && (
            <Grid item xs={12} md={6} sx={{ mb: 1 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ p: 1.5 }}>
                  <Typography variant="h6" gutterBottom>
                    Post-Placement Information
                  </Typography>
                  <Grid container spacing={0.5}>
                    <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                      <TextField
                        fullWidth
                        id="postPlacementPlan.planName"
                        name="postPlacementPlan.planName"
                        label="Post Placement Plan Name"
                        value={clientData.postPlacementPlan?.planName || ""}
                        onChange={handleInputChange}
                        size="small"
                        disabled={
                          !permissions.clients[userRole].postPlacementInfo.edit
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={3} sx={{ mb: 1 }}>
                      <TextField
                        fullWidth
                        id="postPlacementPlan.postPlacementPlanPaymentStartDate"
                        name="postPlacementPlan.postPlacementPlanPaymentStartDate"
                        label="Payment Start Date"
                        type="date"
                        value={
                          formatDateForInput(
                            clientData.postPlacementPlan
                              ?.postPlacementPlanPaymentStartDate
                          ) || ""
                        }
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                        disabled={
                          !permissions.clients[userRole].postPlacementInfo.edit
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={3} sx={{ mb: 1 }}>
                      <TextField
                        fullWidth
                        id="postPlacementPlan.totalPostPlacementAmount"
                        name="postPlacementPlan.totalPostPlacementAmount"
                        label="Total Post Placement Amount"
                        type="number"
                        value={
                          clientData.postPlacementPlan
                            ?.totalPostPlacementAmount || 0
                        }
                        onChange={handleInputChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        size="small"
                        disabled={
                          !permissions.clients[userRole].postPlacementInfo.edit
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ mb: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<CloudUploadIcon />}
                          sx={{ width: "100%" }}
                          disabled={
                            !permissions.clients[userRole].postPlacementInfo
                              .edit
                          }
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
                                value={
                                  formatDateForInput(payment.paymentDate) || ""
                                }
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
                                disabled={
                                  !permissions.clients[userRole]
                                    .postPlacementInfo.edit
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                type="number"
                                value={
                                  payment.amount === 0 ? "" : payment.amount
                                }
                                onChange={(e) =>
                                  updatePaymentSchedule(
                                    index,
                                    "amount",
                                    e.target.value,
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
                                disabled={
                                  !permissions.clients[userRole]
                                    .postPlacementInfo.edit
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() =>
                                  removePaymentRow(index, "postPlacement")
                                }
                                color="error"
                                size="small"
                                disabled={
                                  !permissions.clients[userRole]
                                    .postPlacementInfo.edit
                                }
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
                    disabled={
                      !permissions.clients[userRole].postPlacementInfo.edit
                    }
                  >
                    Add
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}

        {/* {Object.keys(errors).length > 0 && (
          <Grid item xs={12} sx={{ mb: 1 }}>
            <Alert severity="error">
              Please fix the following errors:{" "}
              {Object.values(errors).join(", ")}
            </Alert>
          </Grid>
        )} */}

        <Grid item xs={12} sx={{ mb: 1 }}>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
          >
            <Button onClick={() => router.push("/clients")} variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
            >
=======
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
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
              {isLoading ? "Creating..." : "Create Client"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
