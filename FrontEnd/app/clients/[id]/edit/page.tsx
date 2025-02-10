"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Box, Typography, Button, CircularProgress } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import EditClientForm from "../../../components/clients/EditClientForm"
import { getClient } from "../../../actions/clientActions"
import type { Client } from "../../../types/client"

export default function ClientEdit({ params }: { params: { id: string } }) {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const clientData = await getClient(Number(params.id))
        setClient(clientData)
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
    return <Typography>Client not found</Typography>
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
        Back to Clients
      </Button>
      <Typography variant="h4" gutterBottom>
        Edit Client: {client.ClientName}
      </Typography>
      <EditClientForm client={client} />
    </Box>
  )
}

