// Interview Type
export interface Interview {
    id: string;
    type: string; // e.g., "Technical", "HR", "Final"
    date: string; // ISO date string, e.g., "2025-03-01"
    status: "Scheduled" | "Completed";
    outcome?: "Next" | "Offer" | "Rejected";
    notes?: string;
    location?: string;
    interviewer?: string;
  }
  
  // InterviewChain Type
  export interface InterviewChain {
    id: string;
    clientName: string; // e.g., "TechCorp Inc."
    position: string; // e.g., "Senior Software Engineer"
    status: "Active" | "Successful" | "Unsuccessful";
    interviews: Interview[];
    updatedAt: string; // ISO date string, e.g., "2025-03-01T12:00:00Z"
    createdAt: string; // ISO date string, e.g., "2025-02-15T09:00:00Z"
    rounds: number; // Number of interviews in the chain
    latestInterview: Interview; // The most recent interview in the chain
  }
  
  // InterviewChainStats Type
  export interface InterviewChainStats {
    totalChains: number;
    activeChains: number;
    successfulChains: number;
    unsuccessfulChains: number;
    averageRounds: number;
    offerRate: number; // Percentage, e.g., 30 for 30%
    statusBreakdown: { status: string; count: number }[];
    monthlyActivity: { month: string; active: number; successful: number; unsuccessful: number }[];
    topClients: { name: string; count: number }[];
  }