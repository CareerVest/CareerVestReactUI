"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Employee } from "@/types/employee"
import { useState } from "react"

interface ReassignDialogProps {
  isOpen: boolean
  onClose: () => void
  client: any
  recruiters: Employee[]
  onReassign: (clientId: string, newRecruiterId: string) => void
}

function ReassignDialog({ isOpen, onClose, client, recruiters, onReassign }: ReassignDialogProps) {
  const [selectedRecruiter, setSelectedRecruiter] = useState("")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reassign Client</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Client: {client.name}</p>
            <p className="text-sm text-gray-500">Current Status: {client.status}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Select New Recruiter</label>
            <Select value={selectedRecruiter} onValueChange={setSelectedRecruiter}>
              <SelectTrigger>
                <SelectValue placeholder="Select a recruiter" />
              </SelectTrigger>
              <SelectContent>
                {recruiters.map((recruiter) => (
                  <SelectItem key={recruiter.id} value={recruiter.id}>
                    {recruiter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full bg-[#682A53] hover:bg-[#682A53]/90"
            onClick={() => {
              onReassign(client.id, selectedRecruiter)
              onClose()
            }}
            disabled={!selectedRecruiter}
          >
            Confirm Reassignment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface EmployeeDetailsProps {
  employee: Employee
  onClose: () => void
  allRecruiters?: Employee[]
  onClientReassign?: (clientId: string, newRecruiterId: string) => void
}

export default function EmployeeDetails({
  employee,
  onClose,
  allRecruiters = [],
  onClientReassign,
}: EmployeeDetailsProps) {
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const isRecruiterOrLead = employee.title.includes("Recruiter") || employee.title.includes("Team Lead")

  return (
    <div className="h-full bg-[#F9FAFB]">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold text-[#682A53]">Employee Details</h2>
        <Button onClick={onClose} className="bg-[#FDC500] text-[#682A53] hover:bg-[#FDC500]/90">
          Close
        </Button>
      </div>

      <div className="p-4 space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
            <p className="mt-1">{employee.name}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Title</h3>
            <p className="mt-1">{employee.title}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Department</h3>
            <p className="mt-1">{employee.department}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1">{employee.email}</p>
          </div>
        </div>

        {isRecruiterOrLead && employee.clients && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#682A53]">Assigned Clients</h3>
            <div className="space-y-4">
              {employee.clients.map((client) => (
                <div key={client.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-gray-500">{client.status}</p>
                  </div>
                  {onClientReassign && (
                    <Button
                      onClick={() => setSelectedClient(client)}
                      className="bg-[#FDC500] text-[#682A53] hover:bg-[#FDC500]/90"
                    >
                      Reassign
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedClient && (
        <ReassignDialog
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          client={selectedClient}
          recruiters={allRecruiters.filter((r) => r.id !== employee.id)}
          onReassign={onClientReassign}
        />
      )}
    </div>
  )
}

