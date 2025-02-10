"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { dummyPayments, type Payment } from "../utils/dummyData"

export function FinancialMetrics({ payments, filters }: { payments: Payment[]; filters: any }) {
  const allMonthsData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString("default", { month: "short" }),
    amount: 0,
  }))

  const paymentsToUse = filters.dateRange.from && filters.dateRange.to ? payments : dummyPayments

  const monthlyData = paymentsToUse.reduce(
    (acc, payment) => {
      const month = payment.dueDate.toLocaleString("default", { month: "short" })
      acc[month] = (acc[month] || 0) + payment.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const data = allMonthsData.map((item) => ({
    month: item.month,
    amount: monthlyData[item.month] || 0,
  }))

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Financial Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Bar dataKey="amount" fill="#682A53" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

