import { Employee } from "@/app/types/employees/employee";
import { EmployeeDetail } from "@/app/types/employees/employeeDetail";
import { EmployeeList } from "@/app/types/employees/employeeList";
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

// Helper function to normalize employee data for backend
const normalizeEmployeeData = (employee: EmployeeDetail): Employee => {
  return {
    EmployeeID: employee.EmployeeID || 0, // Default to 0 for new employees
    FirstName: employee.FirstName?.trim() || "",
    LastName: employee.LastName?.trim() || "",
    PersonalEmailAddress: employee.PersonalEmailAddress?.trim() || "",
    CompanyEmailAddress: employee.CompanyEmailAddress?.trim() || null,
    PersonalPhoneNumber: employee.PersonalPhoneNumber?.trim() || null,
    PersonalPhoneCountryCode: employee.PersonalPhoneCountryCode?.trim() || null,
    JoinedDate: employee.JoinedDate
      ? new Date(employee.JoinedDate).toISOString()
      : null,
    Status: employee.Status || "Active",
    TerminatedDate: employee.TerminatedDate
      ? new Date(employee.TerminatedDate).toISOString()
      : null,
    Role: employee.Role?.trim() || "",
    SupervisorID: employee.SupervisorID || null,
    //SupervisorName: employee.SupervisorName?.trim() || null,
    EmployeeReferenceID: employee.EmployeeReferenceID?.trim() || null,
    CompanyComments: employee.CompanyComments?.trim() || null,
    // CreatedTS: employee.CreatedTS ? new Date(employee.CreatedTS).toISOString() : null,
    // UpdatedTS: employee.UpdatedTS ? new Date(employee.UpdatedTS).toISOString() : null,
  };
};

export async function fetchEmployees(): Promise<EmployeeList[]> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token:", token);

  try {
    token = await refreshTokenIfNeeded(token);
    const response = await axiosInstance.get("/api/v1/employees", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let employees: any[] = [];
    if (Array.isArray(response.data)) {
      employees = response.data;
    } else if (response.data && response.data.$values) {
      employees = response.data.$values;
    } else if (
      response.data &&
      typeof response.data === "object" &&
      response.data.employeeID
    ) {
      employees = [response.data];
    } else {
      employees = [];
    }

    console.log("🔹 Raw Employees from Backend:", employees);

    const mappedEmployees = employees
      .filter((item: any) => {
        const hasValidId =
          (item.EmployeeID != null && typeof item.EmployeeID === "number") ||
          (item.employeeID != null && typeof item.employeeID === "number");
        console.log("🔹 Filtering Employee:", item, "Valid ID:", hasValidId);
        return hasValidId;
      })
      .map((item: any) => {
        const employeeId = item.EmployeeID || item.employeeID;
        return {
          EmployeeID: employeeId,
          FirstName: item.FirstName || item.firstName || "", // Handle both PascalCase and lowercase
          LastName: item.LastName || item.lastName || "", // Handle both PascalCase and lowercase
          PersonalEmailAddress:
            item.PersonalEmailAddress || item.personalEmailAddress || "",
          CompanyEmailAddress:
            item.CompanyEmailAddress || item.companyEmailAddress || null,
          PersonalPhoneNumber:
            item.PersonalPhoneNumber || item.personalPhoneNumber || null,
          PersonalPhoneCountryCode:
            item.PersonalPhoneCountryCode || item.personalPhoneCountryCode || null,
          JoinedDate:
            item.JoinedDate || item.joinedDate
              ? typeof item.JoinedDate === "string" ||
                typeof item.joinedDate === "string"
                ? new Date(item.JoinedDate || item.joinedDate).toISOString()
                : null
              : null,
          Status: item.Status || item.status || "",
          TerminatedDate:
            item.TerminatedDate || item.terminatedDate
              ? typeof item.TerminatedDate === "string" ||
                typeof item.terminatedDate === "string"
                ? new Date(
                    item.TerminatedDate || item.terminatedDate
                  ).toISOString()
                : null
              : null,
          Role: item.Role || item.role || "",
          SupervisorID: item.SupervisorID || item.supervisorID || null,
          SupervisorName: item.SupervisorName || item.supervisorName || null,
          CompanyComments: item.CompanyComments || item.companyComments || null,
          id: employeeId,
        } as EmployeeList;
      });

    console.log("✅ Extracted Employees Array:", mappedEmployees);
    return mappedEmployees;
  } catch (error: any) {
    console.error("Error fetching employees:", error);
    if (
      error.message?.includes("Token expired") ||
      error.message?.includes("Access token is missing")
    ) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    return []; // Return empty array to prevent crash, ensuring valid structure
  }
}

