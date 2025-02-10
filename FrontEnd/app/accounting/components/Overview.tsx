"use client"

import { useEffect, useState } from "react"
import { MetricCards } from "./MetricCards"
import { PaymentCalendar } from "./PaymentCalendar"
import { FinancialMetrics } from "./FinancialMetrics"
import { ActionCenter } from "./ActionCenter"
import { FilterComponent } from "./FilterComponent"
import { dummyPayments, filterPayments, type Payment } from "../utils/dummyData"

export function Overview() {
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>(dummyPayments)
  const [filters, setFilters] = useState({
    dateRange: { from: undefined, to: undefined },
    client: "all",
    paymentStatus: "all",
    paymentType: "all",
  })

  useEffect(() => {
    const filtered = filterPayments(dummyPayments, filters)
    setFilteredPayments(filtered)
  }, [filters])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="space-y-6">
      <FilterComponent onFilterChange={handleFilterChange} />
      <MetricCards payments={filteredPayments} />
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <FinancialMetrics payments={filteredPayments} filters={filters} />
        </div>
        <PaymentCalendar payments={filteredPayments} />
      </div>
      <ActionCenter payments={filteredPayments} />
    </div>
  )
}

