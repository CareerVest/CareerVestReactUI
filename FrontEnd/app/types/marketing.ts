export interface Client {
  id: string
  name: string
  recruiterId: string
  status: "active" | "placed" | "backed_out"
  lastActivityDate: string
}

export interface Interview {
  id: string
  clientId: string
  company: string
  date: string
  type: "Screening" | "Technical" | "Final"
  status: "scheduled" | "completed" | "cancelled"
}

export interface Recruiter {
  id: string
  name: string
}

