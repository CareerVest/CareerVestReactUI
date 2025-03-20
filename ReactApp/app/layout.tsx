"use client";

import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useRouter, usePathname } from "next/navigation";
import { theme } from "../styles/theme";
import { AuthProvider, useAuth } from "../contexts/authContext";
import { setAxiosGetToken } from "@/app/utils/axiosInstance";
import { useInactivity } from "@/hooks/useInactivityTimout";
import Sidebar from "./sharedComponents/sidebar";
import permissions from "./utils/permissions";
import InactivityPopup from "./inactivity/components/inactivityPopup";

// InnerContent component to use useAuth within AuthProvider
function InnerContent({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const { isAuthenticated, isInitialized, getToken, roles } = useAuth();
  const [userRole, setUserRole] = useState<string>("default");
  const [isLoading, setIsLoading] = useState(true);

  // Use the updated inactivity hook (30 minutes initial, 30 seconds countdown)
  const { isInactive, timeLeft, handleExtendSession, handleLogout } =
    useInactivity(30, 30);

  useEffect(() => {
    if (!isInitialized) return;

    setIsLoading(false);

    if (isAuthenticated) {
      setAxiosGetToken(getToken);
      const role =
        roles.length > 0
          ? roles.includes("Admin")
            ? "Admin"
            : roles.includes("Sales_Executive")
            ? "Sales_Executive"
            : roles.includes("Senior_Recruiter")
            ? "Senior_Recruiter"
            : roles.includes("recruiter")
            ? "recruiter"
            : roles.includes("Resume_Writer")
            ? "Resume_Writer"
            : "default"
          : "default";
      setUserRole(role);
    } else if (!isLoginPage) {
      router.replace("/login");
    }
  }, [isAuthenticated, isInitialized, pathname, router, getToken, roles]);

  if (isLoading || !isInitialized) {
    return (
      <div style={{ textAlign: "center", marginTop: "20%" }}>Loading...</div>
    );
  }

  const sidebarWidthExpanded = 280;
  const sidebarWidthCollapsed = 80;

  return (
    <>
      {isLoginPage ? (
        children
      ) : (
        <Box sx={{ minHeight: "100vh", display: "flex" }}>
          {isAuthenticated && (
            <Sidebar
              permissions={permissions}
              userRole={userRole}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          )}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: "background.default",
              width: `calc(100% - ${
                isCollapsed ? sidebarWidthCollapsed : sidebarWidthExpanded
              }px)`,
              transition: "width 0.3s ease",
            }}
          >
            {children}
          </Box>
        </Box>
      )}
      {isAuthenticated && (
        <InactivityPopup
          open={isInactive}
          timeLeft={timeLeft}
          onExtend={handleExtendSession}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <div id="app-container">
              <InnerContent>{children}</InnerContent>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
