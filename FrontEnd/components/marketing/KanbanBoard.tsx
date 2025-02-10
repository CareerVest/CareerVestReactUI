"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ClientCard } from "./ClientCard"
import { InterviewSidebar } from "./InterviewSidebar"
import type { Client, Interview, FilterState } from "@/types/marketing"

interface InterviewStats {
  screening: number
  technical: number
  finalRound: number
  total: number
}

interface KanbanBoardProps {
  clients: Client[]
  filters: FilterState
  standupMode: boolean
  onInterviewClick: (interview: Interview) => void
  onAddInterview: () => void
}

export function KanbanBoard({ clients, filters, standupMode, onInterviewClick, onAddInterview }: KanbanBoardProps) {
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [isAddingInterview, setIsAddingInterview] = useState(false)

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      if (filters.recruiter && filters.recruiter !== "all" && client.recruiterId !== filters.recruiter) {
        return false
      }

      const clientInterviews = client.interviews.filter((interview) => {
        if (filters.status && filters.status !== "all" && interview.status !== filters.status) {
          return false
        }
        if (filters.type && filters.type !== "all" && interview.type !== filters.type) {
          return false
        }
        if (filters.dateRange[0] && filters.dateRange[1]) {
          const interviewDate = new Date(interview.date)
          return interviewDate >= filters.dateRange[0] && interviewDate <= filters.dateRange[1]
        }
        return true
      })

      return clientInterviews.length > 0
    })
  }, [clients, filters])

  const getTodayInterviewStats = (status: "completed" | "scheduled"): InterviewStats => {
    const today = new Date().toDateString()
    const stats = {
      screening: 0,
      technical: 0,
      finalRound: 0,
      total: 0,
    }

    filteredClients.forEach((client) => {
      client.interviews.forEach((interview) => {
        const interviewDate = new Date(interview.date).toDateString()
        if (interviewDate === today && interview.status === status) {
          stats.total++
          if (interview.type === "Screening") stats.screening++
          if (interview.type === "Technical") stats.technical++
          if (interview.type === "Final Round") stats.finalRound++
        }
      })
    })

    return stats
  }

  const receivedStats = getTodayInterviewStats("completed")
  const scheduledStats = getTodayInterviewStats("scheduled")

  const handleAddInterview = () => {
    setIsAddingInterview(true)
  }

  const handleInterviewUpdate = (updatedInterview: Interview) => {
    // Here you would typically update the interview in your data store
    console.log("Updated interview:", updatedInterview)
    setSelectedInterview(null)
  }

  const handleInterviewAdd = (newInterview: Interview) => {
    // Here you would typically add the new interview to your data store
    console.log("New interview:", newInterview)
    setIsAddingInterview(false)
  }

  if (standupMode) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#682A53]">Marketing Activity Dashboard</h2>
          {/* <AddInterviewButton onClick={onAddInterview} /> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4 border-2 border-[#682A53]/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#682A53]">Today's Received Interviews</h2>
                <Badge variant="secondary" className="text-base px-3 py-1 bg-[#FDC500] text-[#682A53]">
                  {receivedStats.total}
                </Badge>
              </div>
              <Card className="p-4 bg-[#682A53]/5 border-none">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#682A53]">{receivedStats.screening}</div>
                    <div className="text-sm text-[#682A53]/70">Screening</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#682A53]">{receivedStats.technical}</div>
                    <div className="text-sm text-[#682A53]/70">Technical</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#682A53]">{receivedStats.finalRound}</div>
                    <div className="text-sm text-[#682A53]/70">Final Round</div>
                  </div>
                </div>
              </Card>
              <ScrollArea className="h-[calc(100vh-340px)] overflow-y-auto pr-4">
                <div className="space-y-4 pb-4">
                  {filteredClients.map((client) => (
                    <ClientCard
                      key={client.id}
                      client={client}
                      showOnlyToday={true}
                      showOnlyStatus="completed"
                      onInterviewClick={onInterviewClick}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </Card>
          <Card className="p-4 border-2 border-[#682A53]/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#682A53]">Today's Scheduled Interviews</h2>
                <Badge variant="secondary" className="text-base px-3 py-1 bg-[#FDC500] text-[#682A53]">
                  {scheduledStats.total}
                </Badge>
              </div>
              <Card className="p-4 bg-[#682A53]/5 border-none">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#682A53]">{scheduledStats.screening}</div>
                    <div className="text-sm text-[#682A53]/70">Screening</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#682A53]">{scheduledStats.technical}</div>
                    <div className="text-sm text-[#682A53]/70">Technical</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#682A53]">{scheduledStats.finalRound}</div>
                    <div className="text-sm text-[#682A53]/70">Final Round</div>
                  </div>
                </div>
              </Card>
              <ScrollArea className="h-[calc(100vh-340px)] overflow-y-auto pr-4">
                <div className="space-y-4 pb-4">
                  {filteredClients.map((client) => (
                    <ClientCard
                      key={client.id}
                      client={client}
                      showOnlyToday={true}
                      showOnlyStatus="scheduled"
                      onInterviewClick={onInterviewClick}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#682A53]">Marketing Activity Dashboard</h2>
        {/* <AddInterviewButton onClick={onAddInterview} /> */}
      </div>
      <ScrollArea className="w-full">
        <div className="space-y-4 pb-4">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} showOnlyToday={false} onInterviewClick={onInterviewClick} />
          ))}
        </div>
      </ScrollArea>
      <InterviewSidebar
        interview={selectedInterview}
        onClose={() => setSelectedInterview(null)}
        onUpdate={handleInterviewUpdate}
      />
      <InterviewSidebar
        interview={null}
        onClose={() => setIsAddingInterview(false)}
        onUpdate={handleInterviewAdd}
        onAdd={handleInterviewAdd}
      />
    </div>
  )
}

