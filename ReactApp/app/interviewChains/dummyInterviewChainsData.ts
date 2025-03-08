// ../types/interview-chain.ts (assumed types)
export interface Interview {
    id: string;
    type: string;
    date: string;
    status: "Scheduled" | "Completed";
    outcome?: "Next" | "Offer" | "Rejected";
    notes?: string;
    location?: string;
    interviewer?: string;
  }
  
  export interface InterviewChain {
    id: string;
    clientName: string;
    position: string;
    status: "Active" | "Successful" | "Unsuccessful";
    interviews: Interview[];
    updatedAt: string;
    createdAt: string;
    rounds: number;
    latestInterview: Interview;
  }
  
  export interface InterviewChainStats {
    totalChains: number;
    activeChains: number;
    successfulChains: number;
    unsuccessfulChains: number;
    averageRounds: number;
    offerRate: number;
    statusBreakdown: { status: string; count: number }[];
    monthlyActivity: { month: string; active: number; successful: number; unsuccessful: number }[];
    topClients: { name: string; count: number }[];
  }
  
  // Dummy Data
  export const dummyInterviewChains: InterviewChain[] = [
    {
      id: "chain-1",
      clientName: "TechCorp Inc.",
      position: "Senior Software Engineer",
      status: "Active",
      interviews: [
        {
          id: "int-1-1",
          type: "Technical",
          date: "2025-03-01",
          status: "Scheduled",
          interviewer: "John Doe",
          location: "Zoom",
        },
      ],
      updatedAt: "2025-03-01T12:00:00Z",
      createdAt: "2025-02-15T09:00:00Z",
      rounds: 1,
      latestInterview: {
        id: "int-1-1",
        type: "Technical",
        date: "2025-03-01",
        status: "Scheduled",
      },
    },
    {
      id: "chain-2",
      clientName: "HealthPlus Ltd.",
      position: "HR Manager",
      status: "Active",
      interviews: [
        {
          id: "int-2-1",
          type: "HR",
          date: "2025-03-02",
          status: "Completed",
          outcome: "Next",
          notes: "Candidate showed strong communication skills.",
        },
        {
          id: "int-2-2",
          type: "Culture Fit",
          date: "2025-03-05",
          status: "Scheduled",
          interviewer: "Jane Smith",
        },
      ],
      updatedAt: "2025-03-02T14:00:00Z",
      createdAt: "2025-02-20T10:00:00Z",
      rounds: 2,
      latestInterview: {
        id: "int-2-2",
        type: "Culture Fit",
        date: "2025-03-05",
        status: "Scheduled",
      },
    },
    {
      id: "chain-3",
      clientName: "FinanceGlobal",
      position: "Financial Analyst",
      status: "Successful",
      interviews: [
        {
          id: "int-3-1",
          type: "Technical",
          date: "2025-03-03",
          status: "Completed",
          outcome: "Next",
        },
        {
          id: "int-3-2",
          type: "Behavioral",
          date: "2025-03-06",
          status: "Completed",
          outcome: "Offer",
          notes: "Offer extended after final review.",
          location: "Office",
        },
      ],
      updatedAt: "2025-03-06T16:00:00Z",
      createdAt: "2025-02-25T11:00:00Z",
      rounds: 2,
      latestInterview: {
        id: "int-3-2",
        type: "Behavioral",
        date: "2025-03-06",
        status: "Completed",
        outcome: "Offer",
      },
    },
    {
      id: "chain-4",
      clientName: "EduTech Solutions",
      position: "Product Manager",
      status: "Unsuccessful",
      interviews: [
        {
          id: "int-4-1",
          type: "System Design",
          date: "2025-03-04",
          status: "Completed",
          outcome: "Next",
        },
        {
          id: "int-4-2",
          type: "Final",
          date: "2025-03-07",
          status: "Completed",
          outcome: "Rejected",
          notes: "Candidate did not meet experience criteria.",
        },
      ],
      updatedAt: "2025-03-07T09:00:00Z",
      createdAt: "2025-02-28T12:00:00Z",
      rounds: 2,
      latestInterview: {
        id: "int-4-2",
        type: "Final",
        date: "2025-03-07",
        status: "Completed",
        outcome: "Rejected",
      },
    },
    {
      id: "chain-5",
      clientName: "GreenEnergy Co.",
      position: "Environmental Consultant",
      status: "Active",
      interviews: [
        {
          id: "int-5-1",
          type: "Technical",
          date: "2025-03-05",
          status: "Completed",
          outcome: "Next",
        },
        {
          id: "int-5-2",
          type: "Case Study",
          date: "2025-03-08",
          status: "Scheduled",
          interviewer: "Emily Johnson",
          location: "In-Person",
        },
      ],
      updatedAt: "2025-03-05T13:00:00Z",
      createdAt: "2025-03-01T10:00:00Z",
      rounds: 2,
      latestInterview: {
        id: "int-5-2",
        type: "Case Study",
        date: "2025-03-08",
        status: "Scheduled",
      },
    },
    {
      id: "chain-6",
      clientName: "RetailMax",
      position: "Marketing Specialist",
      status: "Successful",
      interviews: [
        {
          id: "int-6-1",
          type: "HR",
          date: "2025-03-06",
          status: "Completed",
          outcome: "Next",
        },
        {
          id: "int-6-2",
          type: "Team Meeting",
          date: "2025-03-09",
          status: "Completed",
          outcome: "Offer",
          notes: "Team approved the candidate.",
        },
      ],
      updatedAt: "2025-03-09T15:00:00Z",
      createdAt: "2025-03-02T11:00:00Z",
      rounds: 2,
      latestInterview: {
        id: "int-6-2",
        type: "Team Meeting",
        date: "2025-03-09",
        status: "Completed",
        outcome: "Offer",
      },
    },
    {
      id: "chain-7",
      clientName: "BuildCorp",
      position: "Civil Engineer",
      status: "Unsuccessful",
      interviews: [
        {
          id: "int-7-1",
          type: "Technical",
          date: "2025-03-07",
          status: "Completed",
          outcome: "Next",
        },
        {
          id: "int-7-2",
          type: "Final",
          date: "2025-03-10",
          status: "Completed",
          outcome: "Rejected",
          location: "Virtual",
        },
      ],
      updatedAt: "2025-03-10T10:00:00Z",
      createdAt: "2025-03-03T12:00:00Z",
      rounds: 2,
      latestInterview: {
        id: "int-7-2",
        type: "Final",
        date: "2025-03-10",
        status: "Completed",
        outcome: "Rejected",
      },
    },
    {
      id: "chain-8",
      clientName: "MediaWave",
      position: "Content Creator",
      status: "Active",
      interviews: [
        {
          id: "int-8-1",
          type: "Culture Fit",
          date: "2025-03-08",
          status: "Completed",
          outcome: "Next",
          notes: "Good cultural alignment.",
        },
        {
          id: "int-8-2",
          type: "Behavioral",
          date: "2025-03-11",
          status: "Scheduled",
          interviewer: "Michael Brown",
        },
      ],
      updatedAt: "2025-03-08T14:00:00Z",
      createdAt: "2025-03-04T13:00:00Z",
      rounds: 2,
      latestInterview: {
        id: "int-8-2",
        type: "Behavioral",
        date: "2025-03-11",
        status: "Scheduled",
      },
    },
    {
      id: "chain-9",
      clientName: "LogiTech",
      position: "Data Analyst",
      status: "Successful",
      interviews: [
        {
          id: "int-9-1",
          type: "Technical",
          date: "2025-03-09",
          status: "Completed",
          outcome: "Next",
        },
        {
          id: "int-9-2",
          type: "Final",
          date: "2025-03-12",
          status: "Completed",
          outcome: "Offer",
          location: "Office",
          interviewer: "Sarah Davis",
        },
      ],
      updatedAt: "2025-03-12T11:00:00Z",
      createdAt: "2025-03-05T14:00:00Z",
      rounds: 2,
      latestInterview: {
        id: "int-9-2",
        type: "Final",
        date: "2025-03-12",
        status: "Completed",
        outcome: "Offer",
      },
    },
    {
      id: "chain-10",
      clientName: "InnoVate",
      position: "UX Designer",
      status: "Unsuccessful",
      interviews: [
        {
          id: "int-10-1",
          type: "System Design",
          date: "2025-03-10",
          status: "Completed",
          outcome: "Next",
        },
        {
          id: "int-10-2",
          type: "Final",
          date: "2025-03-13",
          status: "Completed",
          outcome: "Rejected",
          notes: "Lack of portfolio depth.",
        },
      ],
      updatedAt: "2025-03-13T09:00:00Z",
      createdAt: "2025-03-06T15:00:00Z",
      rounds: 2,
      latestInterview: {
        id: "int-10-2",
        type: "Final",
        date: "2025-03-13",
        status: "Completed",
        outcome: "Rejected",
      },
    },
    {
      id: "chain-11",
      clientName: "TravelEase",
      position: "Travel Coordinator",
      status: "Active",
      interviews: [
        {
          id: "int-11-1",
          type: "HR",
          date: "2025-03-11",
          status: "Completed",
          outcome: "Next",
        },
        {
          id: "int-11-2",
          type: "Team Meeting",
          date: "2025-03-14",
          status: "Scheduled",
          location: "In-Person",
        },
      ],
      updatedAt: "2025-03-11T13:00:00Z",
      createdAt: "2025-03-07T16:00:00Z",
      rounds: 2,
      latestInterview: {
        id: "int-11-2",
        type: "Team Meeting",
        date: "2025-03-14",
        status: "Scheduled",
      },
    },
  ];
  
  // Dummy Stats
  export const dummyInterviewChainStats: InterviewChainStats = {
    totalChains: dummyInterviewChains.length,
    activeChains: dummyInterviewChains.filter((c) => c.status === "Active").length,
    successfulChains: dummyInterviewChains.filter((c) => c.status === "Successful").length,
    unsuccessfulChains: dummyInterviewChains.filter((c) => c.status === "Unsuccessful").length,
    averageRounds: dummyInterviewChains.reduce((sum, c) => sum + c.rounds, 0) / dummyInterviewChains.length,
    offerRate: Math.round(
      (dummyInterviewChains.filter((c) => c.interviews.some((i) => i.outcome === "Offer")).length /
        dummyInterviewChains.length) *
        100,
    ),
    statusBreakdown: [
      { status: "Active", count: dummyInterviewChains.filter((c) => c.status === "Active").length },
      { status: "Successful", count: dummyInterviewChains.filter((c) => c.status === "Successful").length },
      { status: "Unsuccessful", count: dummyInterviewChains.filter((c) => c.status === "Unsuccessful").length },
    ],
    monthlyActivity: [
      { month: "Mar", active: 4, successful: 2, unsuccessful: 2 },
      { month: "Feb", active: 1, successful: 1, unsuccessful: 1 },
    ],
    topClients: [
      { name: "TechCorp Inc.", count: 1 },
      { name: "HealthPlus Ltd.", count: 1 },
      { name: "FinanceGlobal", count: 1 },
      { name: "EduTech Solutions", count: 1 },
      { name: "GreenEnergy Co.", count: 1 },
      { name: "RetailMax", count: 1 },
      { name: "BuildCorp", count: 1 },
      { name: "MediaWave", count: 1 },
      { name: "LogiTech", count: 1 },
      { name: "InnoVate", count: 1 },
      { name: "TravelEase", count: 1 },
    ].sort((a, b) => b.count - a.count).slice(0, 5),
  };