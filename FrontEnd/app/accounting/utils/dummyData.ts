import { addMonths } from "date-fns"

export interface Payment {
  id: number
  client: string
  amount: number
  dueDate: Date
  status: "pending" | "paid" | "overdue"
  type: "subscription" | "post-placement"
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  subscriptionPlan: {
    name: string
    totalAmount: number
    remainingAmount: number
    startDate: Date
    endDate: Date
  }
  postPlacementPlan: {
    name: string
    totalAmount: number
    remainingAmount: number
    startDate: Date
    endDate: Date
  }
}

const generatePaymentsForClient = (
  clientId: string,
  startDate: Date,
  type: "subscription" | "post-placement",
): Payment[] => {
  const payments: Payment[] = []
  for (let i = 0; i < 6; i++) {
    const dueDate = addMonths(startDate, i)
    payments.push({
      id: payments.length + 1,
      client: clientId,
      amount: type === "subscription" ? 1000 : 500,
      dueDate,
      status: i === 0 ? "paid" : i === 1 ? "pending" : "overdue",
      type,
    })
  }
  return payments
}

export const dummyClients: Client[] = [
  {
    id: "client-1",
    name: "TechCorp Solutions",
    email: "contact@techcorp.com",
    phone: "+1 (555) 123-4567",
    subscriptionPlan: {
      name: "Premium Plan",
      totalAmount: 6000,
      remainingAmount: 5000,
      startDate: new Date(2023, 0, 1),
      endDate: new Date(2023, 5, 30),
    },
    postPlacementPlan: {
      name: "Standard Post-Placement",
      totalAmount: 3000,
      remainingAmount: 3000,
      startDate: new Date(2023, 6, 1),
      endDate: new Date(2023, 11, 31),
    },
  },
  // Add more dummy clients here if needed
]

export const dummyPayments: Payment[] = [
  ...generatePaymentsForClient("client-1", new Date(2023, 0, 1), "subscription"),
  ...generatePaymentsForClient("client-1", new Date(2023, 6, 1), "post-placement"),
]

export const filterPayments = (payments: Payment[], filters: any = {}) => {
  return payments.filter((payment) => {
    const dateInRange =
      (!filters.dateRange?.from || payment.dueDate >= filters.dateRange.from) &&
      (!filters.dateRange?.to || payment.dueDate <= filters.dateRange.to)
    const clientMatch =
      !filters.client || filters.client === "all" || payment.client.toLowerCase().includes(filters.client.toLowerCase())
    const statusMatch =
      !filters.paymentStatus || filters.paymentStatus === "all" || payment.status === filters.paymentStatus
    const typeMatch = !filters.paymentType || filters.paymentType === "all" || payment.type === filters.paymentType
    return dateInRange && clientMatch && statusMatch && typeMatch
  })
}

export const calculateTotalDue = (payments: Payment[]) => {
  return payments.reduce((total, payment) => total + payment.amount, 0)
}

export const calculateTotalCollected = (payments: Payment[]) => {
  return payments.filter((payment) => payment.status === "paid").reduce((total, payment) => total + payment.amount, 0)
}

export const getPaymentStatusCounts = (payments: Payment[]) => {
  return payments.reduce(
    (counts, payment) => {
      counts[payment.status] = (counts[payment.status] || 0) + 1
      return counts
    },
    {} as Record<string, number>,
  )
}

