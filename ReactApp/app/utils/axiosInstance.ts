import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, tokenRequest } from "./authUtils";

// ✅ Initialize MSAL instance once
const msalInstance = new PublicClientApplication(msalConfig);

// ✅ Function to get the access token from localStorage
const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

// ✅ Function to check if the token is expired
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp < Date.now() / 1000; // Expiry in seconds
  } catch (error) {
    console.error("❌ Failed to decode JWT:", error);
    return true;
  }
};

// ✅ Function to refresh token using MSAL
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) {
      console.warn("⚠️ No active account found, redirecting to login...");
      localStorage.clear();
      window.location.href = "/login";
      return null;
    }

    console.log("🔄 Refreshing access token...");
    const response = await msalInstance.acquireTokenSilent({
      account: accounts[0],
      scopes: tokenRequest.scopes,
    });
    localStorage.setItem("accessToken", response.accessToken);
    return response.accessToken;
  } catch (error) {
    console.error("❌ Failed to refresh access token:", error);
    localStorage.clear();
    window.location.href = "/login";
    return null;
  }
};

// ✅ Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "https://localhost:7070", // 🔹 Update this to your API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach JWT Token to Every Request and Refresh If Expired
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = getAccessToken();

    if (isTokenExpired(token)) {
      token = await refreshAccessToken();
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      window.location.href = "/login";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;