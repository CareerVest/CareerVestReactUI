export interface PaymentSchedule {
  paymentDate: string;
  amount: number;
  isPaid: boolean;
  paymentType: "Subscription" | "PostPlacement";
}

export interface ClientDetail {
  clientID: number;
  clientName: string;
  enrollmentDate: string | null;
  techStack: string | null;
  visaStatus: string | null;
  personalPhoneNumber: string | null;
  personalEmailAddress: string | null;
  linkedInURL: string | null;
  marketingStartDate: string | null;
  marketingEndDate: string | null;
  marketingEmailID: string | null;
  assignedRecruiterID: number | null;
  assignedRecruiterName: string | null;
  clientStatus: string | null;
  placedDate: string | null;
  backedOutDate: string | null;
  backedOutReason: string | null;
  subscriptionPlanID: number | null;
  subscriptionPlanName: string | null;
  serviceAgreementUrl: string | null;
  totalDue: number;
  totalPaid: number;
  postPlacementPlanID: number | null;
  postPlacementPlanName: string | null;
  promissoryNoteUrl: string | null;
  paymentSchedules: PaymentSchedule[];
}
