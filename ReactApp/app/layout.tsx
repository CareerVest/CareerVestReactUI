"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useRouter, usePathname } from "next/navigation";
import { theme } from "../styles/theme";
import Sidebar from "./sharedComponents/sidebar";
import { InactivityTimeoutProvider } from "../contexts/inactivityTimeoutContext";
import { useInactivityTimeoutHook } from "../hooks/useInactivityTimout";
import { InactivityWarning } from "./sharedComponents/inactivityWarning";
import { AuthProvider } from "../contexts/authContext"; // Removed useAuth import
import "../styles/globals.css"; // ✅ Ensure styles are imported globally
import permissions from "./utils/permissions"; // Import for Sidebar

const InactivityWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isWarningVisible, resetTimer } = useInactivityTimeoutHook();

  return (
    <>
      {children}
      <InactivityWarning isOpen={isWarningVisible} onStayLoggedIn={resetTimer} />
    </>
  );
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // Derive userRole from localStorage instead of useAuth
  const [userRole, setUserRole] = useState<string>("default");

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("isAuthenticated") === "true";
      setIsAuthenticated(auth);

      // Redirect to login if not authenticated and not already on login page
      if (!auth && !isLoginPage) {
        router.replace("/login");
      }

      // Derive userRole from localStorage or roles if available
      const storedRoles = localStorage.getItem("roles");
      if (storedRoles) {
        const roles = JSON.parse(storedRoles) as string[];
        setUserRole(
          roles.length > 0
            ? (roles.includes("Admin")
                ? "Admin"
                : roles.includes("Sales_Executive")
                  ? "Sales_Executive"
                  : roles.includes("Senior_Recruiter")
                    ? "Senior_Recruiter"
                    : roles.includes("recruiter")
                      ? "recruiter"
                      : roles.includes("Resume_Writer")
                        ? "Resume_Writer"
                        : "default")
            : "default"
        );
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [pathname, router]);

  // **Prevent any rendering until authentication state is checked**
  if (isAuthenticated === null) {
    return (
      <html lang="en">
        <body>
          <div style={{ textAlign: "center", marginTop: "20%" }}>Loading...</div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <InactivityTimeoutProvider>
              {isLoginPage ? (
                children
              ) : (
                <InactivityWrapper>
                  <Box sx={{ minHeight: "100vh" }}>
                    {isAuthenticated && <Sidebar permissions={permissions} userRole={userRole} />}
                    <Box
                      component="main"
                      sx={{
                        flexGrow: 1,
                        bgcolor: "background.default",
                        width: { xs: "calc(100% - 80px)", sm: "calc(100% - 280px)" },
                        position: "relative",
                        left: { xs: "80px", sm: "280px" },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {children}
                    </Box>
                  </Box>
                </InactivityWrapper>
              )}
            </InactivityTimeoutProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}