"use client"

import { useState, useEffect, useCallback } from "react"
import { PublicClientApplication, EventType } from "@azure/msal-browser"

const msalConfig = {
  auth: {
    clientId: "3b5b4b15-81ff-4c83-a9fd-569dc8fdf282",
    authority: "https://login.microsoftonline.com/afd6b282-b8b0-4dbb-9985-f5c3249623f9",
    redirectUri: "http://localhost:3000", // Should be the same as in Azure AD app registration
  },
  cache: {
    cacheLocation: "localStorage", // This ensures that the authentication state is preserved
  },
}

let msalInstance: PublicClientApplication | null = null

const clearMsalInstance = () => {
  if (msalInstance) {
    msalInstance.clearCache()
    msalInstance = null
  }
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const initializeMsal = useCallback(async () => {
    if (!msalInstance) {
      msalInstance = new PublicClientApplication(msalConfig)
      msalInstance.addEventCallback((event: any) => {
        if (event.eventType === EventType.LOGIN_SUCCESS) {
          console.log("Login successful in event callback")
        } else if (event.eventType === EventType.LOGIN_FAILURE) {
          console.error("Login failed in event callback:", event.error)
          setError(event.error.message)
        } else if (event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
          console.log("Token acquired successfully")
        } else if (event.eventType === EventType.ACQUIRE_TOKEN_FAILURE) {
          console.error("Token acquisition failed:", event.error)
          setError(event.error.message)
        } else if (event.eventType === EventType.LOGOUT_SUCCESS) {
          console.log("Logout successful in event callback")
        } else if (event.eventType === EventType.LOGOUT_FAILURE) {
          console.error("Logout failed in event callback:", event.error)
          setError(event.error.message)
        }
      })
      try {
        await msalInstance.initialize()
        // Clear any existing sessions on initialization
        const accounts = msalInstance.getAllAccounts()
        if (accounts.length > 0) {
          await msalInstance.logoutPopup()
        }
      } catch (error: any) {
        setError(error.message)
      }
    }
    setIsInitialized(true)
    setIsLoading(false)

    // Remove the automatic login check here
    setIsAuthenticated(false)
    setUser(null)
  }, [])

  useEffect(() => {
    initializeMsal()
  }, [initializeMsal])

  const login = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    if (!isInitialized) {
      throw new Error("MSAL is not initialized yet")
    }

    try {
      if (!msalInstance) {
        msalInstance = new PublicClientApplication(msalConfig)
        await msalInstance.initialize()
      }

      // Clear any existing sessions
      const accounts = msalInstance.getAllAccounts()
      if (accounts.length > 0) {
        await msalInstance.logoutPopup()
      }

      // Force account selection and login
      const loginResponse = await msalInstance.loginPopup({
        scopes: ["openid", "profile", "User.Read"],
        prompt: "select_account", // This forces the account selection popup
      })

      const userData = {
        name: loginResponse.account.name,
        username: loginResponse.account.username,
        email: loginResponse.account.username,
      }

      setIsAuthenticated(true)
      setUser(userData)
      localStorage.setItem("jwtToken", loginResponse.idToken)
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("user", JSON.stringify(userData))
      console.log("Login successful in useAuth")
      setIsLoading(false)
      return true
    } catch (error: any) {
      console.error("Login failed:", error)
      setError(error.message)
      setIsLoading(false)
      throw error
    }
  }, [isInitialized])

  const logout = useCallback(() => {
    setIsLoading(true)
    setError(null)

    // Get the active account before clearing anything
    const activeAccount = msalInstance?.getActiveAccount()

    // Clear all storage immediately
    localStorage.clear()
    sessionStorage.clear()
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
    })

    // Update state
    setIsAuthenticated(false)
    setUser(null)

    if (msalInstance && activeAccount) {
      // Use the end_session_endpoint directly
      const logoutRequest = {
        account: activeAccount,
        postLogoutRedirectUri: window.location.origin + "/login",
        authority: activeAccount.tenantId
          ? `https://login.microsoftonline.com/${activeAccount.tenantId}`
          : msalConfig.auth.authority,
      }

      msalInstance.logoutRedirect(logoutRequest).catch((error) => {
        console.error("Logout failed:", error)
        setError(error.message)
      })
    } else {
      // If no MSAL instance or no active account, just redirect
      window.location.href = "/login"
    }

    clearMsalInstance()
    setIsLoading(false)
  }, [])

  return {
    isAuthenticated,
    user,
    login,
    logout,
    isInitialized,
    isLoading,
    error,
  }
}

