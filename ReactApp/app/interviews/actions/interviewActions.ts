import { Interview } from "@/app/types/interviews/interview";
import { InterviewDetail } from "@/app/types/interviews/interviewDetail";
import { InterviewList } from "@/app/types/interviews/interviewList";
import axiosInstance from "@/app/utils/axiosInstance";
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

// Helper function to normalize interview data for backend
const normalizeInterviewData = (interview: InterviewDetail): Interview => {
  return {
    InterviewID: interview.InterviewID || 0, // Default to 0 for new interviews
    InterviewEntryDate: interview.InterviewEntryDate
      ? new Date(interview.InterviewEntryDate).toISOString().split("T")[0]
      : null,
    RecruiterID: interview.RecruiterID || null,
    InterviewDate: interview.InterviewDate
      ? new Date(interview.InterviewDate).toISOString().split("T")[0]
      : null,
    InterviewStartTime: interview.InterviewStartTime?.trim() || null,
    InterviewEndTime: interview.InterviewEndTime?.trim() || null,
    ClientID: interview.ClientID || null,
    InterviewType: interview.InterviewType?.trim() || null,
    InterviewMethod: interview.InterviewMethod?.trim() || null,
    Technology: interview.Technology?.trim() || null,
    InterviewFeedback: interview.InterviewFeedback?.trim() || null,
    InterviewStatus: interview.InterviewStatus?.trim() || null,
    InterviewSupport: interview.InterviewSupport?.trim() || null,
    Comments: interview.Comments?.trim() || null,
    CreatedDate: interview.CreatedDate
      ? new Date(interview.CreatedDate).toISOString()
      : new Date().toISOString(),
    ModifiedDate: interview.ModifiedDate
      ? new Date(interview.ModifiedDate).toISOString()
      : new Date().toISOString(),
    EndClientName: interview.EndClientName?.trim() || null,
  };
};

export async function fetchInterviews(): Promise<InterviewList[]> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token:", token);

  try {
    token = await refreshTokenIfNeeded(token);
    const response = await axiosInstance.get("/api/v1/interviews", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let interviews: any[] = [];
    if (Array.isArray(response.data)) {
      interviews = response.data;
    } else if (response.data && response.data.$values) {
      interviews = response.data.$values;
    } else if (
      response.data &&
      typeof response.data === "object" &&
      response.data.interviewID
    ) {
      interviews = [response.data];
    } else {
      interviews = [];
    }

    console.log("🔹 Raw Interviews from Backend:", interviews);

    const mappedInterviews = interviews
      .filter((item: any) => {
        const hasValidId =
          (item.InterviewID != null && typeof item.InterviewID === "number") ||
          (item.interviewID != null && typeof item.interviewID === "number");
        console.log("🔹 Filtering Interview:", item, "Valid ID:", hasValidId);
        return hasValidId;
      })
      .map((item: any) => {
        const interviewId = item.InterviewID || item.interviewID;
        return {
          InterviewID: interviewId,
          InterviewEntryDate:
            item.InterviewEntryDate || item.interviewEntryDate
              ? new Date(item.InterviewEntryDate || item.interviewEntryDate)
                  .toISOString()
                  .split("T")[0]
              : null,
          RecruiterName: item.RecruiterName || item.recruiterName || null,
          InterviewDate:
            item.InterviewDate || item.interviewDate
              ? new Date(item.InterviewDate || item.interviewDate)
                  .toISOString()
                  .split("T")[0]
              : null,
          InterviewStartTime:
            item.InterviewStartTime || item.interviewStartTime || null,
          InterviewEndTime:
            item.InterviewEndTime || item.interviewEndTime || null,
          ClientName: item.ClientName || item.clientName || null,
          InterviewType: item.InterviewType || item.interviewType || null,
          InterviewStatus: item.InterviewStatus || item.interviewStatus || null,
          CreatedDate:
            item.CreatedDate || item.createdDate
              ? new Date(item.CreatedDate || item.createdDate).toISOString()
              : null,
          ModifiedDate:
            item.ModifiedDate || item.modifiedDate
              ? new Date(item.ModifiedDate || item.modifiedDate).toISOString()
              : null,
          EndClientName: item.EndClientName || item.endClientName || null,
          id: interviewId,
        } as InterviewList;
      });

    console.log("✅ Extracted Interviews Array:", mappedInterviews);
    return mappedInterviews;
  } catch (error: any) {
    console.error("Error fetching interviews:", error);
    if (
      error.message?.includes("Token expired") ||
      error.message?.includes("Access token is missing")
    ) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    return []; // Return empty array to prevent crash, ensuring valid structure
  }
}

