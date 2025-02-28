"use client";

import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation"; // Changed from "next/router" to "next/navigation"
import { EmployeeList as EmployeeType } from "../types/employees/employeeList"; // Updated path to match separate file
import permissions from "../utils/permissions";
import { fetchEmployees } from "./actions/employeeActions";
import AddEmployeeButton from "./components/AddEmployeeButton";
import EmployeeList from "./components/EmployeeList";
import EmployeeListSkeleton from "./components/EmployeeListSkeleton";

// Remove metadata from client component; move to a layout or server component if needed
export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isInitialized, user, login, roles } = useAuth();
  const router = useRouter();

  // Determine user role with Azure AD casing
  const userRole = roles.length > 0 
    ? (roles.includes("Admin") 
        ? "Admin" 
        : roles.includes("Sales_Executive") 
          ? "Sales_Executive" 
          : roles.includes("Senior_Recruiter") 
            ? "Senior_Recruiter" 
            : roles.includes("recruiter") 
              ? "recruiter" 
              : "default") 
    : "default";

  useEffect(() => {
    if (!isInitialized) return;

    const checkAuthAndLoad = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (!isAuthenticated) {
        try {
          const loginSuccess = await login();
          if (!loginSuccess) {
            router.push("/login");
            return;
          }
        } catch (error) {
          router.push("/login");
          return;
        }
      }

      const loadEmployees = async () => {
        try {
          const fetchedEmployees = await fetchEmployees();
          setEmployees(fetchedEmployees as EmployeeType[]);
        } catch (error) {
          if (error instanceof Error && error.message.includes("Authentication required")) {
            router.push("/login");
          }
        } finally {
          setLoading(false);
        }
      };

      loadEmployees();
    };

    checkAuthAndLoad();
  }, [isAuthenticated, isInitialized, router, login, roles]);

  if (!isInitialized) {
    return <Box sx={{ p: 3 }}>Verifying authentication...</Box>;
  }

  if (!isAuthenticated) {
    return <Box sx={{ p: 3 }}>Redirecting to login...</Box>;
  }

  if (!permissions.employees[userRole].basicInfo.view) {
    return <Box sx={{ p: 3 }}>You do not have permission to view employees.</Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ color: "#682A53" }}>
          Employees
        </Typography>
        {permissions.employees[userRole].addEmployee && <AddEmployeeButton />}
      </Box>
      {loading ? <EmployeeListSkeleton /> : <EmployeeList employees={employees} />}
    </Box>
  );
}

// Optionally, create a server component or layout for metadata if needed
// For example, create `app/employees/layout.tsx` for metadata
// app/employees/layout.tsx
// export const metadata = {
//   title: "Employees | CareerVest",
// };
// export default function EmployeesLayout({ children }: { children: React.ReactNode }) {
//   return <>{children}</>;
// }