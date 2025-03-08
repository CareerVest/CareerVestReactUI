"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Autocomplete,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/styles/theme";
import Sidebar from "@/app/sharedComponents/sidebar";
import { AuthProvider } from "@/contexts/authContext";
import { useAuth } from "@/contexts/authContext";
import permissions from "@/app/utils/permissions";
import { dummyInterviewChains } from "../interviewChains";
import interviewDropdowns from "@/app/utils/interviewDropdowns.json";

// Define the type for InterviewChain
interface InterviewChain {
  InterviewChainID: number;
  ClientID: number;
  EndClientName: string;
  InterviewType: string;
  InterviewDate: string;
  InterviewStartTime: string;
  InterviewEndTime: string;
  InterviewMethod: string;
  InterviewStatus: string;
  InterviewSupport: string;
  Outcome: string | null;
  ParentInterviewChainID: number | null;
  CreatedDate: string;
  ModifiedDate: string;
}

interface ParentChainOption {
  label: string;
  id: number;
}

interface CreateInterviewChainFormProps {
  onSubmit: (data: Partial<InterviewChain>) => void;
}

export default function CreateInterviewChainForm({
  onSubmit,
}: CreateInterviewChainFormProps) {
  const { isAuthenticated, isInitialized, roles, login } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    ClientID: undefined,
    EndClientName: "",
    InterviewType: "",
    InterviewDate: "",
    InterviewStartTime: "",
    InterviewEndTime: "",
    InterviewMethod: "",
    InterviewStatus: "",
    InterviewSupport: "",
    Outcome: "",
    ParentInterviewChainID: undefined,
    Comments: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [authChecked, setAuthChecked] = useState<boolean | null>(null);

  const userRole =
    roles.length > 0
      ? roles.includes("Admin")
        ? "Admin"
        : roles.includes("recruiter")
        ? "recruiter"
        : "default"
      : "default";
  const canCreate =
    permissions.interviewChains[userRole]?.addInterviewChain === true;

  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("isAuthenticated") === "true";
      setAuthChecked(auth);

      if (!auth) {
        router.replace("/login");
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [router]);

  // Redirect if user can't create
  useEffect(() => {
    if (!isInitialized) return;

    const checkAccess = async () => {
      try {
        if (!isAuthenticated) {
          const loginSuccess = await login();
          if (!loginSuccess) router.push("/login");
          return;
        }
        if (!canCreate) {
          router.push("/interview-chains");
        }
      } catch (error) {
        console.error("Auth or permission check failed:", error);
        router.push("/login");
      }
    };
    checkAccess();
  }, [isAuthenticated, isInitialized, router, login, canCreate]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (canCreate) {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAutocompleteChange = (
    name: string,
    value: string | number | null
  ) => {
    if (canCreate) {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.InterviewDate)
      newErrors.InterviewDate = "Interview Date is required";
    if (!formData.InterviewType)
      newErrors.InterviewType = "Interview Type is required";
    if (!formData.InterviewStatus)
      newErrors.InterviewStatus = "Interview Status is required";
    if (!formData.EndClientName)
      newErrors.EndClientName = "End Client Name is required";
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate) {
      setError(
        "Unauthorized: You do not have permission to create interview chains."
      );
      return;
    }
    if (!validateForm()) return;
    setIsLoading(true);
    setError(null);
    onSubmit(formData);
    setIsLoading(false);
  };

  // Define parent chain options
  const parentChainOptions: ParentChainOption[] = dummyInterviewChains.map(
    (c: InterviewChain) => ({
      label: `${c.InterviewChainID} - ${c.InterviewType}`,
      id: c.InterviewChainID,
    })
  );

  // Find the selected parent chain option
  const selectedParentChain = formData.ParentInterviewChainID
    ? parentChainOptions.find(
        (option) => option.id === formData.ParentInterviewChainID
      ) || null
    : null;

  // Define sidebar widths
  const sidebarWidthExpanded = 280;
  const sidebarWidthCollapsed = 80;

  // Handle loading states
  if (authChecked === null) {
    return (
      <html lang="en">
        <body>
          <div style={{ textAlign: "center", marginTop: "20%" }}>
            Loading...
          </div>
        </body>
      </html>
    );
  }

  if (!isInitialized)
    return <Box sx={{ p: 3 }}>Verifying authentication...</Box>;
  if (!isAuthenticated) return <Box sx={{ p: 3 }}>Redirecting to login...</Box>;
  if (!canCreate) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You do not have permission to create interview chains.
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
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

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <Box sx={{ minHeight: "100vh", display: "flex" }}>
              {isAuthenticated && (
                <Sidebar
                  permissions={permissions}
                  userRole={userRole}
                  isCollapsed={isCollapsed}
                  setIsCollapsed={setIsCollapsed}
                />
              )}
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  bgcolor: "background.default",
                  width: `calc(100% - ${
                    isCollapsed ? sidebarWidthCollapsed : sidebarWidthExpanded
                  }px)`,
                  transition: "width 0.3s ease",
                  p: 3,
                }}
              >
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <Grid container spacing={0.5}>
                    <Grid item xs={12} md={12} sx={{ mb: 1 }}>
                      <Card
                        sx={{
                          borderRadius: 12,
                          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        <CardContent sx={{ p: 1.5 }}>
                          <Typography variant="h6" gutterBottom>
                            Basic Information
                          </Typography>
                          <Grid container spacing={0.5}>
                            <Grid item xs={12} sm={4} sx={{ mb: 1 }}>
                              <TextField
                                fullWidth
                                id="InterviewDate"
                                name="InterviewDate"
                                label="Interview Date"
                                type="date"
                                value={formData.InterviewDate}
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
                                value={formData.InterviewStartTime}
                                onChange={handleTextChange}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                                disabled={!canCreate}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4} sx={{ mb: 1 }}>
                              <TextField
                                fullWidth
                                id="InterviewEndTime"
                                name="InterviewEndTime"
                                label="End Time"
                                type="time"
                                value={formData.InterviewEndTime}
                                onChange={handleTextChange}
                                InputLabelProps={{ shrink: true }}
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
                                value={formData.EndClientName}
                                onChange={handleTextChange}
                                size="small"
                                disabled={!canCreate}
                                error={!!validationErrors.EndClientName}
                                helperText={validationErrors.EndClientName}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                              <TextField
                                fullWidth
                                id="ClientID"
                                name="ClientID"
                                label="Client ID"
                                type="number"
                                value={formData.ClientID || ""}
                                onChange={handleTextChange}
                                size="small"
                                disabled={!canCreate}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ mb: 1 }}>
                      <Card
                        sx={{
                          borderRadius: 12,
                          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        <CardContent sx={{ p: 1.5 }}>
                          <Typography variant="h6" gutterBottom>
                            Interview Details
                          </Typography>
                          <Grid container spacing={0.5}>
                            <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                              <Autocomplete
                                options={interviewDropdowns.interviewTypes}
                                getOptionLabel={(option) => option}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Interview Type"
                                    variant="outlined"
                                    size="small"
                                    error={!!validationErrors.InterviewType}
                                    helperText={validationErrors.InterviewType}
                                  />
                                )}
                                value={formData.InterviewType}
                                onChange={(_, newValue) =>
                                  handleAutocompleteChange(
                                    "InterviewType",
                                    newValue || ""
                                  )
                                }
                                disabled={!canCreate}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                              <Autocomplete
                                options={interviewDropdowns.interviewMethods}
                                getOptionLabel={(option) => option}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Interview Method"
                                    variant="outlined"
                                    size="small"
                                  />
                                )}
                                value={formData.InterviewMethod}
                                onChange={(_, newValue) =>
                                  handleAutocompleteChange(
                                    "InterviewMethod",
                                    newValue || ""
                                  )
                                }
                                disabled={!canCreate}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                              <TextField
                                fullWidth
                                id="InterviewSupport"
                                name="InterviewSupport"
                                label="Interview Support"
                                value={formData.InterviewSupport}
                                onChange={handleTextChange}
                                size="small"
                                disabled={!canCreate}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                              <Autocomplete
                                options={interviewDropdowns.interviewStatuses}
                                getOptionLabel={(option) => option}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Interview Status"
                                    variant="outlined"
                                    size="small"
                                    error={!!validationErrors.InterviewStatus}
                                    helperText={
                                      validationErrors.InterviewStatus
                                    }
                                  />
                                )}
                                value={formData.InterviewStatus}
                                onChange={(_, newValue) =>
                                  handleAutocompleteChange(
                                    "InterviewStatus",
                                    newValue || ""
                                  )
                                }
                                disabled={!canCreate}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ mb: 1 }}>
                      <Card
                        sx={{
                          borderRadius: 12,
                          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        <CardContent sx={{ p: 1.5 }}>
                          <Typography variant="h6" gutterBottom>
                            Additional Details
                          </Typography>
                          <Grid container spacing={0.5}>
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
                              <Autocomplete
                                options={[
                                  "Next Round",
                                  "Rejected",
                                  "Offer Extended",
                                ]}
                                getOptionLabel={(option) => option}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Outcome"
                                    variant="outlined"
                                    size="small"
                                  />
                                )}
                                value={formData.Outcome}
                                onChange={(_, newValue) =>
                                  handleAutocompleteChange(
                                    "Outcome",
                                    newValue || ""
                                  )
                                }
                                disabled={!canCreate}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                              <Autocomplete
                                options={parentChainOptions}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Parent Chain"
                                    variant="outlined"
                                    size="small"
                                  />
                                )}
                                value={selectedParentChain}
                                onChange={(_, newValue) =>
                                  handleAutocompleteChange(
                                    "ParentInterviewChainID",
                                    newValue?.id || null
                                  )
                                }
                                disabled={!canCreate}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sx={{ mb: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 2,
                          mt: 3,
                        }}
                      >
                        <Button
                          onClick={() => router.push("/interview-chains")}
                          variant="outlined"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={isLoading || !canCreate}
                        >
                          {isLoading ? "Creating..." : "Create Interview Chain"}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
