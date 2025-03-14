// types.ts

export interface Interview {
  InterviewChainID: number;
  ParentInterviewChainID: number | null | undefined;
  ClientID: number | null;
  EndClientName: string;
  Position: string;
  ChainStatus: string;
  Rounds: number;
  InterviewEntryDate: Date | null;
  RecruiterID: number | null;
  InterviewDate: Date | null;
  InterviewStartTime: string | null;
  InterviewEndTime: string | null;
  InterviewMethod: string | null;
  InterviewType: string | null;
  InterviewStatus: string;
  InterviewOutcome: string | null;
  InterviewSupport: string | null;
  InterviewFeedback: string | null;
  Comments: string | null;
  CreatedTS: Date | null;
  UpdatedTS: Date | null;
  CreatedBy: string | null;
  UpdatedBy: string | null;
}

export interface InterviewChain {
  id: string;
  endClientName: string;
  clientName: string;
  recruiterName: string;
  position: string;
  status: string;
  interviews: Interview[];
  rounds: number;
  createdAt: string;
  updatedAt: string;
  latestInterview: Interview | null;
  latestInterviewDate?: string | null;
  latestInterviewStatus?: string | null;
  latestInterviewType?: string | null;
}

export interface InterviewChainStats {
  totalChains: number;
  activeChains: number;
  successfulChains: number;
  unsuccessfulChains: number;
  statusBreakdown: { status: string; count: number }[];
  monthlyActivity: {
    month: string;
    active: number;
    successful: number;
    unsuccessful: number;
  }[];
  averageRounds: number;
  offerRate: number;
  topClients: { name: string; count: number }[];
}

export interface InterviewChainList {
  interviewChainID: number;
  clientID?: number | null;
  clientName?: string | null;
  endClientName?: string | null;
  position?: string | null;
  chainStatus?: string | null;
  rounds: number;
  interviewEntryDate: string;
  recruiterID?: number | null;
  recruiterName?: string | null;
  latestInterviewDate?: string | null;
  latestInterviewStatus?: string | null;
  latestInterviewType?: string | null;
}

export interface InterviewChainDetail {
  interviewChainID: number;
  parentInterviewChainID?: number | null;
  clientID?: number | null;
  clientName?: string | null;
  endClientName?: string | null;
  position?: string | null;
  chainStatus?: string | null;
  rounds: number;
  interviewEntryDate: string;
  recruiterID?: number | null;
  recruiterName?: string | null;
  interviews: { $values: any[] };
}

export interface InterviewChainCreate {
  clientID?: number | null;
  endClientName?: string | null;
  position?: string | null;
  recruiterID?: number | null;
  interviewEntryDate: string;
  interviewDate?: string | null;
  interviewStartTime?: string | null;
  interviewEndTime?: string | null;
  interviewMethod?: string | null;
  interviewType?: string | null;
  interviewStatus?: string;
  comments?: string | null;
}

export interface InterviewChainUpdate {
  interviewChainID: number;
  chainStatus?: string | null;
  interviewDate?: string | null;
  interviewStartTime?: string | null;
  interviewEndTime?: string | null;
  interviewMethod?: string | null;
  interviewType?: string | null;
  interviewStatus?: string | null;
  interviewOutcome?: string | null;
  interviewFeedback?: string | null;
  comments?: string | null;
}

export interface InterviewChainEnd {
  interviewChainID: number;
  interviewOutcome?: string | null;
  interviewFeedback?: string | null;
  comments?: string | null;
}

export interface InterviewChainAdd {
  interviewChainID: number;
  parentInterviewChainID?: number; // Added this field
  interviewDate?: string | null;
  interviewStartTime?: string | null;
  interviewEndTime?: string | null;
  interviewMethod?: string | null;
  interviewType?: string | null;
  interviewStatus?: string;
  comments?: string | null;
}

export interface InterviewChainCreateResponse {
  interviewChainID: number;
}

// Update the ChainExplorationProps interface to include the interview parameter in onEndInterview
export interface ChainExplorationProps {
  chain: InterviewChain;
  open: boolean;
  onClose: () => void;
  onEndInterview: (
    chain: InterviewChain,
    isEditing: boolean,
    interview?: Interview
  ) => void;
  onAddNewInterview: (
    chain: InterviewChain,
    newInterview?: Partial<Interview>
  ) => void;
  onUpdateChainStatus: (chainId: string, newStatus: string) => void;
  onEditInterview: (interview: Interview) => void;
}

// Update the EndInterviewDialogProps interface to include isSubmitting
export interface EndInterviewDialogProps {
  chain: InterviewChain;
  open: boolean;
  onClose: () => void;
  onSubmit: (
    chainId: string,
    outcome: "Next" | "Rejected" | "Offer" | "AddNew" | "Edit",
    newInterview?: Partial<Interview> & {
      clientName?: string;
      position?: string;
      recruiterName?: string;
    }
  ) => void;
  onOpenAddInterview: () => void;
  selectedInterview?: Interview;
  isSubmitting?: boolean;
}

// Update the AddInterviewDialogProps interface to include isSubmitting
export interface AddInterviewDialogProps {
  chain: InterviewChain;
  open: boolean;
  onClose: () => void;
  onSubmit: (
    chainId: string,
    outcome: "AddNew",
    newInterview?: Partial<Interview> & {
      clientName?: string;
      position?: string;
      recruiterName?: string;
    }
  ) => void;
  selectedInterview?: Interview;
  isSubmitting?: boolean;
}

// Update the EditInterviewDialogProps interface to include isSubmitting
export interface EditInterviewDialogProps {
  chain: InterviewChain;
  open: boolean;
  onClose: () => void;
  onSubmit: (
    chainId: string,
    outcome: "Edit",
    newInterview?: Partial<Interview> & {
      clientName?: string;
      position?: string;
      recruiterName?: string;
    }
  ) => void;
  interviewToEdit: Interview;
  isSubmitting?: boolean;
}
