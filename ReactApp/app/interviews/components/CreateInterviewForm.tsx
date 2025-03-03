"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Autocomplete,
  TextField as MUITextField,
} from "@mui/material";
import { useAuth } from "@/contexts/authContext";
import permissions from "../../utils/permissions";
import type { InterviewDetail } from "@/app/types/interviews/interviewDetail";
import { SelectChangeEvent } from "@mui/material/Select";
import { getClientsForRecruiterId } from "@/app/clients/actions/clientActions";
import { createInterview } from "../actions/interviewActions";
import { ClientList } from "@/app/types/Clients/ClientList";
import { getRecruiters } from "@/app/employees/actions/employeeActions";
import { Recruiter } from "@/app/types/employees/recruiter";
import interviewDropdowns from "../../utils/interviewDropdowns.json";

interface CreateInterviewFormProps {
  onSubmit?: (data: InterviewDetail) => void;
}

export default function CreateInterviewForm({ onSubmit }: CreateInterviewFormProps) {
  const [formData, setFormData] = useState<InterviewDetail>({
    InterviewID: 0,
    InterviewEntryDate: null,
    RecruiterID: null,
    RecruiterName: null,
    InterviewDate: null,
    InterviewStartTime: null,
    InterviewEndTime: null,
    ClientID: null,
    ClientName: null,
    InterviewType: null,
    InterviewMethod: null,
    Technology: null,
    InterviewFeedback: null,
    InterviewStatus: null,
    InterviewSupport: null,
    Comments: null,
    CreatedDate: new Date().toISOString(),
    ModifiedDate: new Date().toISOString(),
    EndClientName: null,
    CreatedTS: null,
    UpdatedTS: null,
  });
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [clients, setClients] = useState<ClientList[]>([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { isAuthenticated, roles } = useAuth();

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
        : roles.includes("Resume_Writer")
        ? "Resume_Writer"
        : "default"
      : "default";

  const canCreate = isAuthenticated && permissions.interviews[userRole]?.addInterview === true;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!canCreate) {
      setError("Unauthorized: You do not have permission to create interviews.");
      return;
    }

    const fetchRecruiters = async () => {
      try {
        const recruitersData = await getRecruiters();
        const recruiterList = Array.isArray(recruitersData.$values) ? recruitersData.$values : [];
        const mappedRecruiters: Recruiter[] = recruiterList
          .map((recruiter: Recruiter) => ({
            employeeID: recruiter.employeeID,
            firstName: recruiter.firstName || "Unknown",
            lastName: recruiter.lastName || "Recruiter",
          }))
          .filter((recruiter) => recruiter.employeeID !== undefined);
        setRecruiters(mappedRecruiters);
      } catch (error) {
        console.error("Failed to fetch recruiters:", error);
        setRecruiters([]);
      }
    };
    fetchRecruiters();
  }, [isAuthenticated, router, userRole, canCreate]);

  useEffect(() => {
    if (formData.RecruiterID) {
      setShowClientDropdown(true);
      const fetchClients = async () => {
        try {
          setIsLoading(true);
          const clientData = await getClientsForRecruiterId(formData.RecruiterID as number);
          const mappedClients: ClientList[] = clientData.$values
            .map((client: ClientList) => ({
              clientID: client.clientID,
              clientName: client.clientName || "Unknown Client",
              enrollmentDate: client.enrollmentDate || null,
              techStack: client.techStack || null,
              clientStatus: client.clientStatus || null,
              salesPerson: client.salesPerson || null,
              assignedRecruiterName: client.assignedRecruiterName || null,
            }))
            .filter((client) => client.clientID !== undefined);
          setClients(mappedClients);
        } catch (error) {
          console.error("Failed to fetch clients for recruiter:", error);
          setClients([]);
          setError("Failed to load clients. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchClients();
    } else {
      setClients([]);
      setShowClientDropdown(false);
    }
  }, [formData.RecruiterID]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (canCreate) {
      setFormData((prevData) => ({
        ...prevData,
        [name as keyof InterviewDetail]: value === "" ? null : value,
      }));
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string>, child?: ReactNode) => {
    const { name, value } = event.target as { name?: string; value: unknown };
    if (name && canCreate) {
      const processedValue =
        name === "RecruiterID" || name === "ClientID"
          ? value === "" ? null : Number(value)
          : value === "" ? null : value;
      setFormData((prevData) => ({
        ...prevData,
        [name as keyof InterviewDetail]: processedValue,
      }));
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAutocompleteChange = (name: string, value: number | string | null) => {
    if (canCreate) {
      let processedValue: number | string | null = null;
      if (name === "RecruiterID" || name === "ClientID") {
        processedValue = typeof value === "number" ? value : value === "" ? null : Number(value);
      } else {
        processedValue = value === "" ? null : (value as string);
      }
      setFormData((prevData) => ({
        ...prevData,
        [name as keyof InterviewDetail]: processedValue,
      }));
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.InterviewDate) newErrors.InterviewDate = "Interview Date is required";
    if (!formData.InterviewType) newErrors.InterviewType = "Interview Type is required";
    if (!formData.InterviewStatus) newErrors.InterviewStatus = "Interview Status is required";
    if (!formData.RecruiterID) newErrors.RecruiterID = "Recruiter must be selected";
    if (!formData.ClientID) newErrors.ClientID = "Client must be selected";
    if (!formData.InterviewStartTime || !formData.InterviewEndTime)
      newErrors.InterviewStartTime = "Start and End Times are required";
    if (!formData.InterviewMethod) newErrors.InterviewMethod = "Interview Method is required";
    if (!formData.Technology) newErrors.Technology = "Technology is required";
    if (!formData.EndClientName) newErrors.EndClientName = "End Client Name is required";
    if (!formData.InterviewSupport) newErrors.InterviewSupport = "Interview Support is required";

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canCreate) {
      setError("Unauthorized: You do not have permission to create interviews.");
      return;
    }
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);
    try {
      const submitData: InterviewDetail = { ...formData };
      await createInterview(submitData);
      router.push("/interviews");
      router.refresh();
      if (onSubmit) onSubmit(submitData);
    } catch (error: any) {
      console.error("Failed to create interview:", error);
      setError("Failed to create interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, "& .MuiCard-root": { height: "100%" } }}>
      <Grid container spacing={0.5}>
        {permissions.interviews[userRole]?.basicInfo?.view && (
          <Grid item xs={12} md={12} sx={{ mb: 1 }}>
            <Card>
              <CardContent sx={{ p: 1.5 }}>
                <Typography variant="h6" gutterBottom>Basic Information</Typography>
                <Grid container spacing={0.5} alignItems="center">
                  <Grid item xs={12} sm={4} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="InterviewDate"
                      name="InterviewDate"
                      label="Interview Date"
                      type="date"
                      value={formData.InterviewDate || ""}
                      onChange={handleTextChange}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      disabled={!canCreate}
                      error={!!validationErrors.InterviewDate}
                      helperText={validationErrors.InterviewDate}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="InterviewStartTime"
                      name="InterviewStartTime"
                      label="Start Time"
                      type="time"
                      value={formData.InterviewStartTime || ""}
                      onChange={handleTextChange}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      disabled={!canCreate}
                      error={!!validationErrors.InterviewStartTime}
                      helperText={validationErrors.InterviewStartTime}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="InterviewEndTime"
                      name="InterviewEndTime"
                      label="End Time"
                      type="time"
                      value={formData.InterviewEndTime || ""}
                      onChange={handleTextChange}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      disabled={!canCreate}
                      error={!!validationErrors.InterviewEndTime}
                      helperText={validationErrors.InterviewEndTime}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <Autocomplete
                      options={recruiters}
                      getOptionLabel={(option: Recruiter) => `${option.firstName} ${option.lastName}`}
                      renderInput={(params) => (
                        <MUITextField
                          {...params}
                          label="Recruiter"
                          variant="outlined"
                          size="small"
                          error={!!validationErrors.RecruiterID}
                          helperText={validationErrors.RecruiterID}
                        />
                      )}
                      value={recruiters.find((r) => r.employeeID === formData.RecruiterID) || null}
                      onChange={(_, newValue) => handleAutocompleteChange("RecruiterID", newValue?.employeeID || null)}
                      disabled={!canCreate}
                      filterOptions={(options, { inputValue }) =>
                        options.filter((recruiter: Recruiter) =>
                          `${recruiter.firstName} ${recruiter.lastName}`.toLowerCase().includes(inputValue.toLowerCase())
                        )
                      }
                    />
                  </Grid>
                  {showClientDropdown && (
                    <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                      <Autocomplete
                        options={clients}
                        getOptionLabel={(option: ClientList) => option.clientName}
                        renderInput={(params) => (
                          <MUITextField
                            {...params}
                            label="Client"
                            variant="outlined"
                            size="small"
                            error={!!validationErrors.ClientID}
                            helperText={validationErrors.ClientID}
                          />
                        )}
                        value={clients.find((c) => c.clientID === formData.ClientID) || null}
                        onChange={(_, newValue) => handleAutocompleteChange("ClientID", newValue?.clientID || null)}
                        disabled={!canCreate}
                        filterOptions={(options, { inputValue }) =>
                          options.filter((client: ClientList) =>
                            client.clientName.toLowerCase().includes(inputValue.toLowerCase())
                          )
                        }
                      />
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
        {permissions.interviews[userRole]?.basicInfo?.view && (
          <Grid item xs={12} md={6} sx={{ mb: 1 }}>
            <Card>
              <CardContent sx={{ p: 1.5 }}>
                <Typography variant="h6" gutterBottom>Interview Details</Typography>
                <Grid container spacing={0.5}>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <Autocomplete
                      options={interviewDropdowns.interviewTypes}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <MUITextField
                          {...params}
                          label="Interview Type"
                          variant="outlined"
                          size="small"
                          error={!!validationErrors.InterviewType}
                          helperText={validationErrors.InterviewType}
                        />
                      )}
                      value={formData.InterviewType || null}
                      onChange={(_, newValue) => handleAutocompleteChange("InterviewType", newValue || null)}
                      disabled={!canCreate}
                      filterOptions={(options, { inputValue }) =>
                        options.filter((type) => type.toLowerCase().includes(inputValue.toLowerCase()))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <Autocomplete
                      options={interviewDropdowns.interviewMethods}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <MUITextField
                          {...params}
                          label="Interview Method"
                          variant="outlined"
                          size="small"
                          error={!!validationErrors.InterviewMethod}
                          helperText={validationErrors.InterviewMethod}
                        />
                      )}
                      value={formData.InterviewMethod || null}
                      onChange={(_, newValue) => handleAutocompleteChange("InterviewMethod", newValue || null)}
                      disabled={!canCreate}
                      filterOptions={(options, { inputValue }) =>
                        options.filter((method) => method.toLowerCase().includes(inputValue.toLowerCase()))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="Technology"
                      name="Technology"
                      label="Technology"
                      value={formData.Technology || ""}
                      onChange={handleTextChange}
                      size="small"
                      disabled={!canCreate}
                      error={!!validationErrors.Technology}
                      helperText={validationErrors.Technology}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <Autocomplete
                      options={interviewDropdowns.interviewStatuses}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <MUITextField
                          {...params}
                          label="Interview Status"
                          variant="outlined"
                          size="small"
                          error={!!validationErrors.InterviewStatus}
                          helperText={validationErrors.InterviewStatus}
                        />
                      )}
                      value={formData.InterviewStatus || null}
                      onChange={(_, newValue) => handleAutocompleteChange("InterviewStatus", newValue || null)}
                      disabled={!canCreate}
                      filterOptions={(options, { inputValue }) =>
                        options.filter((status) => status.toLowerCase().includes(inputValue.toLowerCase()))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <Autocomplete
                      options={interviewDropdowns.interviewSupports}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <MUITextField
                          {...params}
                          label="Interview Support"
                          variant="outlined"
                          size="small"
                          error={!!validationErrors.InterviewSupport}
                          helperText={validationErrors.InterviewSupport}
                        />
                      )}
                      value={formData.InterviewSupport || null}
                      onChange={(_, newValue) => handleAutocompleteChange("InterviewSupport", newValue || null)}
                      disabled={!canCreate}
                      filterOptions={(options, { inputValue }) =>
                        options.filter((support) => support.toLowerCase().includes(inputValue.toLowerCase()))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="interview-feedback-label">Interview Feedback</InputLabel>
                      <Select
                        labelId="interview-feedback-label"
                        id="InterviewFeedback"
                        name="InterviewFeedback"
                        value={formData.InterviewFeedback || ""}
                        onChange={(event) => handleSelectChange(event)}
                        label="Interview Feedback"
                        size="small"
                        disabled={!canCreate}
                      >
                        <MenuItem value="Excellent">Excellent</MenuItem>
                        <MenuItem value="Good">Good</MenuItem>
                        <MenuItem value="Average">Average</MenuItem>
                        <MenuItem value="Below Average">Below Average</MenuItem>
                        <MenuItem value="Poor">Poor</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
        {permissions.interviews[userRole]?.basicInfo?.view && (
          <Grid item xs={12} md={6} sx={{ mb: 1 }}>
            <Card>
              <CardContent sx={{ p: 1.5 }}>
                <Typography variant="h6" gutterBottom>Additional Details</Typography>
                <Grid container spacing={0.5} alignItems="center">
                  <Grid item xs={12} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="Comments"
                      name="Comments"
                      label="Comments"
                      value={formData.Comments || ""}
                      onChange={handleTextChange}
                      multiline
                      minRows={3}
                      maxRows={10}
                      size="small"
                      disabled={!canCreate}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      id="EndClientName"
                      name="EndClientName"
                      label="End Client Name"
                      value={formData.EndClientName || ""}
                      onChange={handleTextChange}
                      size="small"
                      disabled={!canCreate}
                      error={!!validationErrors.EndClientName}
                      helperText={validationErrors.EndClientName}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
        {permissions.interviews[userRole]?.basicInfo?.view && (
          <Grid item xs={12} sx={{ mb: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
              <Button onClick={() => router.push("/interviews")} variant="outlined">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={isLoading || !canCreate}>
                {isLoading ? "Creating..." : "Create Interview"}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}