"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "@/contexts/authContext";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login, isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace("/"); // Redirect to dashboard
    }
  }, [isAuthenticated, isInitialized, router]);

  const handleMicrosoftLogin = async () => {
    if (!isInitialized) {
      setError("Authentication is still initializing...");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await login();
      if (!success) {
        setError("Login failed or was canceled.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("🔸 Login Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <Container component="main" maxWidth="xs">
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
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Sign in to CareerVest
          </Typography>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleMicrosoftLogin}
            disabled={isLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? "Signing in..." : "Sign in with Microsoft"}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
