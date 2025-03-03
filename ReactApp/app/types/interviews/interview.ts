export interface Interview {
    InterviewID: number;
    InterviewEntryDate: string | null; // Updated to allow null (ISO date or null)
    RecruiterID: number | null;
    InterviewDate: string | null; // ISO date or null
    InterviewStartTime: string | null;
    InterviewEndTime: string | null;
    ClientID: number | null;
    InterviewType: string | null;
    InterviewMethod: string | null;
    Technology: string | null;
    InterviewFeedback: string | null;
    InterviewStatus: string | null;
    InterviewSupport: string | null;
    Comments: string | null;
    CreatedDate: string | null; // ISO datetime (e.g., "2025-02-28T00:00:00Z")
    ModifiedDate: string | null; // ISO datetime
    EndClientName: string | null;
  }