"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import type { Client } from "../../utils/dummyData"

interface ClientListProps {
  clients: Client[]
  onSelectClient: (client: Client) => void
}

export function ClientList({ clients, onSelectClient }: ClientListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredClients = clients.filter((client) => client.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-4">
      <Input placeholder="Search clients..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <ul className="space-y-2">
        {filteredClients.map((client) => (
          <li
            key={client.id}
            className="cursor-pointer p-2 hover:bg-[#682A53]/10 rounded-md"
            onClick={() => onSelectClient(client)}
          >
            {client.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

