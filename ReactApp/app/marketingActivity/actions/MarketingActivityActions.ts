import axiosInstance from "@/app/utils/axiosInstance";
import type {
  MarketingClient,
  MarketingApplicationCount,
  StandupDashboard,
  FilteredDashboard,
} from "@/app/types/MarketingActivity/Marketing";

// Fetch Standup Mode dashboard data
export async function fetchStandupDashboardData(
  recruiterId?: number
): Promise<StandupDashboard> {
  try {
    const params: any = {};
    if (recruiterId) params.recruiterId = recruiterId;

    const response = await axiosInstance.get(
      "/api/v1/marketing/dashboard/standup",
      { params }
    );

    const data: StandupDashboard = response.data;
    console.log("🔹 Raw Standup Dashboard Data:", data);
    return data;
  } catch (error: any) {
    console.error("Error fetching standup dashboard data:", error);
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
      { params }
    );

    const data: FilteredDashboard = response.data;
    console.log("🔹 Raw Filtered Dashboard Data:", data);
    return data;
  } catch (error: any) {
    console.error("Error fetching filtered dashboard data:", error);
    throw new Error(
      `Failed to fetch filtered dashboard data: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}
