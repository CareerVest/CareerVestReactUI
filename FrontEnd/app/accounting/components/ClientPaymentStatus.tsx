"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, Search } from "lucide-react"
import { dummyPayments, type Payment } from "../utils/dummyData"

export default function ClientPaymentStatus() {
  const [payments, setPayments] = useState<Payment[]>(dummyPayments)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" })
  const [searchTerm, setSearchTerm] = useState("")

  const handleSort = (key: keyof Payment) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })

    const sortedPayments = [...payments].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1
      return 0
    })
    setPayments(sortedPayments)
  }

  const handleStatusChange = (paymentId: number, newStatus: string) => {
    setPayments((prevPayments) =>
      prevPayments.map((payment) => (payment.id === paymentId ? { ...payment, status: newStatus } : payment)),
    )
    console.log(`Updated payment ${paymentId} status to ${newStatus}`)
  }

  const filteredPayments = payments.filter((payment) =>
    Object.values(payment).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <Card>
      <CardContent>
        <div className="flex items-center py-4">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("client")}>
                  Client <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("amount")}>
                  Amount <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("dueDate")}>
                  Due Date <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("status")}>
                  Status <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("type")}>
                  Type <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.client}</TableCell>
                <TableCell>${payment.amount}</TableCell>
                <TableCell>{payment.dueDate.toLocaleDateString()}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                    ${
                      payment.status === "pending"
                        ? "bg-[#FDC500] text-[#682A53]"
                        : payment.status === "overdue"
                          ? "bg-red-500 text-white"
                          : payment.status === "paid"
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white"
                    }`}
                  >
                    {payment.status}
                  </span>
                </TableCell>
                <TableCell>{payment.type}</TableCell>
                <TableCell>
                  <Select
                    onValueChange={(value) => handleStatusChange(payment.id, value)}
                    defaultValue={payment.status}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

