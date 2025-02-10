export interface Interview {
  id: string
  clientId: string
  clientName: string
  type: "Screening" | "Technical" | "Final Round"
  tech: string
  status: "scheduled" | "completed" | "cancelled"
  time: string
  date: string
  entryDate: string
  company: string
  notes?: string
  feedback?: string
}

export interface Client {
  id: string
  name: string
  recruiterId: string
  screeningCount: number
  technicalCount: number
  finalRoundCount: number
  interviews: Interview[]
}

export interface Recruiter {
  id: string
  name: string
}

export interface FilterState {
  recruiter: string
  dateRange: [Date | null, Date | null]
  status: string
  type: string
}

export interface ApplicationCounts {
  totalManualApplications: number
  totalEasyApplications: number
  totalReceivedInterviews: number
}

