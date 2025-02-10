import type { Client, Interview, Recruiter } from "../types/marketing"

export const recruiters: Recruiter[] = [
  { id: "1", name: "Alisha Malik" },
  { id: "2", name: "John Smith" },
  { id: "3", name: "Sarah Johnson" },
]

export const generateMockInterviews = (clientId: string, clientName: string): Interview[] => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Base interviews that all clients will have
  const baseInterviews = [
    {
      id: `${clientId}-1`,
      clientId,
      clientName,
      type: "Screening",
      tech: "Project Manager",
      status: "completed",
      time: "11:30 AM - 12:00 PM",
      date: today.toISOString(),
      entryDate: "2024-02-07",
      company: "CoverMyMeds",
      notes: "Initial screening interview",
    },
    {
      id: `${clientId}-2`,
      clientId,
      clientName,
      type: "Technical",
      tech: "Project Manager",
      status: "scheduled",
      time: "2:00 PM - 3:00 PM",
      date: today.toISOString(),
      entryDate: "2024-02-07",
      company: "Hellofresh",
      notes: "Technical round with team lead",
    },
    {
      id: `${clientId}-3`,
      clientId,
      clientName,
      type: "Final Round",
      tech: "Project Manager",
      status: "scheduled",
      time: "10:00 AM - 11:00 AM",
      date: tomorrow.toISOString(),
      entryDate: "2024-02-07",
      company: "Stride",
      notes: "Final interview with hiring manager",
    },
  ]

  // Add extra interviews for the first client
  if (clientId === "1") {
    return [
      ...baseInterviews,
      {
        id: `${clientId}-4`,
        clientId,
        clientName,
        type: "Technical",
        tech: "Project Manager",
        status: "scheduled",
        time: "3:30 PM - 4:30 PM",
        date: today.toISOString(),
        entryDate: "2024-02-07",
        company: "Amazon",
        notes: "Technical discussion with the team",
      },
      {
        id: `${clientId}-5`,
        clientId,
        clientName,
        type: "Technical",
        tech: "Project Manager",
        status: "scheduled",
        time: "5:00 PM - 6:00 PM",
        date: today.toISOString(),
        entryDate: "2024-02-07",
        company: "Microsoft",
        notes: "System design discussion",
      },
    ]
  }

  return baseInterviews
}

export const clients: Client[] = [
  {
    id: "1",
    name: "Sweta Patel",
    recruiterId: "1",
    screeningCount: 11,
    technicalCount: 11,
    finalRoundCount: 0,
    interviews: generateMockInterviews("1", "Sweta Patel"),
  },
  {
    id: "2",
    name: "Jyoti Gupta",
    recruiterId: "1",
    screeningCount: 14,
    technicalCount: 13,
    finalRoundCount: 0,
    interviews: generateMockInterviews("2", "Jyoti Gupta"),
  },
  {
    id: "3",
    name: "Nishanth Goud",
    recruiterId: "2",
    screeningCount: 11,
    technicalCount: 5,
    finalRoundCount: 0,
    interviews: generateMockInterviews("3", "Nishanth Goud"),
  },
]

