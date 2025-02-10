"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface InactivityTimeoutContextType {
  timeoutDuration: number
  setTimeoutDuration: (duration: number) => void
}

const InactivityTimeoutContext = createContext<InactivityTimeoutContextType | undefined>(undefined)

export const useInactivityTimeout = () => {
  const context = useContext(InactivityTimeoutContext)
  if (!context) {
    throw new Error("useInactivityTimeout must be used within an InactivityTimeoutProvider")
  }
  return context
}

export const InactivityTimeoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeoutDuration, setTimeoutDuration] = useState(30 * 60 * 1000) // 30 minutes in milliseconds

  return (
    <InactivityTimeoutContext.Provider value={{ timeoutDuration, setTimeoutDuration }}>
      {children}
    </InactivityTimeoutContext.Provider>
  )
}

