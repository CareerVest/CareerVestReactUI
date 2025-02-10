"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import type { Payment } from "../../utils/dummyData"

interface PaymentScheduleProps {
  payments: Payment[]
  onUpdate: (updatedPayments: Payment[]) => void
  onAddPayment: () => void
}

export function PaymentSchedule({ payments, onUpdate, onAddPayment }: PaymentScheduleProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editedPayment, setEditedPayment] = useState<Payment | null>(null)

  useEffect(() => {
    // Find the most recently added payment
    const lastPayment = payments[payments.length - 1]
    if (lastPayment && lastPayment.amount === 0) {
      // If it's a new payment (amount is 0), automatically enter edit mode
      setEditingId(lastPayment.id)
      setEditedPayment(lastPayment)
    }
  }, [payments])

  if (!payments || payments.length === 0) {
    return <div>No payment schedules available.</div>
  }

  const handleEdit = (payment: Payment) => {
    setEditingId(payment.id)
    setEditedPayment({ ...payment })
  }

  const handleSave = () => {
    if (editedPayment) {
      const updatedPayments = payments.map((p) => (p.id === editedPayment.id ? editedPayment : p))
      onUpdate(updatedPayments)
      setEditingId(null)
      setEditedPayment(null)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditedPayment(null)
  }

  const handleDelete = (paymentId: number, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent row click event
    const updatedPayments = payments.filter((p) => p.id !== paymentId)
    const updatedPayments2 = updatedPayments.map((p, index) => ({ ...p, id: index + 1 }))
    onUpdate(updatedPayments2)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedPayment) {
      setEditedPayment({
        ...editedPayment,
        [e.target.name]: e.target.name === "amount" ? Number.parseFloat(e.target.value) : e.target.value,
      })
    }
  }

  const handleStatusChange = (value: string) => {
    if (editedPayment) {
      setEditedPayment({
        ...editedPayment,
        status: value as "pending" | "paid" | "overdue",
      })
    }
  }

  const handleAddPayment = () => {
    onAddPayment()
  }

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const totalPaid = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0)
  const totalPending = payments
    .filter((payment) => payment.status === "pending")
    .reduce((sum, payment) => sum + payment.amount, 0)
  const totalOverdue = payments
    .filter((payment) => payment.status === "overdue")
    .reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <div className="space-y-4">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[30%]">
                Due Date
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[25%]">
                Amount
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[35%]">
                Status
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[10%]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                onClick={() => handleEdit(payment)}
              >
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  {editingId === payment.id ? (
                    <Input
                      type="date"
                      name="dueDate"
                      value={format(editedPayment?.dueDate || new Date(), "yyyy-MM-dd")}
                      onChange={handleInputChange}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    format(payment.dueDate, "MMM dd, yyyy")
                  )}
                </td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  {editingId === payment.id ? (
                    <Input
                      type="number"
                      name="amount"
                      value={editedPayment?.amount || ""}
                      onChange={handleInputChange}
                      className="w-full"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    `$${payment.amount.toFixed(2)}`
                  )}
                </td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  {editingId === payment.id ? (
                    <Select
                      value={editedPayment?.status}
                      onValueChange={handleStatusChange}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                        ${
                          payment.status === "pending"
                            ? "bg-[#FDC500] text-[#682A53]"
                            : payment.status === "paid"
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                        }`}
                    >
                      {payment.status}
                    </span>
                  )}
                </td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                    onClick={(e) => handleDelete(payment.id, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-2">
        <div className="font-bold">Total Amount: ${totalAmount.toFixed(2)}</div>
        <div>Total Paid: ${totalPaid.toFixed(2)}</div>
        <div>Total Pending: ${totalPending.toFixed(2)}</div>
        <div>Total Overdue: ${totalOverdue.toFixed(2)}</div>
        {editingId !== null && (
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleSave}
              className="mr-2 bg-[#FDC500] text-[#682A53] hover:bg-[#682A53] hover:text-white"
            >
              Save
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="border-[#682A53] text-[#682A53] hover:bg-[#682A53] hover:text-white"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

