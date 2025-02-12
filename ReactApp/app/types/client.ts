export interface Client {
  ClientID: number;
  ClientName: string;
  EnrollmentDate: string | null;
  TechStack: string | null;
  MarketingStartDate: string | null;
  PlacedDate: string | null;
  BackedOutDate: string | null;
  BackedOutReason: string | null;
  PersonalPhoneNumber: string | null;
  PersonalEmailAddress: string | null;
  MarketingEmailID: string | null;
  MarketingEmailPassword: string | null;
  AssignedRecruiterID: number | null;
  VisaStatus: string | null;
  LinkedInURL: string | null;
  MarketingEndDate: string | null;
  JobOutcome: string | null;
  JobStartDate: string | null;
  JobSalary: number | null;
  PercentageFee: number | null;
  ResumeBlobKey: string | null;
  ClientStatus: string | null;
  CreatedTS: string;
  UpdatedTS: string;
  CreatedBy: string | null;
  UpdatedBy: string | null;
  SubscriptionPlanID: number | null;
  PostPlacementPlanID: number | null;
  TotalDue: number;
  TotalPaid: number;
}

export interface ClientFormData {
  ClientName: string
  EnrollmentDate: string | null
  TechStack: string | null
  PersonalPhoneNumber: string | null
  PersonalEmailAddress: string | null
  AssignedRecruiterID: number | null
  VisaStatus: string | null
  LinkedInURL: string | null
  ClientStatus: string | null
  SubscriptionPlanID: number | null
  PostPlacementPlanID: number | null
}

export interface Employee {
  EmployeeID: number
  FirstName: string
  LastName: string
  PersonalEmailAddress: string
  CompanyEmailAddress: string | null
  Role: string | null
}

export interface SubscriptionPlan {
  SubscriptionPlanID: number
  PlanName: string
  Description: string | null
  TotalSubscriptionAmount: number | null
}

export interface PostPlacementPlan {
  PostPlacementPlanID: number
  PlanName: string
  Description: string | null
  TotalPostPlacementAmount: number | null
}

export interface PaymentSchedule {
  PaymentScheduleID: number
  ClientID: number
  PaymentDate: string
  Amount: number
  PaymentType: "Subscription" | "PostPlacement"
  IsPaid: boolean
  PaymentStatus: "Pending" | "Paid" | "Blocked" | "Adjusted"
  AdjustedAmount: number | null
}

export interface Payment {
  PaymentID: number
  ClientID: number
  SubscriptionID: number | null
  Amount: number
  PaymentDate: string
  PaymentType: string
  Notes: string | null
  PaymentStatus: "Pending" | "Paid" | "Blocked" | "Adjusted"
  TransactionID: string | null
}

export interface Adjustment {
  AdjustmentID: number
  PaymentID: number
  Amount: number
  AdjustmentDate: string
  Reason: string | null
  AdjustedBy: string | null
  Comments: string | null
}

