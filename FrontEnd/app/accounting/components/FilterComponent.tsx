"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"

export function FilterComponent({ onFilterChange }) {
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined })
  const [client, setClient] = useState("all")
  const [paymentStatus, setPaymentStatus] = useState("all")
  const [paymentType, setPaymentType] = useState("all")

  const handleApplyFilters = () => {
    onFilterChange({ dateRange, client, paymentStatus, paymentType })
  }

  const handleResetFilters = () => {
    setDateRange({ from: undefined, to: undefined })
    setClient("all")
    setPaymentStatus("all")
    setPaymentType("all")
    onFilterChange({
      dateRange: { from: undefined, to: undefined },
      client: "all",
      paymentStatus: "all",
      paymentType: "all",
    })
  }

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <DatePickerWithRange date={dateRange} setDate={setDateRange} />
      <Select value={client} onValueChange={setClient}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select client" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Clients</SelectItem>
          <SelectItem value="acme">Acme Corp</SelectItem>
          <SelectItem value="globex">Globex Inc</SelectItem>
          <SelectItem value="initech">Initech</SelectItem>
          <SelectItem value="umbrella">Umbrella Corp</SelectItem>
          <SelectItem value="hooli">Hooli</SelectItem>
        </SelectContent>
      </Select>
      <Select value={paymentStatus} onValueChange={setPaymentStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
        </SelectContent>
      </Select>
      <Select value={paymentType} onValueChange={setPaymentType}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="subscription">Subscription</SelectItem>
          <SelectItem value="post-placement">Post-Placement</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleApplyFilters} className="bg-[#FDC500] text-[#682A53] hover:bg-[#682A53] hover:text-white">
        Apply Filters
      </Button>
      <Button onClick={handleResetFilters} className="bg-[#FDC500] text-[#682A53] hover:bg-[#682A53] hover:text-white">
        Reset Filters
      </Button>
    </div>
  )
}

