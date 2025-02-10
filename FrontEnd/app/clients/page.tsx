import { Suspense } from "react"
import { Box, Typography } from "@mui/material"
import ClientList from "../components/clients/ClientList"
import AddClientButton from "../components/clients/AddClientButton"
import ClientListSkeleton from "../components/clients/ClientListSkeleton"

export const metadata = {
  title: "Clients | CareerVest",
}

export default function ClientsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: "#682A53" }}>
          Clients
        </Typography>
        <AddClientButton />
      </Box>
      <Suspense fallback={<ClientListSkeleton />}>
        <ClientList />
      </Suspense>
    </Box>
  )
}

