"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Interview } from "@/types/marketing"
import { fetchRecruiters, fetchClients } from "@/app/actions/marketingActions"

interface InterviewSidebarProps {
  interview: Interview | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (interview: Interview) => void
  onAdd: (interview: Interview) => void
}

export function InterviewSidebar({ interview, isOpen, onClose, onUpdate, onAdd }: InterviewSidebarProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedInterview, setEditedInterview] = useState<Interview | null>(null)
  const [recruiters, setRecruiters] = useState<{ id: string; name: string }[]>([])
  const [clients, setClients] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    const loadData = async () => {
      const [recruiterData, clientData] = await Promise.all([fetchRecruiters(), fetchClients()])
      setRecruiters(recruiterData)
      setClients(clientData)
    }
    loadData()
  }, [])

  useEffect(() => {
    if (interview) {
      setEditedInterview(interview)
      setIsEditing(!interview)
    } else {
      setEditedInterview({
        id: "",
        clientId: "",
        clientName: "",
        type: "Screening",
        tech: "",
        status: "scheduled",
        time: "",
        date: new Date().toISOString().split("T")[0],
        entryDate: new Date().toISOString().split("T")[0],
        company: "",
        notes: "",
        feedback: "",
      })
      setIsEditing(true)
    }
  }, [interview])

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedInterview(interview)
  }

  const handleChange = (field: keyof Interview, value: string) => {
    setEditedInterview((prev) => {
      if (!prev) return prev
      return { ...prev, [field]: value }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editedInterview) {
      if (interview) {
        onUpdate(editedInterview)
      } else {
        onAdd(editedInterview)
      }
      setIsEditing(false)
    }
  }

  if (!editedInterview) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] border-l border-[#682A53]/10">
        <SheetHeader>
          <SheetTitle className="text-[#682A53] text-xl font-semibold">
            {interview ? (isEditing ? "Edit Interview" : "Interview Details") : "Add Interview"}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientId" className="text-[#682A53]">
                  Client
                </Label>
                <Select
                  value={editedInterview.clientId}
                  onValueChange={(value) => handleChange("clientId", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="border-[#682A53]/20">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-[#682A53]">
                  Company
                </Label>
                <Input
                  id="company"
                  value={editedInterview.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className="border-[#682A53]/20 focus-visible:ring-[#682A53]"
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-[#682A53]">
                  Interview Type
                </Label>
                <Select
                  value={editedInterview.type}
                  onValueChange={(value) => handleChange("type", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="border-[#682A53]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Screening">Screening</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Final Round">Final Round</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-[#682A53]">
                  Status
                </Label>
                <Select
                  value={editedInterview.status}
                  onValueChange={(value) => handleChange("status", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="border-[#682A53]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tech" className="text-[#682A53]">
                  Technology/Role
                </Label>
                <Input
                  id="tech"
                  value={editedInterview.tech}
                  onChange={(e) => handleChange("tech", e.target.value)}
                  className="border-[#682A53]/20 focus-visible:ring-[#682A53]"
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="text-[#682A53]">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={editedInterview.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className="border-[#682A53]/20 focus-visible:ring-[#682A53]"
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-[#682A53]">
                  Time
                </Label>
                <Input
                  id="time"
                  value={editedInterview.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                  className="border-[#682A53]/20 focus-visible:ring-[#682A53]"
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-[#682A53]">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={editedInterview.notes || ""}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  rows={4}
                  className="border-[#682A53]/20 focus-visible:ring-[#682A53]"
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback" className="text-[#682A53]">
                  Feedback
                </Label>
                <Textarea
                  id="feedback"
                  value={editedInterview.feedback || ""}
                  onChange={(e) => handleChange("feedback", e.target.value)}
                  rows={4}
                  className="border-[#682A53]/20 focus-visible:ring-[#682A53]"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="border-[#682A53]/20 hover:bg-[#682A53] hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#FDC500] text-[#682A53] hover:bg-[#682A53] hover:text-white">
                    {interview ? "Save Changes" : "Add Interview"}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleEditClick}
                  className="bg-[#FDC500] text-[#682A53] hover:bg-[#682A53] hover:text-white"
                >
                  Edit Interview
                </Button>
              )}
            </div>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

