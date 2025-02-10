"use client"

import { useState, useEffect } from "react"
import { useInactivityTimeout } from "@/app/contexts/InactivityTimeoutContext"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SystemConfigurations() {
  const [configs, setConfigs] = useState({
    defaultCurrency: "USD",
    dateFormat: "MM/DD/YYYY",
    timeZone: "UTC",
    language: "en",
  })

  const { timeoutDuration, setTimeoutDuration } = useInactivityTimeout()
  const [localTimeoutDuration, setLocalTimeoutDuration] = useState(timeoutDuration / 60000) // Convert to minutes

  useEffect(() => {
    setLocalTimeoutDuration(timeoutDuration / 60000)
  }, [timeoutDuration])

  const handleInputChange = (key: keyof typeof configs, value: string) => {
    setConfigs((prev) => ({ ...prev, [key]: value }))
  }

  const handleTimeoutDurationChange = (value: string) => {
    const duration = Number.parseInt(value, 10)
    setLocalTimeoutDuration(duration)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Update the timeout duration in the context
    setTimeoutDuration(localTimeoutDuration * 60000) // Convert minutes to milliseconds
    // Here you would typically send the updated configurations to your backend
    console.log("Updated system configurations:", {
      ...configs,
      timeoutDuration: localTimeoutDuration,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="defaultCurrency">Default Currency</Label>
        <Select value={configs.defaultCurrency} onValueChange={(value) => handleInputChange("defaultCurrency", value)}>
          <SelectTrigger id="defaultCurrency">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="GBP">GBP</SelectItem>
            <SelectItem value="JPY">JPY</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dateFormat">Date Format</Label>
        <Select value={configs.dateFormat} onValueChange={(value) => handleInputChange("dateFormat", value)}>
          <SelectTrigger id="dateFormat">
            <SelectValue placeholder="Select date format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="timeZone">Time Zone</Label>
        <Select value={configs.timeZone} onValueChange={(value) => handleInputChange("timeZone", value)}>
          <SelectTrigger id="timeZone">
            <SelectValue placeholder="Select time zone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UTC">UTC</SelectItem>
            <SelectItem value="EST">EST</SelectItem>
            <SelectItem value="PST">PST</SelectItem>
            <SelectItem value="GMT">GMT</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select value={configs.language} onValueChange={(value) => handleInputChange("language", value)}>
          <SelectTrigger id="language">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="timeoutDuration">Inactivity Timeout (minutes)</Label>
        <Select value={localTimeoutDuration.toString()} onValueChange={handleTimeoutDurationChange}>
          <SelectTrigger id="timeoutDuration">
            <SelectValue placeholder="Select timeout duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15</SelectItem>
            <SelectItem value="30">30</SelectItem>
            <SelectItem value="45">45</SelectItem>
            <SelectItem value="60">60</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Save Configurations</Button>
    </form>
  )
}

