// src/app/actions/MarketingActivityActions.ts

import type {
  MarketingInterview,
  MarketingClient,
  MarketingRecruiter,
  FilterState,
  MarketingInterviewStats,
  MarketingActivityCount,
  ApplicationCounts,
} from "../../types/MarketingActivity/Marketing";
import axiosInstance from "../../utils/axiosInstance";
import { jwtDecode } from "jwt-decode";

// Helper function to get the access token from localStorage or MSAL
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

// Helper function to normalize date values
const normalizeDate = (date: any): string | null => {
  if (!date) return null;
  if (typeof date === "string") {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime())
      ? null
      : parsedDate.toISOString().split("T")[0];
  }
  if (date instanceof Date) {
    return isNaN(date.getTime()) ? null : date.toISOString().split("T")[0];
  }
  return null;
};

// Helper function to build query string for backend (used for filtered clients)
const buildQueryString = (filters: FilterState): string => {
  const parts: string[] = [];
  if (filters.recruiter && filters.recruiter !== "all") {
    parts.push(`client:${filters.recruiter}`);
  }
  if (filters.status && filters.status !== "all") {
    parts.push(`status:${filters.status}`);
  }
  if (filters.type && filters.type !== "all") {
    parts.push(`type:${filters.type}`);
  }
  if (filters.dateRange[0] && filters.dateRange[1]) {
    const startDate = normalizeDate(filters.dateRange[0]);
    const endDate = normalizeDate(filters.dateRange[1]);
    if (startDate && endDate) {
      if (startDate === endDate) {
        parts.push(startDate);
      } else {
        parts.push(`${startDate} to ${endDate}`);
      }
    }
  }
  if (filters.searchQuery) {
    parts.push(filters.searchQuery);
  }
  return parts.join(" ");
};

// Mapping function for ClientListDto to MarketingClient
const mapClientListDtoToMarketingClient = (dto: any): MarketingClient => {
  return {
    id: dto.ClientID?.toString() || "",
    name: dto.ClientName?.trim() || "",
    recruiterId: dto.AssignedRecruiterID?.toString() || "",
    interviews:
      (dto.Interviews || []).map((i: any) =>
        mapInterviewListDtoToInterview(i, dto)
      ) || [],
    screeningCount:
      (dto.Interviews || []).filter((i: any) => i.InterviewType === "Screening")
        .length || 0,
    technicalCount:
      (dto.Interviews || []).filter((i: any) => i.InterviewType === "Technical")
        .length || 0,
    finalRoundCount:
      (dto.Interviews || []).filter(
        (i: any) => i.InterviewType === "Final Round"
      ).length || 0,
  };
};

// Mapping function for InterviewListDto to MarketingInterview
const mapInterviewListDtoToInterview = (
  dto: any,
  clientDto: any
): MarketingInterview => ({
  id: dto.InterviewID?.toString() || "",
  clientId: clientDto.ClientID?.toString() || "",
  clientName: clientDto.ClientName?.trim() || "",
  type:
    (dto.InterviewType as "Screening" | "Technical" | "Final Round") || "all",
  tech: dto.Technology?.trim() || "",
  status:
    (dto.InterviewStatus as "scheduled" | "completed" | "cancelled") || "all",
  time: dto.InterviewStartTime?.trim() || "",
  date: normalizeDate(dto.InterviewDate) || "",
  entryDate: normalizeDate(dto.InterviewEntryDate) || "",
  company: dto.EndClientName?.trim() || "",
  notes: dto.Comments?.trim() || "",
  feedback: dto.InterviewFeedback?.trim() || "",
});

// Mapping function for MarketingActivityCount to ApplicationCounts
const mapMarketingActivityCountToApplicationCounts = (
  dto: MarketingActivityCount
): ApplicationCounts => ({
  totalManualApplications: dto.TotalManualApplications || 0,
  totalEasyApplications: dto.TotalEasyApplications || 0,
  totalReceivedInterviews: dto.TotalReceivedInterviews || 0,
});

// Mapping function for InterviewStatsDto to MarketingInterviewStats
const mapInterviewStatsDto = (dto: any): MarketingInterviewStats => ({
  Date: new Date(dto.Date) || new Date(),
  Screening: dto.Screening || 0,
  Technical: dto.Technical || 0,
  FinalRound: dto.FinalRound || 0,
  Total: dto.Total || 0,
});

// Mapping function for RecruiterDto to MarketingRecruiter
const mapRecruiterDtoToMarketingRecruiter = (dto: any): MarketingRecruiter => ({
  id: dto.EmployeeID?.toString() || "",
  name:
    `${dto.FirstName?.trim() || ""} ${dto.LastName?.trim() || ""}`.trim() || "",
});

