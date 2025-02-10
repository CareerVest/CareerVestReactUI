"use client"

import { useState, useEffect, useCallback } from "react"
import { PublicClientApplication } from "@azure/msal-browser"

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

let msalInstance = null

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const initializeMsal = useCallback(async () => {
    if (!msalInstance) {
      msalInstance = new PublicClientApplication(msalConfig)
      await msalInstance.initialize()
    }
    setIsInitialized(true)

    const accounts = msalInstance.getAllAccounts()
    if (accounts.length > 0) {
      setIsAuthenticated(true)
      setUser(accounts[0])
    }
  }, [])

  useEffect(() => {
    initializeMsal()
  }, [initializeMsal])

  const login = useCallback(async () => {
    if (!isInitialized) {
      throw new Error("MSAL is not initialized yet")
    }

    try {
      const loginResponse = await msalInstance.loginPopup({
        scopes: ["openid", "profile", "User.Read"],
      })

      setIsAuthenticated(true)
      setUser(loginResponse.account)
      localStorage.setItem("jwtToken", loginResponse.idToken) // Store token in localStorage
      return true
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }, [isInitialized])

  const logout = useCallback(() => {
    msalInstance.logout()
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem("jwtToken")
  }, [])

  return {
    isAuthenticated,
    user,
    login,
    logout,
    isInitialized,
  }
}