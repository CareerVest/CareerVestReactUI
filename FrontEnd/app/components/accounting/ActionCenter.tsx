import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { dummyPayments } from "@/app/data/dummyAccountingData"

export function ActionCenter() {
  const dueThisWeek = dummyPayments.filter((payment) => {
    const dueDate = new Date(payment.dueDate)
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    return dueDate >= today && dueDate <= nextWeek && payment.status === "Pending"
  })

  const overdue = dummyPayments.filter((payment) => payment.status === "Overdue")

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
                    Client {payment.clientId.split("-")[1]} - ${payment.amount}
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
                    Client {payment.clientId.split("-")[1]} - ${payment.amount}
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

