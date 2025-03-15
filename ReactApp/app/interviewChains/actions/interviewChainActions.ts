import axiosInstance from "@/app/utils/axiosInstance";
import type {
  Interview,
  InterviewChain,
  InterviewChainList,
  InterviewChainDetail,
  InterviewChainCreate,
  InterviewChainUpdate,
  InterviewChainEnd,
  InterviewChainCreateResponse,
  InterviewChainAdd,
} from "../../types/interviewChain/interviewChain";
import { jwtDecode } from "jwt-decode";

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

const parseDate = (dateStr: string | null | undefined): Date | null => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
};

const transformListToInterviewChain = (
  data: InterviewChainList[]
): InterviewChain[] => {
  return data.map((item) => ({
    id: item.interviewChainID.toString(),
    endClientName: item.endClientName || "",
    clientName: item.clientName || "",
    recruiterName: item.recruiterName || "",
    position: item.position || "",
    status: item.chainStatus || "Active",
    interviews: [],
    rounds: item.rounds,
    createdAt: item.interviewEntryDate,
    updatedAt: item.latestInterviewDate || item.interviewEntryDate,
    latestInterview: {
      InterviewChainID: item.interviewChainID,
      ParentInterviewChainID: null,
      ClientID: item.clientID || null,
      EndClientName: item.endClientName || "",
      Position: item.position || "",
      ChainStatus: item.chainStatus || "Active",
      Rounds: item.rounds,
      InterviewEntryDate: parseDate(item.interviewEntryDate) || new Date(),
      RecruiterID: item.recruiterID || null,
      InterviewDate: parseDate(item.latestInterviewDate),
      InterviewStartTime: null,
      InterviewEndTime: null,
      InterviewMethod: null,
      InterviewType: item.latestInterviewType || null,
      InterviewStatus: item.latestInterviewStatus || "Scheduled",
      InterviewOutcome: null,
      InterviewSupport: null,
      InterviewFeedback: null,
      Comments: null,
      CreatedTS: null,
      UpdatedTS: parseDate(item.latestInterviewDate) || new Date(),
      CreatedBy: null,
      UpdatedBy: null,
    },
    latestInterviewDate: item.latestInterviewDate || null,
    latestInterviewStatus: item.latestInterviewStatus || null,
    latestInterviewType: item.latestInterviewType || null,
  }));
};

const transformDetailToInterviewChain = (
  data: InterviewChainDetail & { interviews: { $values: any[] } }
): InterviewChain => {
  console.log(
    "transformDetailToInterviewChain: Raw API response for interviews:",
    data.interviews.$values
  );
  const interviews: Interview[] = data.interviews.$values.map((i) => {
    const interview = {
      InterviewChainID: i.interviewChainID,
      ParentInterviewChainID: i.parentInterviewChainID || null,
      ClientID: data.clientID || null,
      EndClientName: data.endClientName || "",
      Position: i.position || data.position || "",
      ChainStatus: i.chainStatus || "Active",
      Rounds: i.rounds || data.rounds,
      InterviewEntryDate:
        parseDate(i.interviewEntryDate?.toString()) ||
        parseDate(data.interviewEntryDate) ||
        new Date(),
      RecruiterID: data.recruiterID || null,
      InterviewDate: parseDate(i.interviewDate?.toString()),
      InterviewStartTime: i.interviewStartTime || null,
      InterviewEndTime: i.interviewEndTime || null,
      InterviewMethod: i.interviewMethod || null,
      InterviewType: i.interviewType || null,
      InterviewStatus: i.interviewStatus || "Scheduled",
      InterviewOutcome: i.interviewOutcome || null,
      InterviewSupport: i.interviewSupport || null,
      InterviewFeedback: i.interviewFeedback || null,
      Comments: i.comments || null,
      CreatedTS: parseDate(i.createdTS?.toString()) || new Date(),
      UpdatedTS: parseDate(i.updatedTS?.toString()) || new Date(),
      CreatedBy: i.createdBy || null,
      UpdatedBy: i.updatedBy || null,
    };
    console.log("Transformed Interview:", interview);
    return interview;
  });

  const latestInterview = interviews[interviews.length - 1] || null;

  return {
    id: data.interviewChainID.toString(),
    endClientName: data.endClientName || "",
    clientName: data.clientName || "",
    recruiterName: data.recruiterName || "",
    position: data.position || "",
    status: data.chainStatus || "Active",
    interviews,
    rounds: data.rounds,
    createdAt: data.interviewEntryDate,
    updatedAt: interviews.length
      ? interviews[interviews.length - 1]?.UpdatedTS?.toISOString() ||
        data.interviewEntryDate
      : data.interviewEntryDate,
    latestInterview,
    latestInterviewDate: latestInterview
      ? latestInterview.InterviewDate?.toISOString()
      : null,
    latestInterviewStatus: latestInterview
      ? latestInterview.InterviewStatus
      : null,
    latestInterviewType: latestInterview ? latestInterview.InterviewType : null,
  };
};

