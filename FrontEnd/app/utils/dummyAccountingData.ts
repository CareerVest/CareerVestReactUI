import { addMonths, format } from "date-fns"

export interface Payment {
  id: string
  clientId: string
  amount: number
  dueDate: string
  status: "Pending" | "Paid" | "Overdue"
  type: "Subscription" | "Post-Placement"
}

export interface Client {
  id: string
  name: string
  email: string
}

const generatePayments = (clientId: string, startDate: Date): Payment[] => {
  const payments: Payment[] = []
  for (let i = 0; i < 6; i++) {
    const dueDate = addMonths(startDate, i)
    payments.push({
      id: `${clientId}-${i}`,
      clientId,
      amount: Math.floor(Math.random() * 5000) + 1000,
      dueDate: format(dueDate, "yyyy-MM-dd"),
      status: Math.random() > 0.7 ? "Paid" : Math.random() > 0.5 ? "Pending" : "Overdue",
      type: Math.random() > 0.5 ? "Subscription" : "Post-Placement",
    })
  }
  return payments
}

export const dummyClients: Client[] = Array.from({ length: 10 }, (_, i) => ({
  id: `client-${i + 1}`,
  name: `Client ${i + 1}`,
  email: `client${i + 1}@example.com`,
}))

export const dummyPayments: Payment[] = dummyClients.flatMap((client) => generatePayments(client.id, new Date()))

export const getClientById = (clientId: string): Client | undefined =>
  dummyClients.find((client) => client.id === clientId)

export const getPaymentsByClientId = (clientId: string): Payment[] =>
  dummyPayments.filter((payment) => payment.clientId === clientId)

export const getPaymentsByMonth = (month: number, year: number): Payment[] =>
  dummyPayments.filter((payment) => {
    const paymentDate = new Date(payment.dueDate)
    return paymentDate.getMonth() === month && paymentDate.getFullYear() === year
  })

export const getTotalDueThisMonth = (): number => {
  const now = new Date()
  return getPaymentsByMonth(now.getMonth(), now.getFullYear()).reduce((total, payment) => total + payment.amount, 0)
}

export const getTotalCollectedThisMonth = (): number => {
  const now = new Date()
  return getPaymentsByMonth(now.getMonth(), now.getFullYear())
    .filter((payment) => payment.status === "Paid")
    .reduce((total, payment) => total + payment.amount, 0)
}

export const getPaymentStatusCounts = (): { [key: string]: number } => {
  return dummyPayments.reduce(
    (counts, payment) => {
      counts[payment.status] = (counts[payment.status] || 0) + 1
      return counts
    },
    {} as { [key: string]: number },
  )
}

