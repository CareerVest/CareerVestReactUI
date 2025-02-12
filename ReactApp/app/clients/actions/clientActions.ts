import type { Client } from "../../types/client";

// Function to get the access token from localStorage
const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export async function fetchClients(): Promise<Client[]> {
  const token = getAccessToken();

  if (!token) {
    throw new Error("Access token is missing. Please login again.");
  }

  try {
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
    return data as Client[];
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
}