// Rest of the file remains unchanged
export async function fetchInterviewChains(): Promise<InterviewChain[]> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Fetch Interview Chains:", token);

  try {
    token = await refreshTokenIfNeeded(token);
    const response = await axiosInstance.get<{
      $id: string;
      $values: InterviewChainList[];
    }>("/api/v1/interviewchains", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const rawData = response.data.$values;
    console.log("✅ Extracted Interview Chains Data:", rawData);
    return transformListToInterviewChain(rawData);
  } catch (error: any) {
    console.error("Error fetching interview chains:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      `Failed to fetch interview chains: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}

export async function getInterviewChain(
  id: number
): Promise<InterviewChain | null> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Fetch Interview Chain:", token);

  try {
    token = await refreshTokenIfNeeded(token);
    const response = await axiosInstance.get<
      InterviewChainDetail & { interviews: { $values: any[] } }
    >(`/api/v1/interviewchains/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const rawData = response.data;
    console.log(
      "✅ Extracted Interview Chain Data:",
      JSON.stringify(rawData, null, 2)
    );
    const transformed = transformDetailToInterviewChain(rawData);
    console.log(
      "Transformed InterviewChain:",
      JSON.stringify(transformed, null, 2)
    );
    return transformed;
  } catch (error: any) {
    console.error("Error fetching interview chain:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    if (error.response?.status === 404) return null;
    throw new Error(
      `Failed to fetch interview chain: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}

export async function createInterviewChain(
  data: InterviewChainCreate
): Promise<number> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Create Interview Chain:", token);

  try {
    token = await refreshTokenIfNeeded(token);
    const response = await axiosInstance.post<InterviewChainCreateResponse>(
      "/api/v1/interviewchains",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Interview Chain Created Successfully:", response.data);
    return response.data.interviewChainID;
  } catch (error: any) {
    console.error("Error creating interview chain:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      `Failed to create interview chain: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}

export async function updateInterviewChain(
  id: number,
  data: InterviewChainUpdate
): Promise<boolean> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Update Interview Chain:", token);

  try {
    token = await refreshTokenIfNeeded(token);
    const response = await axiosInstance.put(
      `/api/v1/interviewchains/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Interview Chain Updated Successfully");
    return response.status === 204;
  } catch (error: any) {
    console.error("Error updating interview chain:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      `Failed to update interview chain: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}

export async function addInterviewToChain(
  chainId: number,
  data: InterviewChainAdd
): Promise<boolean> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Add Interview to Chain:", token);
  console.log("🔹 Adding interview with data:", JSON.stringify(data, null, 2));

  try {
    token = await refreshTokenIfNeeded(token);
    const response = await axiosInstance.post(
      `/api/v1/interviewchains/${chainId}/interviews`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Interview Added to Chain Successfully");
    return response.status === 201;
  } catch (error: any) {
    console.error("Error adding interview to chain:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      `Failed to add interview to chain: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}

export async function endInterviewChain(
  chainId: number,
  data: InterviewChainEnd
): Promise<boolean> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for End Interview:", token);
  console.log("🔹 Ending interview with data:", JSON.stringify(data, null, 2));

  try {
    token = await refreshTokenIfNeeded(token);
    const response = await axiosInstance.put(
      `/api/v1/interviewchains/${chainId}/end`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Interview Ended Successfully");
    return response.status === 204;
  } catch (error: any) {
    console.error("Error ending interview:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      `Failed to end interview: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}

export async function deleteInterviewChain(id: number): Promise<boolean> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Delete Interview Chain:", token);

  try {
    token = await refreshTokenIfNeeded(token);
    const response = await axiosInstance.delete(
      `/api/v1/interviewchains/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ Interview Chain Deleted Successfully");
    return response.status === 204;
  } catch (error: any) {
    console.error("Error deleting interview chain:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      `Failed to delete interview chain: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}
