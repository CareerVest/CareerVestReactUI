export interface InterviewDetail {
    InterviewID: number;
    InterviewEntryDate: string | null; // ISO date or null
    RecruiterID: number | null;
    RecruiterName: string | null;
    InterviewDate: string | null; // ISO date or null
    InterviewStartTime: string | null;
    InterviewEndTime: string | null;
    ClientID: number | null;
    ClientName: string | null;
    InterviewType: string | null;
    InterviewMethod: string | null;
    Technology: string | null;
    InterviewFeedback: string | null;
    InterviewStatus: string | null;
    InterviewSupport: string | null;
    Comments: string | null;
    CreatedDate: string | null; // ISO datetime
    ModifiedDate: string | null; // ISO datetime
    EndClientName: string | null;
    CreatedTS: string | null;
    UpdatedTS: string | null;
  }