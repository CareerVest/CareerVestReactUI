export interface SubscriptionPlan {
  subscriptionPlanID: number;
  planName: string; // Added to match the response structure
  serviceAgreementUrl: string | null;
  subscriptionPlanPaymentStartDate: Date | null;
  totalSubscriptionAmount: number | null;
  createdTS: Date | null;
  createdBy: string | null;
  updatedTS: Date | null;
  updatedBy: string | null;
}

export interface PostPlacementPlan {
  postPlacementPlanID: number;
  planName: string; // Added to match the response structure
  promissoryNoteUrl: string | null;
  postPlacementPlanPaymentStartDate: Date | null;
  totalPostPlacementAmount: number | null;
  createdTS: Date | null;
  createdBy: string | null;
  updatedTS: Date | null;
  updatedBy: string | null;
}

export interface ClientDetail {
  clientID: number;
  clientName: string;
  enrollmentDate: Date | null;
  techStack: string | null;
  visaStatus: string | null;
  personalPhoneNumber: string | null;
  personalEmailAddress: string | null;
  linkedInURL: string | null;
  marketingStartDate: Date | null;
  marketingEndDate: Date | null;
  marketingEmailID: string | null;
  marketingEmailPassword: string | null;
  assignedRecruiterID: number | null;
  assignedRecruiterName: string | null;
  clientStatus: string;
  placedDate: Date | null;
  backedOutDate: Date | null;
  backedOutReason: string | null;
  subscriptionPlanID: number | null;
  subscriptionPlanName: string | null; // Added to match the response
  subscriptionPlan: SubscriptionPlan | null;
  totalDue: number;
  totalPaid: number;
  postPlacementPlanID: number | null;
  postPlacementPlanName: string | null; // Added to match the response
  postPlacementPlan: PostPlacementPlan | null;
  paymentSchedules: PaymentSchedule[];
  serviceAgreementUrl: string | null;
  promissoryNoteUrl: string | null;
}

export interface PaymentSchedule {
  paymentScheduleID: number;
  clientID: number;
  paymentDate: Date | null;
  amount: number;
  isPaid: boolean;
  paymentType: "Subscription" | "PostPlacement";
  subscriptionPlanID: number | null;
  postPlacementPlanID: number | null;
  createdTS: Date | null;
  createdBy: string | null;
  updatedTS: Date | null;
  updatedBy: string | null;
}