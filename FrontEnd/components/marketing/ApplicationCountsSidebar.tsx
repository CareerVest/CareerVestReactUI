"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Client } from "@/types/marketing"

interface ApplicationCounts {
  totalManualApplications: number
  totalEasyApplications: number
  totalReceivedInterviews: number
}

interface ApplicationCountsSidebarProps {
  isOpen: boolean
  onClose: () => void
  clients: Client[]
}

export function ApplicationCountsSidebar({ isOpen, onClose, clients }: ApplicationCountsSidebarProps) {
  const [applicationCounts, setApplicationCounts] = useState<Record<string, ApplicationCounts>>({})

  const handleInputChange = (clientId: string, field: keyof ApplicationCounts, value: string) => {
    const numValue = Number.parseInt(value, 10) || 0
    setApplicationCounts((prev) => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        [field]: numValue,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated application counts to your backend
    console.log("Submitting application counts:", applicationCounts)
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] border-l border-[#682A53]/10">
        <SheetHeader>
          <SheetTitle className="text-[#682A53] text-xl font-semibold">Daily Application Counts</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {clients.map((client) => (
              <div key={client.id} className="space-y-4 border-b border-[#682A53]/10 pb-4">
                <h3 className="font-semibold text-[#682A53]">{client.name}</h3>
                <div className="space-y-2">
                  <Label htmlFor={`manual-${client.id}`}>Total Manual Applications</Label>
                  <Input
                    id={`manual-${client.id}`}
                    type="number"
                    min="0"
                    value={applicationCounts[client.id]?.totalManualApplications || ""}
                    onChange={(e) => handleInputChange(client.id, "totalManualApplications", e.target.value)}
                    className="border-[#682A53]/20 focus-visible:ring-[#682A53]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`easy-${client.id}`}>Total Easy Applications</Label>
                  <Input
                    id={`easy-${client.id}`}
                    type="number"
                    min="0"
                    value={applicationCounts[client.id]?.totalEasyApplications || ""}
                    onChange={(e) => handleInputChange(client.id, "totalEasyApplications", e.target.value)}
                    className="border-[#682A53]/20 focus-visible:ring-[#682A53]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`interviews-${client.id}`}>Total Received Interviews</Label>
                  <Input
                    id={`interviews-${client.id}`}
                    type="number"
                    min="0"
                    value={applicationCounts[client.id]?.totalReceivedInterviews || ""}
                    onChange={(e) => handleInputChange(client.id, "totalReceivedInterviews", e.target.value)}
                    className="border-[#682A53]/20 focus-visible:ring-[#682A53]"
                  />
                </div>
              </div>
            ))}
            <Button type="submit" className="w-full bg-[#FDC500] text-[#682A53] hover:bg-[#682A53] hover:text-white">
              Submit Application Counts
            </Button>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

