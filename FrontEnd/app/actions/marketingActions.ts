import type { Client, Interview, Recruiter } from "../types/marketing"

// Dummy data for clients
const dummyClients: Client[] = [
  { id: "1", name: "Client A", recruiterId: "1", status: "active", lastActivityDate: "2023-05-15" },
  { id: "2", name: "Client B", recruiterId: "1", status: "placed", lastActivityDate: "2023-05-14" },
  { id: "3", name: "Client C", recruiterId: "2", status: "active", lastActivityDate: "2023-05-15" },
  { id: "4", name: "Client D", recruiterId: "2", status: "backed_out", lastActivityDate: "2023-05-13" },
]

// Dummy data for interviews
const dummyInterviews: Interview[] = [
  { id: "1", clientId: "1", company: "Tech Corp", date: "2023-05-15T10:00:00", type: "Technical", status: "completed" },
  {
    id: "2",
    clientId: "1",
    company: "Innovate Inc",
    date: "2023-05-15T14:00:00",
    type: "Screening",
    status: "scheduled",
  },
  {
    id: "3",
    clientId: "3",
    company: "Future Systems",
    date: "2023-05-15T16:30:00",
    type: "Technical",
    status: "scheduled",
  },
  { id: "4", clientId: "2", company: "Dev Solutions", date: "2023-05-16T11:00:00", type: "Final", status: "scheduled" },
]

// Dummy data for recruiters
const dummyRecruiters: Recruiter[] = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
]

export async function fetchClients(): Promise<Client[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return dummyClients
}

export async function fetchInterviews(): Promise<Interview[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return dummyInterviews
}

export async function fetchRecruiters(): Promise<Recruiter[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return dummyRecruiters
}

