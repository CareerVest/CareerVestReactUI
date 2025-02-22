export interface Client {
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