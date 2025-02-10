"use client"

import type React from "react"
import { useEffect } from "react"
import { Box } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import { usePathname, useRouter } from "next/navigation"
import { theme } from "./styles/theme"
import Sidebar from "./components/shared/Sidebar"
import { InactivityTimeoutProvider } from "./contexts/InactivityTimeoutContext"
import { useInactivityTimeoutHook } from "./hooks/useInactivityTimeout"
import { InactivityWarning } from "./components/shared/InactivityWarning"
import { useAuth } from "./hooks/useAuth"

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
  const { isAuthenticated, isInitialized } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isInitialized && !isAuthenticated && pathname !== "/login") {
      router.push("/login")
    }
  }, [isInitialized, isAuthenticated, pathname, router])

  if (!isInitialized) {
    return <div>Loading...</div>
  }

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <InactivityTimeoutProvider>
            {pathname === "/login" || !isAuthenticated ? (
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
      </body>
    </html>
  )
}

import "./globals.css"

