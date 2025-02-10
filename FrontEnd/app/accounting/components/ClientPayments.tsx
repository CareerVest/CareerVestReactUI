"use client"

import { ClientPaymentStatus } from "./ClientPaymentStatus"

export function ClientPayments({ filters }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[#682A53]">Client Payments</h2>
      <ClientPaymentStatus filters={filters} />
    </div>
  )
}

