"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientList } from "./ClientFinancials/ClientList"
import { ClientDetails } from "./ClientFinancials/ClientDetails"
import { dummyPayments, dummyClients, type Payment, type Client } from "../utils/dummyData"

export function ClientFinancials() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clientPayments, setClientPayments] = useState<Payment[]>([])

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client)
    const payments = dummyPayments.filter((payment) => payment.client === client.name)
    setClientPayments(payments)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientList clients={dummyClients} onSelectClient={handleClientSelect} />
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientDetails client={selectedClient} payments={clientPayments} />
        </CardContent>
      </Card>
    </div>
  )
}

