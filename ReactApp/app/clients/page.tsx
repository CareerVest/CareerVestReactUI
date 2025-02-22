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
<<<<<<< HEAD

// Define permissions for ClientsPage (consistent with ClientList.tsx)
interface ClientPagePermissions {
  viewList: boolean;
  addClient: boolean;
  viewClient: boolean;
  editClient: boolean;
  deleteClient: boolean;
}

const permissions: Record<string, ClientPagePermissions> = {
  Admin: {
    viewList: true,
    addClient: true,
    viewClient: true,
    editClient: true,
    deleteClient: true,
  },
  Senior_Recruiter: {
    viewList: true,
    addClient: false,
    viewClient: true,
    editClient: true,
    deleteClient: false,
  },
  Sales_Executive: {
    viewList: true,
    addClient: false,
    viewClient: true,
    editClient: false,
    deleteClient: false,
  },
  recruiter: {
    viewList: true,
    addClient: false,
    viewClient: true,
    editClient: false,
    deleteClient: false,
  },
  default: {
    viewList: true,
    addClient: false,
    viewClient: true,
    editClient: false,
    deleteClient: false,
  },
};
=======
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientListType[]>([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const { isAuthenticated, isInitialized, user, login, roles } = useAuth();
  const router = useRouter();

  // Determine user role with Azure AD casing
  const userRole = roles.length > 0 
    ? (roles.includes("Admin") 
        ? "Admin" 
        : roles.includes("Sales_Executive") 
          ? "Sales_Executive" 
          : roles.includes("Senior_Recruiter") 
            ? "Senior_Recruiter" 
            : roles.includes("recruiter") 
              ? "recruiter" 
              : "default") 
    : "default";

  useEffect(() => {
    if (!isInitialized) return;

    console.log("🔹 Auth State on Load:", { isAuthenticated, isInitialized, user, roles, userRole });

    const checkAuthAndLoad = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (!isAuthenticated) {
        console.log("❌ User Not Authenticated, Attempting Silent Re-authentication...");
        try {
          const loginSuccess = await login();
=======
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
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
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
<<<<<<< HEAD
  }, [isAuthenticated, isInitialized, router, login, roles]);
=======
  }, [isAuthenticated, isInitialized, router, login]);
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)

  if (!isInitialized) {
    return <Box sx={{ p: 3 }}>Verifying authentication...</Box>;
  }

  if (!isAuthenticated) {
<<<<<<< HEAD
    return <Box sx={{ p: 3 }}>Redirecting to login...</Box>;
=======
    return <Box sx={{ p: 3 }}>Redirecting to login...</Box>; // Fallback for debugging
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
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
<<<<<<< HEAD
        {permissions[userRole].addClient && <AddClientButton />}
=======
        <AddClientButton />
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
      </Box>
      {loading ? <ClientListSkeleton /> : <ClientList clients={clients} />}
    </Box>
  );
}