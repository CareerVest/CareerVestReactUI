"use client";

import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import AddClientButton from "./components/AddClientButton";
import ClientListSkeleton from "./components/shared/ClientListSkeleton";
import { ClientList as ClientListType } from "../types/Clients/ClientList";
import { fetchClients } from "./actions/clientActions";
import ClientList from "./components/ClientList";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientListType[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isInitialized, user, login } = useAuth(); // Added `login` for potential re-authentication
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return; // Wait until auth is initialized

    console.log("🔹 Auth State on Load:", { isAuthenticated, isInitialized, user });

    // Add a longer delay to allow auth state to fully rehydrate
    const checkAuthAndLoad = async () => {
      // Wait longer to ensure auth state is fully rehydrated
      await new Promise(resolve => setTimeout(resolve, 2000)); // Increased delay to 2s for stability

      if (!isAuthenticated) {
        console.log("❌ User Not Authenticated, Attempting Silent Re-authentication...");
        try {
          const loginSuccess = await login(); // Attempt silent login or redirect
          if (!loginSuccess) {
            console.log("❌ Silent Re-authentication failed, Redirecting to /login...");
            router.push("/login");
            return;
          }
        } catch (error) {
          console.error("❌ Re-authentication error:", error);
          router.push("/login");
          return;
        }
      }

      console.log("✅ Fetching Clients...");
      const loadClients = async () => {
        try {
          const fetchedClients = await fetchClients();
          console.log("🔹 Clients Received:", fetchedClients);
          setClients(fetchedClients);
        } catch (error) {
          console.error("❌ Failed to fetch clients:", error);
          if (error instanceof Error && error.message.includes("Authentication required")) {
            console.log("🔸 Token expired or missing, redirecting to login...");
            router.push("/login");
          }
        } finally {
          setLoading(false);
        }
      };

      loadClients();
    };

    checkAuthAndLoad();
  }, [isAuthenticated, isInitialized, router, login]);

  if (!isInitialized) {
    return <Box sx={{ p: 3 }}>Verifying authentication...</Box>;
  }

  if (!isAuthenticated) {
    return <Box sx={{ p: 3 }}>Redirecting to login...</Box>; // Fallback for debugging
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ color: "#682A53" }}>
          Clients
        </Typography>
        <AddClientButton />
      </Box>
      {loading ? <ClientListSkeleton /> : <ClientList clients={clients} />}
    </Box>
  );
}