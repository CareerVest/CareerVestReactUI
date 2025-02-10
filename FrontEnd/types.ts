export interface Recruiter {
  id: string
  name: string
}

export interface Client {
  id: string
  name: string
  recruiterId: string
  techStack: string
  status: string
  lastActivityDate: string
}

export interface Interview {
  id: string
  clientId: string
  clientName: string
  company: string
  date: string
  stage: string
  notes: string
  createdAt: string
}

