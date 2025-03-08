// @/app/types/MarketingActivity/Marketing.ts

export interface MarketingRecruiter {
    id: string; // Matches the format expected in FilterBar and InterviewSidebar
    name: string;
  }
  
  export interface MarketingClient {
    clientID: number;
    clientName: string;
    clientStatus: string;
    recruiterID: number | null;
    recruiterName: string | null; // Nullable to match backend DTO
    interviews: MarketingInterview[];
    applicationCount: MarketingApplicationCount | null;
    screeningCount: number; // Computed by transformClientListToMarketingClient
    technicalCount: number; // Computed by transformClientListToMarketingClient
    finalRoundCount: number; // Computed by transformClientListToMarketingClient
  }
  
  export interface MarketingInterview {
    interviewID: number;
    interviewEntryDate: string; // Required in Interview model
    recruiterID: number | null;
    recruiterName: string | null;
    interviewDate: string | null;
    interviewStartTime: string | null; // Nullable in Interview model
    interviewEndTime: string | null; // Nullable in Interview model
    clientID: number | null; // Nullable in Interview model
    clientName: string;
    interviewType: string; // Nullable in model, but treated as required for UI consistency
    interviewStatus: string | null;
    interviewMethod: string | null; // Added from Interview model
    technology: string | null; // Renamed from tech to match backend
    interviewFeedback: string | null; // Added from Interview model
    interviewSupport: string | null; // Added from Interview model
    isActive: boolean | null; // Nullable in Interview model
    comments: string | null; // Added from Interview model
    endClientName: string | null;
    time: string | null; // Constructed from startTime and endTime
    company: string | null; // Maps to endClientName
  }
  
  export interface MarketingApplicationCount {
    applicationCountID: number;
    clientID: number;
    clientName: string;
    recruiterID: number | null;
    date: string;
    totalManualApplications: number;
    totalEasyApplications: number;
    totalReceivedInterviews: number;
    createdTS: string;
    updatedTS: string | null; // Nullable in backend DTO
    createdBy: string | null;
    updatedBy: string | null;
  }
  
  export interface InterviewSummary {
    total: number;
    screening: number;
    technical: number;
    finalRound: number;
    clients: { [key: number]: MarketingClient }; // Keyed by clientID (number)
  }
  
  export interface StandupDashboard {
    applicationCounts: { clientCounts: { [key: number]: MarketingApplicationCount } }; // Keyed by clientID (number)
    todaysReceivedInterviews: InterviewSummary;
    todaysScheduledInterviews: InterviewSummary;
  }
  
  export interface FilteredDashboard {
    clients: { [key: number]: MarketingClient }; // Keyed by clientID (number)
  }
  
  export interface FilterState {
    recruiter: string; // "all" or recruiter ID as string
    dateRange: [Date | null, Date | null];
    status: string; // "all", "scheduled", "completed", etc.
    type: string; // "all", "Screening", "Technical", etc.
    searchQuery: string;
    quickFilters: string[];
  }