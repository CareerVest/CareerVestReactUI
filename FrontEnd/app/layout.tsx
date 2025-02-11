"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Box } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import { usePathname, useRouter } from "next/navigation"
import { theme } from "./styles/theme"
import Sidebar from "./components/shared/Sidebar"
import { InactivityTimeoutProvider } from "./contexts/InactivityTimeoutContext"
import { useInactivityTimeoutHook } from "./hooks/useInactivityTimeout"
import { InactivityWarning } from "./components/shared/InactivityWarning"
import { AuthProvider } from "./contexts/AuthContext"

const InactivityWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isWarningVisible, resetTimer } = useInactivityTimeoutHook()

  return (
    <>
      {children}
      <InactivityWarning isOpen={isWarningVisible} onStayLoggedIn={resetTimer} />
    </>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("isAuthenticated")
      console.log("Auth state:", auth) // Debugging
      setIsAuthenticated(auth === "true")
      if (auth !== "true" && pathname !== "/login") {
        console.log("Redirecting to login") // Debugging
        router.push("/login")
      }
    }

    checkAuth()
    window.addEventListener("storage", checkAuth)

    return () => {
      window.removeEventListener("storage", checkAuth)
    }
  }, [pathname, router])

  console.log("Current path:", pathname, "isAuthenticated:", isAuthenticated) // Debugging

  if (!isAuthenticated && pathname !== "/login") {
    console.log("Not authenticated, showing loading") // Debugging
    return null // or a loading spinner
  }

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <InactivityTimeoutProvider>
              {pathname === "/login" ? (
                children
              ) : (
                <InactivityWrapper>
                  <Box sx={{ minHeight: "100vh" }}>
                    <Sidebar />
                    <Box
                      component="main"
                      sx={{
                        flexGrow: 1,
                        bgcolor: "background.default",
                        width: { xs: `calc(100% - 80px)`, sm: `calc(100% - 280px)` },
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
  )
}

import "./globals.css"

