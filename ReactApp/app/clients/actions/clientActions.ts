import axiosInstance from "@/app/utils/axiosInstance";
import { ClientDetail } from "@/app/types/Clients/ClientDetail";
import type { ClientList } from "../../types/Clients/ClientList";
<<<<<<< HEAD
import { Client, Employee, PaymentSchedule } from "@/app/types/Clients/Client";
import { jwtDecode } from "jwt-decode";

// Function to get the access token from localStorage or MSAL
const getAccessToken = (): string => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.warn("🔸 Access token not found in localStorage. Attempting to rehydrate from MSAL...");
=======
import { Client, Employee } from "@/app/types/Clients/Client";
import { Recruiter } from "@/app/types/Clients/Recruiter";
import { jwtDecode } from "jwt-decode";

// Function to get the access token from localStorage or MSAL
const getAccessToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.warn("🔸 Access token not found in localStorage. Attempting to rehydrate from MSAL...");
    // Fallback: Try to get token from MSAL (if integrated)
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
    const msalToken = localStorage.getItem("msal.idtoken") || localStorage.getItem("msal.accesstoken");
    if (msalToken) {
      localStorage.setItem("accessToken", msalToken);
      return msalToken;
    }
<<<<<<< HEAD
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
=======
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
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
};

export async function fetchClients(): Promise<ClientList[]> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token:", token);

  try {
<<<<<<< HEAD
    token = await refreshTokenIfNeeded(token);
    const response = await axiosInstance.get("/api/v1/clients", {
=======
    token = await refreshTokenIfNeeded(token); // Check if token is expired
    const response = await fetch("https://localhost:7070/api/v1/clients", {
      method: "GET",
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const clients = response.data?.$values || response.data;
    console.log("✅ Extracted Clients Array:", clients);
    return clients;
  } catch (error: any) {
    console.error("Error fetching clients:", error);
    if (error.message?.includes("Token expired") || error.message?.includes("Access token is missing")) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    throw new Error(`Failed to fetch clients: ${error.response?.data?.message || error.message}`);
  }
}

export async function getClient(id: number): Promise<ClientDetail | null> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Client Fetch:", token);

  try {
    token = await refreshTokenIfNeeded(token);
    const response = await axiosInstance.get(`/api/v1/clients/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const clientData = response.data;
    console.log("🔹 Raw Client Data:", clientData);
    const parseDate = (dateStr: string | null | undefined): Date | null => {
      if (!dateStr) return null;
      const d = new Date(dateStr);
      console.log(`Parsing date ${dateStr} resulted in ${d.toString()}`); // Debug log
      return isNaN(d.getTime()) ? null : d;
    };

    return {
      clientID: clientData.clientID,
      clientName: clientData.clientName,
      enrollmentDate: parseDate(clientData.enrollmentDate),
      techStack: clientData.techStack,
      visaStatus: clientData.visaStatus,
      personalPhoneNumber: clientData.personalPhoneNumber,
      personalEmailAddress: clientData.personalEmailAddress,
      linkedInURL: clientData.linkedInURL,
      marketingStartDate: parseDate(clientData.marketingStartDate),
      marketingEndDate: parseDate(clientData.marketingEndDate),
      marketingEmailID: clientData.marketingEmailID,
      marketingEmailPassword: clientData.marketingEmailPassword,
      assignedRecruiterID: clientData.assignedRecruiterID,
      assignedRecruiterName: clientData.assignedRecruiterName,
      clientStatus: clientData.clientStatus,
      placedDate: parseDate(clientData.placedDate),
      backedOutDate: parseDate(clientData.backedOutDate),
      backedOutReason: clientData.backedOutReason,
      subscriptionPlanID: clientData.subscriptionPlanID,
      subscriptionPlanName: clientData.subscriptionPlanName,
      subscriptionPlan: clientData.subscriptionPlan
        ? {
            subscriptionPlanID: clientData.subscriptionPlan.subscriptionPlanID,
            planName: clientData.subscriptionPlan.planName,
            serviceAgreementUrl: clientData.subscriptionPlan.serviceAgreementUrl,
            subscriptionPlanPaymentStartDate: parseDate(clientData.subscriptionPlan.subscriptionPlanPaymentStartDate),
            totalSubscriptionAmount: clientData.subscriptionPlan.totalSubscriptionAmount,
            createdTS: parseDate(clientData.subscriptionPlan.createdTS),
            createdBy: clientData.subscriptionPlan.createdBy,
            updatedTS: parseDate(clientData.subscriptionPlan.updatedTS),
            updatedBy: clientData.subscriptionPlan.updatedBy,
          }
        : null,
      totalDue: clientData.totalDue,
      totalPaid: clientData.totalPaid,
      postPlacementPlanID: clientData.postPlacementPlanID,
      postPlacementPlanName: clientData.postPlacementPlanName,
      postPlacementPlan: clientData.postPlacementPlan
        ? {
            postPlacementPlanID: clientData.postPlacementPlan.postPlacementPlanID,
            planName: clientData.postPlacementPlan.planName,
            promissoryNoteUrl: clientData.postPlacementPlan.promissoryNoteUrl,
            postPlacementPlanPaymentStartDate: parseDate(clientData.postPlacementPlan.postPlacementPlanPaymentStartDate),
            totalPostPlacementAmount: clientData.postPlacementPlan.totalPostPlacementAmount,
            createdTS: parseDate(clientData.postPlacementPlan.createdTS),
            createdBy: clientData.postPlacementPlan.createdBy,
            updatedTS: parseDate(clientData.postPlacementPlan.updatedTS),
            updatedBy: clientData.postPlacementPlan.updatedBy,
          }
        : null,
      paymentSchedules: (clientData.paymentSchedules?.$values || clientData.paymentSchedules || []).map((ps: any) => ({
        paymentScheduleID: ps.paymentScheduleID,
        clientID: ps.clientID,
        paymentDate: parseDate(ps.paymentDate),
        amount: ps.amount,
        isPaid: ps.isPaid,
        paymentType: ps.paymentType,
        subscriptionPlanID: ps.subscriptionPlanID,
        postPlacementPlanID: ps.postPlacementPlanID,
        createdTS: parseDate(ps.createdTS),
        createdBy: ps.createdBy,
        updatedTS: parseDate(ps.updatedTS),
        updatedBy: ps.updatedBy,
      })),
      serviceAgreementUrl: clientData.serviceAgreementUrl,
      promissoryNoteUrl: clientData.promissoryNoteUrl,
    };
  } catch (error: any) {
    console.error("Error fetching client:", error);
    if (error.message?.includes("Token expired") || error.message?.includes("Access token is missing")) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    throw new Error(`Failed to fetch client: ${error.response?.data?.message || error.message}`);
  }
}

interface RecruitersResponse {
  $id: string;
  $values: Employee[];
}

export async function getRecruiters(): Promise<RecruitersResponse> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Recruiters Fetch:", token);

  try {
    token = await refreshTokenIfNeeded(token);
    const response = await axiosInstance.get("/api/v1/employees/recruiters", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching recruiters:", error);
    if (error.message?.includes("Token expired") || error.message?.includes("Access token is missing")) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    throw new Error(`Failed to fetch recruiters: ${error.response?.data?.message || error.message}`);
  }
}

export async function updateClient(
  id: number,
  updatedClient: Partial<ClientDetail>,
  serviceAgreementFile?: File | null,
  promissoryNoteFile?: File | null
): Promise<boolean> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Update Client:", token);

  try {
    token = await refreshTokenIfNeeded(token);
    const formData = new FormData();
    formData.append("clientID", id.toString());
    formData.append("clientDto", JSON.stringify(updatedClient)); // Updated key to match binder
    if (serviceAgreementFile) {
      formData.append("ServiceAgreement", serviceAgreementFile);
    }
    if (promissoryNoteFile) {
      formData.append("PromissoryNote", promissoryNoteFile);
    }

<<<<<<< HEAD
    console.log("🔹 Data to Update Client:", { updatedClient, serviceAgreementFile, promissoryNoteFile });
    const response = await axiosInstance.put(`/api/v1/clients/${id}/edit`, formData, { // Updated endpoint
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status !== 204) {
      throw new Error(`Unexpected response status: ${response.status} - ${JSON.stringify(response.data)}`);
    }

    console.log("✅ Client Updated Successfully");
    return true;
  } catch (error: any) {
    console.error(`Error updating client (ID: ${id}):`, error.response?.data || error.message);
    if (error.message?.includes("Token expired") || error.message?.includes("Access token is missing")) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    throw new Error(`Failed to update client: ${error.response?.data?.message || error.message}`);
  }
}

export async function createClient(
  createClientData: Partial<Client>,
  serviceAgreementFile?: File | null,
  promissoryNoteFile?: File | null
): Promise<boolean> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Create Client:", token);

  try {
    token = await refreshTokenIfNeeded(token);

    const formData = new FormData();

    // Validate required fields before proceeding
    if (!createClientData.clientName || createClientData.clientName.trim() === "") {
      throw new Error("ClientName is required.");
    }
    if (!createClientData.clientStatus || createClientData.clientStatus.trim() === "") {
      throw new Error("ClientStatus is required.");
    }

    // Conditionally include nested objects only if they have data
    const clientDataToSend = {
      clientID: createClientData.clientID || 0,
      clientName: createClientData.clientName,
      enrollmentDate: createClientData.enrollmentDate,
      techStack: createClientData.techStack,
      personalPhoneNumber: createClientData.personalPhoneNumber,
      personalEmailAddress: createClientData.personalEmailAddress,
      assignedRecruiterID: createClientData.assignedRecruiterID,
      visaStatus: createClientData.visaStatus,
      linkedInURL: createClientData.linkedInURL,
      clientStatus: createClientData.clientStatus,
      marketingStartDate: createClientData.marketingStartDate,
      marketingEndDate: createClientData.marketingEndDate,
      marketingEmailID: createClientData.marketingEmailID,
      marketingEmailPassword: createClientData.marketingEmailPassword,
      placedDate: createClientData.placedDate,
      backedOutDate: createClientData.backedOutDate,
      backedOutReason: createClientData.backedOutReason,
      totalDue: createClientData.totalDue || 0.0,
      totalPaid: createClientData.totalPaid || 0.0,
      subscriptionPlanID: createClientData.subscriptionPlanID,
      postPlacementPlanID: createClientData.postPlacementPlanID,
      paymentSchedules: createClientData.paymentSchedules && createClientData.paymentSchedules.length > 0 ? createClientData.paymentSchedules : undefined,
      serviceAgreementUrl: createClientData.serviceAgreementUrl,
      promissoryNoteUrl: createClientData.promissoryNoteUrl,
      subscriptionPlan: createClientData.subscriptionPlan && Object.values(createClientData.subscriptionPlan).some(v => v !== null && v !== "") 
        ? createClientData.subscriptionPlan 
        : undefined,
      postPlacementPlan: createClientData.postPlacementPlan && Object.values(createClientData.postPlacementPlan).some(v => v !== null && v !== "") 
        ? createClientData.postPlacementPlan 
        : undefined,
    };

    // Append client data as a single JSON string
    formData.append("clientDto", JSON.stringify(clientDataToSend));

    // Append files
    if (serviceAgreementFile) {
      formData.append("ServiceAgreement", serviceAgreementFile);
    }
    if (promissoryNoteFile) {
      formData.append("PromissoryNote", promissoryNoteFile);
    }

    // Debug FormData
    console.log("🔹 Final FormData to Send:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : JSON.stringify(value)}`);
    }

    // Make API call
    const response = await axiosInstance.post("/api/v1/clients", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 201) {
      console.log("✅ Client Created Successfully");
      return true; // Return true on success
    } else {
      throw new Error(`Unexpected response status: ${response.status} - ${JSON.stringify(response.data)}`);
    }
  } catch (error: any) {
    console.error("❌ Error creating client:", error.response?.data || error.message);
    if (error.message?.includes("Token expired") || error.message?.includes("Access token is missing")) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    throw new Error(`Failed to create client: ${error.response?.data?.message || error.message}`);
=======
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
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
  }
}

export async function deleteClient(id: number): Promise<boolean> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Delete Client:", token);

  try {
    token = await refreshTokenIfNeeded(token);
    const response = await axiosInstance.delete(`/api/v1/clients/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 204) {
      throw new Error(`Unexpected response status: ${response.status} - ${JSON.stringify(response.data)}`);
    }

    console.log("✅ Client Deleted Successfully");
    return true;
  } catch (error: any) {
    console.error(`Error deleting client (ID: ${id}):`, error.response?.data || error.message);
    if (error.message?.includes("Token expired") || error.message?.includes("Access token is missing")) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    throw new Error(`Failed to delete client: ${error.response?.data?.message || error.message}`);
  }
}