export async function getInterview(
  id: number
): Promise<InterviewDetail | null> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Interview Fetch:", token);

  try {
    token = await refreshTokenIfNeeded(token);
    const response = await axiosInstance.get(`/api/v1/interviews/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const interviewData = response.data;
    console.log("🔹 Raw Interview Data:", interviewData);

    return {
      InterviewID: interviewData.InterviewID || interviewData.interviewID, // Handle both "InterviewID" and "interviewID"
      InterviewEntryDate:
        interviewData.InterviewEntryDate || interviewData.interviewEntryDate
          ? new Date(
              interviewData.InterviewEntryDate ||
                interviewData.interviewEntryDate
            )
              .toISOString()
              .split("T")[0]
          : null,
      RecruiterID:
        interviewData.RecruiterID || interviewData.recruiterID || null,
      RecruiterName:
        interviewData.RecruiterName || interviewData.recruiterName || null,
      InterviewDate:
        interviewData.InterviewDate || interviewData.interviewDate
          ? new Date(interviewData.InterviewDate || interviewData.interviewDate)
              .toISOString()
              .split("T")[0]
          : null,
      InterviewStartTime:
        interviewData.InterviewStartTime ||
        interviewData.interviewStartTime ||
        null,
      InterviewEndTime:
        interviewData.InterviewEndTime ||
        interviewData.interviewEndTime ||
        null,
      ClientID: interviewData.ClientID || interviewData.clientID || null,
      ClientName: interviewData.ClientName || interviewData.clientName || null,
      InterviewType:
        interviewData.InterviewType || interviewData.interviewType || null,
      InterviewMethod:
        interviewData.InterviewMethod || interviewData.interviewMethod || null,
      Technology: interviewData.Technology || interviewData.technology || null,
      InterviewFeedback:
        interviewData.InterviewFeedback ||
        interviewData.interviewFeedback ||
        null,
      InterviewStatus:
        interviewData.InterviewStatus || interviewData.interviewStatus || null,
      InterviewSupport:
        interviewData.InterviewSupport ||
        interviewData.interviewSupport ||
        null,
      Comments: interviewData.Comments || interviewData.comments || null,
      CreatedDate:
        interviewData.CreatedDate || interviewData.createdDate
          ? new Date(
              interviewData.CreatedDate || interviewData.createdDate
            ).toISOString()
          : null,
      ModifiedDate:
        interviewData.ModifiedDate || interviewData.modifiedDate
          ? new Date(
              interviewData.ModifiedDate || interviewData.modifiedDate
            ).toISOString()
          : null,
      EndClientName:
        interviewData.EndClientName || interviewData.endClientName || null,
      CreatedTS: null,
      UpdatedTS: null,
    };
  } catch (error: any) {
    console.error("Error fetching interview:", error);
    if (
      error.message?.includes("Token expired") ||
      error.message?.includes("Access token is missing")
    ) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    return null; // Return null to prevent crash
  }
}

export async function createInterview(
  interviewData: InterviewDetail
): Promise<boolean> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Create Interview:", token);

  try {
    token = await refreshTokenIfNeeded(token);

    const normalizedData = normalizeInterviewData(interviewData);

    const response = await axiosInstance.post(
      "/api/v1/interviews",
      normalizedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log("✅ Interview Created Successfully");
      return true;
    } else {
      throw new Error(
        `Unexpected response status: ${response.status} - ${JSON.stringify(
          response.data
        )}`
      );
    }
  } catch (error: any) {
    console.error(
      "Error creating interview:",
      error.response?.data || error.message
    );
    if (
      error.message?.includes("Token expired") ||
      error.message?.includes("Access token is missing")
    ) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    throw new Error(
      `Failed to create interview: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}

export async function updateInterview(
  id: number,
  interviewData: InterviewDetail
): Promise<boolean> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Update Interview:", token);

  try {
    token = await refreshTokenIfNeeded(token);

    const normalizedData = normalizeInterviewData(interviewData);

    const response = await axiosInstance.put(
      `/api/v1/interviews/${id}`,
      normalizedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 204) {
      console.log("✅ Interview Updated Successfully");
      return true;
    } else {
      throw new Error(
        `Unexpected response status: ${response.status} - ${JSON.stringify(
          response.data
        )}`
      );
    }
  } catch (error: any) {
    console.error(
      `Error updating interview (ID: ${id}):`,
      error.response?.data || error.message
    );
    if (
      error.message?.includes("Token expired") ||
      error.message?.includes("Access token is missing")
    ) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    throw new Error(
      `Failed to update interview: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}

export async function deleteInterview(id: number): Promise<boolean> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Delete Interview:", token);

  try {
    token = await refreshTokenIfNeeded(token);
    const response = await axiosInstance.delete(`/api/v1/interviews/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      console.log("✅ Interview deleted successfully");
      return true;
    } else {
      throw new Error(
        `Unexpected response status: ${response.status} - ${JSON.stringify(
          response.data
        )}`
      );
    }
  } catch (error: any) {
    console.error(
      `Error deleting interview (ID: ${id}):`,
      error.response?.data || error.message
    );
    if (
      error.message?.includes("Token expired") ||
      error.message?.includes("Access token is missing")
    ) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    throw new Error(
      `Failed to delete interview: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}
