"use client"

import { Card } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import { calculateTotalDue, calculateTotalCollected, getPaymentStatusCounts, type Payment } from "../utils/dummyData"

export function MetricCards({ payments }: { payments: Payment[] }) {
  const totalDue = calculateTotalDue(payments)
  const totalCollected = calculateTotalCollected(payments)
  const statusCounts = getPaymentStatusCounts(payments)

  const metrics = [
    {
      title: "Total Pending",
      value: `$${(totalDue - totalCollected).toFixed(2)}`,
      change: "+20.5% from last month",
      isPositive: false,
    },
    {
      title: "Collected This Month",
      value: `$${totalCollected.toFixed(2)}`,
      change: "+50.5% from last month",
      isPositive: true,
    },
    {
      title: "Overdue Payments",
      value: statusCounts.overdue || 0,
      change: "+2.5% from last month",
      isPositive: false,
    },
    {
      title: "Collection Rate",
      value: `${((totalCollected / totalDue) * 100).toFixed(1)}%`,
      change: "+5.2% from last month",
      isPositive: true,
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{metric.title}</p>
            <p className="text-2xl font-bold text-[#682A53]">{metric.value}</p>
            <div className="flex items-center text-sm">
              {metric.isPositive ? (
                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={metric.isPositive ? "text-green-500" : "text-red-500"}>{metric.change}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

