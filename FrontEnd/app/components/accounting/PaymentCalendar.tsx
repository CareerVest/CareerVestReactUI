import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { getPaymentsByMonth } from "@/app/data/dummyAccountingData"
import type { Payment } from "@/app/data/dummyAccountingData"

export function PaymentCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  const payments = date ? getPaymentsByMonth(date.getMonth(), date.getFullYear()) : []

  const paymentDates = payments.reduce(
    (acc, payment) => {
      const date = new Date(payment.dueDate)
      const dateString = date.toISOString().split("T")[0]
      if (!acc[dateString]) {
        acc[dateString] = []
      }
      acc[dateString].push(payment)
      return acc
    },
    {} as Record<string, Payment[]>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          modifiers={{
            payment: (date) => {
              const dateString = date.toISOString().split("T")[0]
              return !!paymentDates[dateString]
            },
          }}
          modifiersStyles={{
            payment: {
              fontWeight: "bold",
              backgroundColor: "#FDC500",
              color: "#682A53",
            },
          }}
          components={{
            DayContent: (props) => {
              const dateString = props.date.toISOString().split("T")[0]
              const dayPayments = paymentDates[dateString]
              return (
                <div
                  className="relative w-full h-full flex items-center justify-center"
                  onClick={() => dayPayments && setSelectedPayment(dayPayments[0])}
                >
                  {props.date.getDate()}
                  {dayPayments && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#682A53]" />}
                </div>
              )
            },
          }}
        />
        {selectedPayment && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <h4 className="font-semibold">Payment Details</h4>
            <p>Amount: ${selectedPayment.amount}</p>
            <p>Status: {selectedPayment.status}</p>
            <p>Type: {selectedPayment.type}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

