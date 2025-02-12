"use client"

import { useState, useEffect } from "react"
import { Box, Typography } from "@mui/material"
import ClientList from "./components/ClientList";
import AddClientButton from "./components/AddClientButton";
import ClientListSkeleton from "./components/shared/ClientListSkeleton";
import { Client } from "../types/client";
import { fetchClients } from "./actions/clientActions";

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
  
    useEffect(() => {
      const loadClients = async () => {
        try {
          const fetchedClients = await fetchClients() // Replace 1 with the actual clientId you want to use
          setClients(fetchedClients)
          console.log("Fetched clients:", fetchedClients)
        } catch (error) {
          console.error("Failed to fetch clients:", error)
          // Handle error (e.g., show error message to user)
        } finally {
          setLoading(false)
        }
      }
  
      loadClients()
    }, [])
  
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ color: "#682A53" }}>
            Clients
          </Typography>
          <AddClientButton />
        </Box>
        {loading ? <ClientListSkeleton /> : <ClientList clients={clients} />}
      </Box>
    )
  }