export async function getEmployee(id: number): Promise<EmployeeDetail | null> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Employee Fetch:", token);

  try {
    token = await refreshTokenIfNeeded(token);
    const response = await axiosInstance.get(`/api/v1/employees/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const employeeData = response.data;
    console.log("🔹 Raw Employee Data:", employeeData);

    return {
      EmployeeID: employeeData.EmployeeID || employeeData.employeeID, // Handle both "EmployeeID" and "employeeID"
      FirstName: employeeData.FirstName || employeeData.firstName || "",
      LastName: employeeData.LastName || employeeData.lastName || "",
      PersonalEmailAddress:
        employeeData.PersonalEmailAddress ||
        employeeData.personalEmailAddress ||
        "",
      CompanyEmailAddress:
        employeeData.CompanyEmailAddress ||
        employeeData.companyEmailAddress ||
        "",
      PersonalPhoneNumber:
        employeeData.PersonalPhoneNumber ||
        employeeData.personalPhoneNumber ||
        null,
      PersonalPhoneCountryCode:
        employeeData.PersonalPhoneCountryCode ||
        employeeData.personalPhoneCountryCode ||
        null,
      JoinedDate:
        employeeData.JoinedDate || employeeData.joinedDate
          ? typeof employeeData.JoinedDate === "string" ||
            typeof employeeData.joinedDate === "string"
            ? new Date(
                employeeData.JoinedDate || employeeData.joinedDate
              ).toISOString()
            : null
          : null,
      Status: employeeData.Status || employeeData.status || "",
      TerminatedDate:
        employeeData.TerminatedDate || employeeData.terminatedDate
          ? typeof employeeData.TerminatedDate === "string" ||
            typeof employeeData.terminatedDate === "string"
            ? new Date(
                employeeData.TerminatedDate || employeeData.terminatedDate
              ).toISOString()
            : null
          : null,
      EmployeeReferenceID:
        employeeData.EmployeeReferenceID ||
        employeeData.employeeReferenceID ||
        null,
      CompanyComments:
        employeeData.CompanyComments || employeeData.companyComments || null,
      Role: employeeData.Role || employeeData.role || "",
      SupervisorID:
        employeeData.SupervisorID || employeeData.supervisorID || null,
      SupervisorName:
        employeeData.SupervisorName || employeeData.supervisorName || null,
      CreatedTS: employeeData.CreatedTS
        ? new Date(employeeData.CreatedTS).toISOString()
        : null,
      UpdatedTS: employeeData.UpdatedTS
        ? new Date(employeeData.UpdatedTS).toISOString()
        : null,
    };
  } catch (error: any) {
    console.error("Error fetching employee:", error);
    if (
      error.message?.includes("Token expired") ||
      error.message?.includes("Access token is missing")
    ) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    return null; // Return null to prevent crash
  }
}

export async function createEmployee(employeeData: EmployeeDetail): Promise<boolean> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Create Employee:", token);

  try {
    token = await refreshTokenIfNeeded(token);

    const normalizedData = normalizeEmployeeData(employeeData);

    const response = await axiosInstance.post(
      "/api/v1/employees",
      normalizedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log("✅ Employee Created Successfully");
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
      "Error creating employee:",
      error.response?.data || error.message
    );
    if (
      error.message?.includes("Token expired") ||
      error.message?.includes("Access token is missing")
    ) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    throw new Error(
      `Failed to create employee: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}

export async function updateEmployee(
  id: number,
  employeeData: EmployeeDetail
): Promise<boolean> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Update Employee:", token);

  try {
    token = await refreshTokenIfNeeded(token);

    const normalizedData = normalizeEmployeeData(employeeData);

    const response = await axiosInstance.put(
      `/api/v1/employees/${id}`,
      normalizedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 204) {
      console.log("✅ Employee Updated Successfully");
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
      `Error updating employee (ID: ${id}):`,
      error.response?.data || error.message
    );
    if (
      error.message?.includes("Token expired") ||
      error.message?.includes("Access token is missing")
    ) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    throw new Error(
      `Failed to update employee: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}

export async function inactivateEmployee(id: number): Promise<boolean> {
  let token = getAccessToken();
  console.log("🔹 Initial Access Token for Inactivate Employee:", token);

  try {
    token = await refreshTokenIfNeeded(token);
    const response = await axiosInstance.put(
      `/api/v1/employees/${id}/inactivate`,
      {},
      {
        // Use PUT for update
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 204) {
      // Adjust status code based on backend response (e.g., 204 for no content on success)
      console.log("✅ Employee marked as inactive successfully");
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
      `Error marking employee (ID: ${id}) as inactive:`,
      error.response?.data || error.message
    );
    if (
      error.message?.includes("Token expired") ||
      error.message?.includes("Access token is missing")
    ) {
      throw new Error("Authentication required. Redirecting to login...");
    }
    throw new Error(
      `Failed to mark employee as inactive: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}