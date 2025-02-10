"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Overview } from "./components/Overview"
import { PaymentManagement } from "./components/PaymentManagement"
import { Reports } from "./components/Reports"
import { ClientFinancials } from "./components/ClientFinancials"
import { FilterComponent } from "./components/FilterComponent"

export default function AccountingDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="p-8">
      {/* Removed h1 tag as per update 1 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#682A53]/10">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#682A53] data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="payment-management"
            className="data-[state=active]:bg-[#682A53] data-[state=active]:text-white"
          >
            Payment Management
          </TabsTrigger>
          <TabsTrigger
            value="client-financials"
            className="data-[state=active]:bg-[#682A53] data-[state=active]:text-white"
          >
            Client Financials
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-[#682A53] data-[state=active]:text-white">
            Reports
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <Overview />
          <FilterComponent />
        </TabsContent>
        <TabsContent value="payment-management">
          <PaymentManagement />
        </TabsContent>
        <TabsContent value="client-financials">
          <ClientFinancials />
        </TabsContent>
        <TabsContent value="reports">
          <Reports />
        </TabsContent>
      </Tabs>
    </div>
  )
}

