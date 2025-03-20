import { Employee } from "@/app/types/employees/employee";
import { EmployeeDetail } from "@/app/types/employees/employeeDetail";
import { EmployeeList } from "@/app/types/employees/employeeList";
import { Recruiter } from "@/app/types/employees/recruiter";
import axiosInstance from "@/app/utils/axiosInstance";

// Helper function to normalize employee data for backend
const normalizeEmployeeData = (employee: EmployeeDetail): Employee => {
  return {
    EmployeeID: employee.EmployeeID || 0,
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
    EmployeeReferenceID: employee.EmployeeReferenceID?.trim() || null,
    CompanyComments: employee.CompanyComments?.trim() || null,
  };
};

export async function fetchEmployees(): Promise<EmployeeList[]> {
  try {
    const response = await axiosInstance.get("/api/v1/employees");
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
          FirstName: item.FirstName || item.firstName || "",
          LastName: item.LastName || item.lastName || "",
          PersonalEmailAddress:
            item.PersonalEmailAddress || item.personalEmailAddress || "",
          CompanyEmailAddress:
            item.CompanyEmailAddress || item.companyEmailAddress || null,
          PersonalPhoneNumber:
            item.PersonalPhoneNumber || item.personalPhoneNumber || null,
          PersonalPhoneCountryCode:
            item.PersonalPhoneCountryCode ||
            item.personalPhoneCountryCode ||
            null,
          JoinedDate:
            item.JoinedDate || item.joinedDate
              ? new Date(item.JoinedDate || item.joinedDate).toISOString()
              : null,
          Status: item.Status || item.status || "",
          TerminatedDate:
            item.TerminatedDate || item.terminatedDate
              ? new Date(
                  item.TerminatedDate || item.terminatedDate
                ).toISOString()
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
    throw new Error(
      `Failed to fetch employees: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}

export async function getEmployee(id: number): Promise<EmployeeDetail | null> {
  try {
    const response = await axiosInstance.get(`/api/v1/employees/${id}`);
    const employeeData = response.data;
    console.log("🔹 Raw Employee Data:", employeeData);

    return {
      EmployeeID: employeeData.EmployeeID || employeeData.employeeID,
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
          ? new Date(
              employeeData.JoinedDate || employeeData.joinedDate
            ).toISOString()
          : null,
      Status: employeeData.Status || employeeData.status || "",
      TerminatedDate:
        employeeData.TerminatedDate || employeeData.terminatedDate
          ? new Date(
              employeeData.TerminatedDate || employeeData.terminatedDate
            ).toISOString()
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
    throw new Error(
      `Failed to fetch employee: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}

export async function createEmployee(
  employeeData: EmployeeDetail
): Promise<boolean> {
  try {
    const normalizedData = normalizeEmployeeData(employeeData);
    const response = await axiosInstance.post(
      "/api/v1/employees",
      normalizedData,
      {
        headers: {
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
  try {
    const normalizedData = normalizeEmployeeData(employeeData);
    const response = await axiosInstance.put(
      `/api/v1/employees/${id}`,
      normalizedData,
      {
        headers: {
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
    throw new Error(
      `Failed to update employee: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}

export async function inactivateEmployee(id: number): Promise<boolean> {
  try {
    const response = await axiosInstance.put(
      `/api/v1/employees/${id}/inactivate`,
      {}
    );
    if (response.status === 204) {
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
    throw new Error(
      `Failed to mark employee as inactive: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}

interface RecruitersResponse {
  $id: string;
  $values: Recruiter[];
}

export async function getRecruiters(): Promise<RecruitersResponse> {
  try {
    const response = await axiosInstance.get("/api/v1/employees/recruiters");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching recruiters:", error);
    throw new Error(
      `Failed to fetch recruiters: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}
