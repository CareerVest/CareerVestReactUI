"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    marketingEmails: true,
  })

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated preferences to your backend
    console.log("Updated notification preferences:", preferences)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="emailNotifications">Email Notifications</Label>
        <Switch
          id="emailNotifications"
          checked={preferences.emailNotifications}
          onCheckedChange={() => handleToggle("emailNotifications")}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="pushNotifications">Push Notifications</Label>
        <Switch
          id="pushNotifications"
          checked={preferences.pushNotifications}
          onCheckedChange={() => handleToggle("pushNotifications")}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="smsNotifications">SMS Notifications</Label>
        <Switch
          id="smsNotifications"
          checked={preferences.smsNotifications}
          onCheckedChange={() => handleToggle("smsNotifications")}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="marketingEmails">Marketing Emails</Label>
        <Switch
          id="marketingEmails"
          checked={preferences.marketingEmails}
          onCheckedChange={() => handleToggle("marketingEmails")}
        />
      </div>
      <Button type="submit">Save Preferences</Button>
    </form>
  )
}

