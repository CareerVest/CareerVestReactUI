"use client"

import type React from "react"
import { createContext, useContext, type ReactNode, useEffect } from "react"
import { useAuth as useMsalAuth } from "../hooks/useAuth"

interface AuthContextType {
  isAuthenticated: boolean
  user: any | null
  login: () => Promise<boolean>
  logout: () => void
  isInitialized: boolean
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, login, logout, isInitialized, isLoading, error } = useMsalAuth()

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User authenticated:", user)
    }
  }, [isAuthenticated, user])

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    isInitialized,
    isLoading,
    error,
  }

  if (!isInitialized) {
    return <div>Initializing authentication...</div>
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

