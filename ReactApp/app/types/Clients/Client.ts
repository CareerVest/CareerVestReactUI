export interface Client {
<<<<<<< HEAD
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
  subscriptionPlan: SubscriptionPlan | null;
  totalDue: number;
  totalPaid: number;
  postPlacementPlanID: number | null;
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

export interface Employee {
  employeeID: number;
  firstName: string;
  lastName: string;
}

export interface SubscriptionPlan {
  subscriptionPlanID: number;
  planName: string;
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
  planName: string;
  promissoryNoteUrl: string | null;
  postPlacementPlanPaymentStartDate: Date | null;
  totalPostPlacementAmount: number | null;
  createdTS: Date | null;
  createdBy: string | null;
  updatedTS: Date | null;
  updatedBy: string | null;
}
=======
    clientID: number;
    clientName: string;
    enrollmentDate: string | null;
    techStack?: string;
    visaStatus?: string;
    personalPhoneNumber?: string;
    personalEmailAddress?: string;
    linkedInURL?: string;
    marketingStartDate?: string | null;
    marketingEndDate?: string | null;
    marketingEmailID?: string;
    marketingEmailPassword?: string;
    assignedRecruiterID?: number | null;
    clientStatus?: number | null;
    placedDate?: string | null;
    backedOutDate?: string | null;
    backedOutReason?: string;
    subscriptionPlanID?: number | null;
    totalDue: number;
    totalPaid: number;
    postPlacementPlanID?: number | null;
    paymentSchedules?: PaymentSchedule[];
  }
  
  export interface PaymentSchedule {
    paymentDate: string | null;
    amount: number;
    isPaid: boolean;
    paymentType: "Subscription" | "PostPlacement";
  }
  
  export interface Employee {
    employeeID: number;
    firstName: string;
    lastName: string;
  }
  
  export interface SubscriptionPlan {
    subscriptionPlanID: number;
    planName: string;
  }
  
  export interface PostPlacementPlan {
    postPlacementPlanID: number;
    planName: string;
  }
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
