"use client"

import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { recruiters } from "@/data/mockData"
import type { FilterState } from "@/types/marketing"

interface FilterBarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  standupMode: boolean
  onStandupModeChange: (enabled: boolean) => void
}

export function FilterBar({ filters, onFiltersChange, standupMode, onStandupModeChange }: FilterBarProps) {
  return (
    <Card className="p-4 mb-4 border border-[#682A53]/10">
      <div className="flex items-center gap-4">
        <Select value={filters.recruiter} onValueChange={(value) => onFiltersChange({ ...filters, recruiter: value })}>
          <SelectTrigger className="w-[150px] border-[#682A53]/20">
            <SelectValue placeholder="Recruiter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Recruiters</SelectItem>
            {recruiters.map((recruiter) => (
              <SelectItem key={recruiter.id} value={recruiter.id}>
                {recruiter.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-start text-left font-normal border-[#682A53]/20">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange[0] ? filters.dateRange[0].toLocaleDateString() : "Date Range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{
                from: filters.dateRange[0] || undefined,
                to: filters.dateRange[1] || undefined,
              }}
              onSelect={(range) =>
                onFiltersChange({
                  ...filters,
                  dateRange: [range?.from || null, range?.to || null],
                })
              }
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Select value={filters.status} onValueChange={(value) => onFiltersChange({ ...filters, status: value })}>
          <SelectTrigger className="w-[120px] border-[#682A53]/20">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.type} onValueChange={(value) => onFiltersChange({ ...filters, type: value })}>
          <SelectTrigger className="w-[120px] border-[#682A53]/20">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Screening">Screening</SelectItem>
            <SelectItem value="Technical">Technical</SelectItem>
            <SelectItem value="Final Round">Final Round</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Switch id="standup-mode" checked={standupMode} onCheckedChange={onStandupModeChange} />
          <Label htmlFor="standup-mode" className="text-[#682A53]">
            Standup Mode
          </Label>
        </div>

        <Button
          variant="outline"
          onClick={() =>
            onFiltersChange({
              recruiter: recruiters[0].id,
              dateRange: [null, null],
              status: "all",
              type: "all",
            })
          }
          className="ml-auto border-[#682A53]/20 hover:bg-[#682A53] hover:text-white"
        >
          Clear Filters
        </Button>
      </div>
    </Card>
  )
}

