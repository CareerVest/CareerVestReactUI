"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function SecuritySettings() {
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    passwordLastChanged: "2023-01-01",
  })

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const handleToggle = () => {
    setSettings((prev) => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated security settings to your backend
    console.log("Updated security settings:", settings)
    console.log("New password:", passwords.new)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
        <Switch id="twoFactorAuth" checked={settings.twoFactorAuth} onCheckedChange={handleToggle} />
      </div>
      <div className="space-y-2">
        <Label>Password Last Changed</Label>
        <p>{settings.passwordLastChanged}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          name="current"
          type="password"
          value={passwords.current}
          onChange={handlePasswordChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input id="newPassword" name="new" type="password" value={passwords.new} onChange={handlePasswordChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          name="confirm"
          type="password"
          value={passwords.confirm}
          onChange={handlePasswordChange}
        />
      </div>
      <Button type="submit">Update Security Settings</Button>
    </form>
  )
}

