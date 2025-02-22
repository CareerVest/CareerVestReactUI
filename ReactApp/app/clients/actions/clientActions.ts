import axiosInstance from "@/app/utils/axiosInstance";
import { ClientDetail } from "@/app/types/Clients/ClientDetail";
import type { ClientList } from "../../types/Clients/ClientList";
import { Client, Employee } from "@/app/types/Clients/Client";
import { Recruiter } from "@/app/types/Clients/Recruiter";
import { jwtDecode } from "jwt-decode";

// Function to get the access token from localStorage or MSAL
const getAccessToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.warn("🔸 Access token not found in localStorage. Attempting to rehydrate from MSAL...");
    // Fallback: Try to get token from MSAL (if integrated)
    const msalToken = localStorage.getItem("msal.idtoken") || localStorage.getItem("msal.accesstoken");
    if (msalToken) {
      localStorage.setItem("accessToken", msalToken);
      return msalToken;
    }
    throw new Error("Access token is missing. Please login again.");
  }
  return token;
};

// Helper function to refresh token if expired (simplified, you might need MSAL integration)
const refreshTokenIfNeeded = async (token: string): Promise<string> => {
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      console.log("🔸 Token expired, attempting refresh...");
      // Here, you’d typically use MSAL to refresh the token silently
      // For now, throw an error to trigger a login redirect
      throw new Error("Token expired. Please log in again.");
    }
    return token;
  } catch (error) {
    console.error("Error decoding or refreshing token:", error);
    throw new Error("Token invalid or expired. Please log in again.");
  }
};

export async function fetchClients(): Promise<ClientList[]> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token:", token);

  try {
    token = await refreshTokenIfNeeded(token); // Check if token is expired
    const response = await fetch("https://localhost:7070/api/v1/clients", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching clients: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("🔹 Raw Clients Data:", data); // ✅ Log raw response

    // ✅ Extract `$values` array if the response contains `$id`
    const clients = data?.$values || data;

    console.log("✅ Extracted Clients Array:", clients);
    return clients;
  } catch (error) {
    console.error("Error fetching clients:", error);
    if (error instanceof Error && (error.message.includes("Token expired") || error.message.includes("Access token is missing"))) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    throw error;
  }
}

// ✅ Fetch a single client by ID
export async function getClient(id: number): Promise<ClientDetail | null> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Client Fetch:", token);

  try {
    token = await refreshTokenIfNeeded(token); // Check if token is expired
    const response = await fetch(
      `https://localhost:7070/api/v1/clients/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching client: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching client:", error);
    if (error instanceof Error && (error.message.includes("Token expired") || error.message.includes("Access token is missing"))) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    throw error;
  }
}

interface RecruitersResponse {
  $id: string;
  $values: Employee[];
}

// ✅ Fetch recruiters from the backend
export async function getRecruiters(): Promise<RecruitersResponse> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Recruiters Fetch:", token);

  try {
    token = await refreshTokenIfNeeded(token); // Check if token is expired
    const response = await fetch(
      "https://localhost:7070/api/v1/employees/recruiters",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching recruiters: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching recruiters:", error);
    if (error instanceof Error && (error.message.includes("Token expired") || error.message.includes("Access token is missing"))) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    throw error;
  }
}

// ✅ Update client details
export async function updateClient(
  id: number,
  updatedClient: Partial<ClientDetail>
): Promise<boolean> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Update Client:", token);

  try {
    token = await refreshTokenIfNeeded(token); // Check if token is expired
    await axiosInstance.put(`/api/v1/clients/${id}`, updatedClient, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return true; // ✅ Successfully updated
  } catch (error) {
    console.error(`Error updating client (ID: ${id}):`, error);
    if (error instanceof Error && (error.message.includes("Token expired") || error.message.includes("Access token is missing"))) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    throw error;
  }
}

// ✅ Update client details
export async function createClient(
  createClientData: Partial<Client>
): Promise<boolean> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Update Client:", token);

  try {
    token = await refreshTokenIfNeeded(token); // Check if token is expired
    await axiosInstance.put(`/api/v1/clients/`, createClientData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return true; // ✅ Successfully updated
  } catch (error) {
    console.error(`Error creating client`, error);
    if (error instanceof Error && (error.message.includes("Token expired") || error.message.includes("Access token is missing"))) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    throw error;
  }
}