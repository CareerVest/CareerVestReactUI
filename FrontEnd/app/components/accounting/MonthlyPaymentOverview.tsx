import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  getTotalDueThisMonth,
  getTotalCollectedThisMonth,
  getPaymentStatusCounts,
} from "@/app/data/dummyAccountingData"

export function MonthlyPaymentOverview() {
  const totalDue = getTotalDueThisMonth()
  const totalCollected = getTotalCollectedThisMonth()
  const collectionRate = (totalCollected / totalDue) * 100
  const statusCounts = getPaymentStatusCounts()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Payment Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>Total Collected</span>
              <span>${totalCollected.toLocaleString()}</span>
            </div>
            <Progress value={collectionRate} className="h-2" />
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Due</span>
            <span className="font-medium">${totalDue.toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex flex-col items-center">
                <div
                  className={`text-2xl font-bold ${
                    status === "Paid" ? "text-green-500" : status === "Pending" ? "text-yellow-500" : "text-red-500"
                  }`}
                >
                  {count}
                </div>
                <div className="text-sm text-muted-foreground">{status}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

