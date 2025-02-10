"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useInactivityTimeout } from "../contexts/InactivityTimeoutContext"

export const useInactivityTimeoutHook = () => {
  const router = useRouter()
  const { timeoutDuration } = useInactivityTimeout()
  const [isWarningVisible, setIsWarningVisible] = useState(false)
  const [lastActivity, setLastActivity] = useState(Date.now())

  const resetTimer = useCallback(() => {
    setLastActivity(Date.now())
    setIsWarningVisible(false)
  }, [])

  const logout = useCallback(() => {
    // Clear authentication state
    localStorage.removeItem("isAuthenticated")
    // Redirect to login page
    router.push("/login")
  }, [router])

  useEffect(() => {
    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"]

    const handleActivity = () => {
      resetTimer()
    }

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity)
    })

    const intervalId = setInterval(() => {
      const currentTime = Date.now()
      const timeSinceLastActivity = currentTime - lastActivity

      if (timeSinceLastActivity >= timeoutDuration - 120000) {
        // 2 minutes before timeout
        setIsWarningVisible(true)
      }

      if (timeSinceLastActivity >= timeoutDuration) {
        logout()
      }
    }, 1000)

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
      clearInterval(intervalId)
    }
  }, [lastActivity, timeoutDuration, logout, resetTimer])

  return { isWarningVisible, resetTimer }
}

