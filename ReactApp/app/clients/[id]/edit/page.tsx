"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, CircularProgress, Button, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditClientForm from "../../components/EditClientForm";
import { getClient } from "../../actions/clientActions";
import type { ClientDetail } from "../../../types/Clients/ClientDetail";

export default function ClientEdit({ params }: { params: { id: string } }) {
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const clientData = await getClient(Number(params.id));
        if (clientData) {
          setClient(clientData);
        } else {
          setError("Client not found.");
        }
      } catch (error) {
        setError("Failed to fetch client.");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [params.id]);

  const handleBack = () => {
    router.push("/clients");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Clients
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!client) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Clients
        </Button>
        <Typography variant="h5" color="error">
          Client not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
        Back to Clients
      </Button>
      <Typography variant="h4" gutterBottom>
        Edit Client: {client.clientName}
      </Typography>
      <EditClientForm client={client} /> {/* ✅ No more error here */}
    </Box>
  );
}