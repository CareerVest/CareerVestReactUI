"use client"

import { useState } from "react"
import { FilterBar } from "./FilterBar"
import { KanbanBoard } from "./KanbanBoard"
import { InterviewSidebar } from "./InterviewSidebar"
import { ApplicationCountsSidebar } from "./ApplicationCountsSidebar"
import { AddInterviewButton } from "./AddInterviewButton"
import { Button } from "@/components/ui/button"
import { clients } from "@/data/mockData"
import type { Interview, FilterState } from "@/types/marketing"

export default function MarketingActivityDashboard() {
  const [standupMode, setStandupMode] = useState(true)
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [isAddingInterview, setIsAddingInterview] = useState(false)
  const [isApplicationCountsOpen, setIsApplicationCountsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    recruiter: "all",
    dateRange: [null, null],
    status: "all",
    type: "all",
  })

  const handleInterviewClick = (interview: Interview) => {
    setSelectedInterview(interview)
    setIsApplicationCountsOpen(false)
  }

  const handleCloseInterview = () => {
    setSelectedInterview(null)
    setIsAddingInterview(false)
  }

  const handleUpdateInterview = (updatedInterview: Interview) => {
    // In a real app, this would make an API call
    console.log("Updating interview:", updatedInterview)
    setSelectedInterview(null)
  }

  const handleAddInterview = (newInterview: Interview) => {
    // In a real app, this would make an API call
    console.log("Adding new interview:", newInterview)
    setIsAddingInterview(false)
  }

  const handleOpenApplicationCounts = () => {
    setIsApplicationCountsOpen(true)
    setSelectedInterview(null)
    setIsAddingInterview(false)
  }

  const handleCloseApplicationCounts = () => {
    setIsApplicationCountsOpen(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#682A53]">Marketing Activity</h1>
        <div className="flex space-x-4">
          <AddInterviewButton onClick={() => setIsAddingInterview(true)} />
          <Button
            onClick={handleOpenApplicationCounts}
            className="bg-[#FDC500] text-[#682A53] hover:bg-[#682A53] hover:text-white"
          >
            Add Daily Application Counts
          </Button>
        </div>
      </div>
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        standupMode={standupMode}
        onStandupModeChange={setStandupMode}
      />
      <KanbanBoard
        clients={clients}
        filters={filters}
        standupMode={standupMode}
        onInterviewClick={handleInterviewClick}
        onAddInterview={() => setIsAddingInterview(true)}
      />
      <InterviewSidebar
        interview={selectedInterview}
        isOpen={!!selectedInterview || isAddingInterview}
        onClose={handleCloseInterview}
        onUpdate={handleUpdateInterview}
        onAdd={handleAddInterview}
      />
      <ApplicationCountsSidebar
        isOpen={isApplicationCountsOpen}
        onClose={handleCloseApplicationCounts}
        clients={clients}
      />
    </div>
  )
}