// Fetch all clients
export async function fetchClients(): Promise<MarketingClient[]> {
  try {
    const token = getAccessToken();
    const response = await axiosInstance.get(
      "/api/v1/marketingActivity/clients",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;
    let clients: any[] = [];
    if (Array.isArray(data)) {
      clients = data;
    } else if (data && data.$values) {
      clients = data.$values;
    } else if (data && typeof data === "object" && data.ClientID) {
      clients = [data];
    } else {
      clients = [];
    }

    return clients.map((dto: any) => mapClientListDtoToMarketingClient(dto));
  } catch (error: any) {
    console.error("Error fetching clients:", error);
    if (
      error.message?.includes("Token expired") ||
      error.message?.includes("Access token is missing")
    ) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    return []; // Return empty array to prevent crash, ensuring valid structure
  }
}

// Fetch recruiters (used for filter bar)
export async function fetchRecruiters(): Promise<MarketingRecruiter[]> {
  try {
    const token = getAccessToken();
    const response = await axiosInstance.get("/api/v1/employees/recruiters", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data: any = response.data;
    let recruiters: any[] = [];
    if (Array.isArray(data)) {
      recruiters = data;
    } else if (data && data.$values) {
      recruiters = data.$values;
    } else if (data && typeof data === "object" && data.EmployeeID) {
      recruiters = [data];
    } else {
      recruiters = [];
    }

    return recruiters.map((dto: any) =>
      mapRecruiterDtoToMarketingRecruiter(dto)
    );
  } catch (error: any) {
    console.error("Error fetching recruiters:", error);
    if (
      error.message?.includes("Token expired") ||
      error.message?.includes("Access token is missing")
    ) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    return []; // Return empty array to prevent crash
  }
}

// Fetch filtered clients
export async function fetchClientsWithFilters(
  query: string,
  quickFilters: string
): Promise<MarketingClient[]> {
  try {
    const token = getAccessToken();
    const response = await axiosInstance.get(
      `/api/v1/marketingActivity/clients/search?query=${encodeURIComponent(
        query
      )}&quickFilters=${encodeURIComponent(quickFilters)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;
    let clients: any[] = [];
    if (Array.isArray(data)) {
      clients = data;
    } else if (data && data.$values) {
      clients = data.$values;
    } else if (data && typeof data === "object" && data.ClientID) {
      clients = [data];
    } else {
      clients = [];
    }

    return clients.map((dto: any) => mapClientListDtoToMarketingClient(dto));
  } catch (error: any) {
    console.error("Error fetching filtered clients:", error);
    if (
      error.message?.includes("Token expired") ||
      error.message?.includes("Access token is missing")
    ) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    return []; // Return empty array to prevent crash
  }
}

// Fetch interview stats for a specific date
export async function fetchInterviewStats(
  date: string
): Promise<MarketingInterviewStats[]> {
  try {
    const token = getAccessToken();
    const response = await axiosInstance.get(
      `/api/v1/marketingActivity/stats?date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;
    let stats: any[] = [];
    if (Array.isArray(data)) {
      stats = data;
    } else if (data && data.$values) {
      stats = data.$values;
    } else if (data && typeof data === "object" && data.Date) {
      stats = [data];
    } else {
      stats = [];
    }

    return stats.map((dto: any) => mapInterviewStatsDto(dto));
  } catch (error: any) {
    console.error("Error fetching interview stats:", error);
    if (
      error.message?.includes("Token expired") ||
      error.message?.includes("Access token is missing")
    ) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    return []; // Return empty array to prevent crash
  }
}

// Fetch marketing activities (application counts) for a specific date
export async function fetchMarketingActivitiesForDate(
  date: string
): Promise<MarketingActivityCount[]> {
  try {
    const token = await refreshTokenIfNeeded(getAccessToken());
    const response = await axiosInstance.get(
      `/api/v1/marketingActivity/counts?date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;
    let activities: any[] = [];
    if (Array.isArray(data)) {
      activities = data;
    } else if (data && data.$values) {
      activities = data.$values;
    } else if (data && typeof data === "object" && data.ClientID) {
      activities = [data];
    } else {
      activities = [];
    }

    return activities.map((dto: any) => ({
      ...dto,
      ApplicationCounts: mapMarketingActivityCountToApplicationCounts(dto),
    }));
  } catch (error: any) {
    console.error("Error fetching marketing activities:", error);
    if (
      error.message?.includes("Token expired") ||
      error.message?.includes("Access token is missing")
    ) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    console.error("API Call Issue - Marketing Activities:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return []; // Return empty array for 404, preventing crashes
  }
}
