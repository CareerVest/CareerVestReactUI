export interface InterviewList {
    InterviewID: number;
    InterviewEntryDate: string | null; // ISO date or null
    RecruiterName: string | null;
    InterviewDate: string | null; // ISO date or null
    InterviewStartTime: string | null;
    InterviewEndTime: string | null;
    ClientName: string | null;
    InterviewType: string | null;
    InterviewMethod: string | null;
    Technology: string | null;
    InterviewFeedback: string | null;
    InterviewStatus: string | null;
    CreatedDate: string | null; // ISO datetime
    ModifiedDate: string | null; // ISO datetime
    EndClientName: string | null;
    id: number; // For DataGrid row ID
  }