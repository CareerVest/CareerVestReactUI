import axiosInstance from "@/app/utils/axiosInstance";
import type {
  MarketingClient,
  MarketingApplicationCount,
  StandupDashboard,
  FilteredDashboard,
} from "@/app/types/MarketingActivity/Marketing";
import { jwtDecode } from "jwt-decode";

// Function to get the access token from localStorage or MSAL
const getAccessToken = (): string => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.warn(
      "🔸 Access token not found in localStorage. Attempting to rehydrate from MSAL..."
    );
    const msalToken =
      localStorage.getItem("msal.idtoken") ||
      localStorage.getItem("msal.accesstoken");
    if (msalToken) {
      localStorage.setItem("accessToken", msalToken);
      return msalToken;
    }
    throw new Error("Access token is missing. Please log in again.");
  }
  return token;
};

// Helper function to refresh token if expired
const refreshTokenIfNeeded = async (token: string): Promise<string> => {
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      console.log("🔸 Token expired, attempting refresh...");
      throw new Error("Token expired. Please log in again.");
    }
    return token;
  } catch (error) {
    console.error("Error decoding or refreshing token:", error);
    throw new Error("Token invalid or expired. Please log in again.");
  }
};

// Fetch Standup Mode dashboard data
export async function fetchStandupDashboardData(
  recruiterId?: number
): Promise<StandupDashboard> {
  try {
    let token = getAccessToken();
    console.log(
      "🔹 Initial Access Token for Standup Dashboard Data Fetch:",
      token
    );
    token = await refreshTokenIfNeeded(token);

    const params: any = {};
    if (recruiterId) params.recruiterId = recruiterId;

    const response = await axiosInstance.get(
      "/api/v1/marketing/dashboard/standup",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      }
    );

    const data: StandupDashboard = response.data;
    console.log("🔹 Raw Standup Dashboard Data:", data);
    return data;
  } catch (error: any) {
    console.error("Error fetching standup dashboard data:", error);
    if (
      error.message?.includes("Token expired") ||
      error.message?.includes("Access token is missing")
    ) {
      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login"; // Adjust to your login route
      }
      throw new Error("Authentication required. Redirecting to login...");
    }
    throw new Error(
      `Failed to fetch standup dashboard data: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}

// Fetch Filtered Mode dashboard data
export async function fetchFilteredDashboardData(
  recruiterId?: number,
  date?: string,
  status?: string,
  type?: string,
  dateRange?: [Date | null, Date | null]
): Promise<FilteredDashboard> {
  try {
    let token = getAccessToken();
    console.log(
      "🔹 Initial Access Token for Filtered Dashboard Data Fetch:",
      token
    );
    token = await refreshTokenIfNeeded(token);

    const params: any = {};
    if (recruiterId) params.recruiterId = recruiterId;
    if (date) params.date = date;
    else params.date = new Date().toISOString().split("T")[0]; // Default to today
    if (status) params.status = status;
    if (type) params.type = type;
    if (dateRange && dateRange[0] && dateRange[1]) {
      params.startDate = dateRange[0].toISOString().split("T")[0];
      params.endDate = dateRange[1].toISOString().split("T")[0];
    }

    const response = await axiosInstance.get(
      "/api/v1/marketing/dashboard/filtered",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      }
    );

    const data: FilteredDashboard = response.data;
    console.log("🔹 Raw Filtered Dashboard Data:", data);
    return data;
  } catch (error: any) {
    console.error("Error fetching filtered dashboard data:", error);
    if (
      error.message?.includes("Token expired") ||
      error.message?.includes("Access token is missing")
    ) {
      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login"; // Adjust to your login route
      }
      throw new Error("Authentication required. Redirecting to login...");
    }
    throw new Error(
      `Failed to fetch filtered dashboard data: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}
