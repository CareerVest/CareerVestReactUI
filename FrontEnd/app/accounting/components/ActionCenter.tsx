"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Payment } from "../utils/dummyData"

export function ActionCenter({ payments }: { payments: Payment[] }) {
  const dueThisWeek = payments.filter((payment) => {
    const dueDate = payment.dueDate
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    return dueDate >= today && dueDate <= nextWeek && payment.status === "pending"
  })

  const overdue = payments.filter((payment) => payment.status === "overdue")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Action Center</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Payments Due This Week ({dueThisWeek.length})</h3>
            <ul className="space-y-2">
              {dueThisWeek.slice(0, 3).map((payment) => (
                <li key={payment.id} className="flex justify-between items-center">
                  <span>
                    {payment.client} - ${payment.amount}
                  </span>
                  <Button size="sm" variant="outline">
                    Process
                  </Button>
                </li>
              ))}
            </ul>
            {dueThisWeek.length > 3 && (
              <Button variant="link" className="mt-2">
                View all
              </Button>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Overdue Payments ({overdue.length})</h3>
            <ul className="space-y-2">
              {overdue.slice(0, 3).map((payment) => (
                <li key={payment.id} className="flex justify-between items-center">
                  <span>
                    {payment.client} - ${payment.amount}
                  </span>
                  <Button size="sm" variant="destructive">
                    Send Reminder
                  </Button>
                </li>
              ))}
            </ul>
            {overdue.length > 3 && (
              <Button variant="link" className="mt-2">
                View all
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

