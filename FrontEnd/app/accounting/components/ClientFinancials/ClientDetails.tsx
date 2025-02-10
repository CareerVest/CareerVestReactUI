"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentSchedule } from "./PaymentSchedule"
import type { Client, Payment } from "../../utils/dummyData"
import { Button } from "@/components/ui/button"

interface ClientDetailsProps {
  client: Client | null
  payments: Payment[]
}

export function ClientDetails({ client, payments }: ClientDetailsProps) {
  const [subscriptionPayments, setSubscriptionPayments] = useState<Payment[]>(
    payments.filter((p) => p.type === "subscription"),
  )
  const [postPlacementPayments, setPostPlacementPayments] = useState<Payment[]>(
    payments.filter((p) => p.type === "post-placement"),
  )

  if (!client) {
    return <div>Select a client to view details</div>
  }

  const handlePaymentUpdate = (updatedPayments: Payment[], type: "subscription" | "post-placement") => {
    if (type === "subscription") {
      setSubscriptionPayments(updatedPayments)
    } else {
      setPostPlacementPayments(updatedPayments)
    }
  }

  const handleAddPayment = (type: "subscription" | "post-placement") => {
    const newPayment: Payment = {
      id: Math.max(...payments.map((p) => p.id)) + 1,
      client: client.id,
      amount: 0,
      dueDate: new Date(),
      status: "pending",
      type,
    }

    if (type === "subscription") {
      setSubscriptionPayments([...subscriptionPayments, newPayment])
    } else {
      setPostPlacementPayments([...postPlacementPayments, newPayment])
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{client.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Email:</p>
              <p>{client.email}</p>
            </div>
            <div>
              <p className="font-semibold">Phone:</p>
              <p>{client.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="subscription">
        <TabsList className="bg-[#682A53]/10">
          <TabsTrigger value="subscription" className="data-[state=active]:bg-[#682A53] data-[state=active]:text-white">
            Subscription
          </TabsTrigger>
          <TabsTrigger
            value="post-placement"
            className="data-[state=active]:bg-[#682A53] data-[state=active]:text-white"
          >
            Post-Placement
          </TabsTrigger>
        </TabsList>
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-semibold">Plan Name:</p>
                  <p>{client.subscriptionPlan.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Total Amount:</p>
                  <p>${client.subscriptionPlan.totalAmount}</p>
                </div>
                <div>
                  <p className="font-semibold">Remaining Amount:</p>
                  <p>${client.subscriptionPlan.remainingAmount}</p>
                </div>
                <div>
                  <p className="font-semibold">Duration:</p>
                  <p>
                    {client.subscriptionPlan.startDate.toLocaleDateString()} -{" "}
                    {client.subscriptionPlan.endDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <PaymentSchedule
                payments={subscriptionPayments}
                onUpdate={(updatedPayments) => handlePaymentUpdate(updatedPayments, "subscription")}
                onAddPayment={() => handleAddPayment("subscription")}
              />
              <div className="mt-4">
                <Button
                  onClick={() => handleAddPayment("subscription")}
                  className="bg-[#FDC500] text-[#682A53] hover:bg-[#682A53] hover:text-white rounded-full w-8 h-8 p-0"
                >
                  +
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="post-placement">
          <Card>
            <CardHeader>
              <CardTitle>Post-Placement Plan Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-semibold">Plan Name:</p>
                  <p>{client.postPlacementPlan.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Total Amount:</p>
                  <p>${client.postPlacementPlan.totalAmount}</p>
                </div>
                <div>
                  <p className="font-semibold">Remaining Amount:</p>
                  <p>${client.postPlacementPlan.remainingAmount}</p>
                </div>
                <div>
                  <p className="font-semibold">Duration:</p>
                  <p>
                    {client.postPlacementPlan.startDate.toLocaleDateString()} -{" "}
                    {client.postPlacementPlan.endDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <PaymentSchedule
                payments={postPlacementPayments}
                onUpdate={(updatedPayments) => handlePaymentUpdate(updatedPayments, "post-placement")}
                onAddPayment={() => handleAddPayment("post-placement")}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

