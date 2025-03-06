// src/app/types/MarketingActivity/Marketing.ts (or types/marketing.ts)

export interface MarketingRecruiter {
    id: string; // Matches the format expected in FilterBar and InterviewSidebar
    name: string;
}
  
export interface MarketingInterview {
    id: string; // Unique identifier for the interview
    clientId: string; // Reference to the client
    clientName: string; // Name of the client for display
    type: "Screening" | "Technical" | "Final Round"; // Interview types as used in KanbanBoard and InterviewSidebar
    tech: string; // Technology or role (e.g., "Java Developer")
    status: "scheduled" | "completed" | "cancelled"; // Interview status as used in KanbanBoard and InterviewSidebar
    time: string; // Time of the interview (e.g., "10:00 AM")
    date: string; // Date of the interview in ISO format (e.g., "2023-10-01")
    entryDate: string; // Entry date in ISO format (e.g., "2023-10-01")
    company: string; // Company name associated with the interview
    notes: string; // Additional notes about the interview
    feedback: string; // Feedback from the interview
}
  
export interface MarketingClient {
    id: string; // Unique identifier for the client
    name: string; // Client name
    recruiterId: string; // Reference to the recruiter assigned to the client
    interviews: MarketingInterview[]; // List of interviews associated with the client
    screeningCount: number; // Count of screening interviews (used in ClientCard)
    technicalCount: number; // Count of technical interviews (used in ClientCard)
    finalRoundCount: number; // Count of final round interviews (used in ClientCard)
}
  
// Interface for Filter State used in FilterBar and KanbanBoard, updated for search and quick filters
export interface FilterState {
    recruiter: string;
    dateRange: [Date | null, Date | null];
    status: "all" | "scheduled" | "completed" | "cancelled";
    type: "all" | "Screening" | "Technical" | "Final Round";
    searchQuery: string;
    quickFilters: string[];
  }
  
// Interface for Application Counts used in ApplicationCountsSidebar
export interface ApplicationCounts {
    totalManualApplications: number; // Manual application count for a client
    totalEasyApplications: number; // Easy application count for a client
    totalReceivedInterviews: number; // Received interviews count for a client
}

// Interface for Interview Stats derived from Interviews, used in KanbanBoard and MarketingActivityDashboard
export interface MarketingInterviewStats {
    Date: Date; // Date of the stats
    Screening: number; // Count of Screening interviews
    Technical: number; // Count of Technical interviews
    FinalRound: number; // Count of Final Round interviews
    Total: number; // Total count of interviews
}

// Interface for Marketing Activity Counts stored in ApplicationCounts, used in ApplicationCountsSidebar
export interface MarketingActivityCount {
    ApplicationCountID: number; // Unique identifier for the count record
    ClientID: number; // Reference to the client
    ClientName: string; // Name of the client for display
    Date: Date; // Date of the counts
    TotalManualApplications: number; // Manual application count
    TotalEasyApplications: number; // Easy application count
    TotalReceivedInterviews: number; // Received interviews count
    CreatedTS: Date; // Creation timestamp
    UpdatedTS: Date | null; // Last update timestamp (nullable)
    CreatedBy: string; // Azure User ID of creator
    UpdatedBy: string | null; // Azure User ID of last updater (nullable)
}