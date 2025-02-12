export interface Permission {
    view: boolean
    create: boolean
    edit: boolean
    delete: boolean
  }
  
  export interface FieldPermission {
    view: boolean
    edit: boolean
  }
  
  export interface ClientPermissions {
    module: Permission
    fields: {
      [key: string]: FieldPermission
    }
  }
  
  export interface UserRole {
    name: string
    permissions: {
      clients: ClientPermissions
      // Add other modules here as needed
    }
  }
  
  export const roles: UserRole[] = [
    {
      name: "Admin",
      permissions: {
        clients: {
          module: { view: true, create: true, edit: true, delete: true },
          fields: {
            ClientName: { view: true, edit: true },
            EnrollmentDate: { view: true, edit: true },
            TechStack: { view: true, edit: true },
            PersonalPhoneNumber: { view: true, edit: true },
            PersonalEmailAddress: { view: true, edit: true },
            AssignedRecruiterID: { view: true, edit: true },
            VisaStatus: { view: true, edit: true },
            LinkedInURL: { view: true, edit: true },
            ClientStatus: { view: true, edit: true },
            SubscriptionPlanID: { view: true, edit: true },
            PostPlacementPlanID: { view: true, edit: true },
            MarketingStartDate: { view: true, edit: true },
            MarketingEndDate: { view: true, edit: true },
            MarketingEmailID: { view: true, edit: true },
            MarketingEmailPassword: { view: true, edit: true },
            PlacedDate: { view: true, edit: true },
            BackedOutDate: { view: true, edit: true },
            BackedOutReason: { view: true, edit: true },
            TotalDue: { view: true, edit: true },
            TotalPaid: { view: true, edit: true },
          },
        },
      },
    },
    {
      name: "Manager",
      permissions: {
        clients: {
          module: { view: true, create: true, edit: true, delete: false },
          fields: {
            ClientName: { view: true, edit: true },
            EnrollmentDate: { view: true, edit: true },
            TechStack: { view: true, edit: true },
            PersonalPhoneNumber: { view: true, edit: true },
            PersonalEmailAddress: { view: true, edit: true },
            AssignedRecruiterID: { view: true, edit: true },
            VisaStatus: { view: true, edit: true },
            LinkedInURL: { view: true, edit: true },
            ClientStatus: { view: true, edit: true },
            SubscriptionPlanID: { view: true, edit: false },
            PostPlacementPlanID: { view: true, edit: false },
            MarketingStartDate: { view: true, edit: true },
            MarketingEndDate: { view: true, edit: true },
            MarketingEmailID: { view: true, edit: true },
            MarketingEmailPassword: { view: false, edit: false },
            PlacedDate: { view: true, edit: true },
            BackedOutDate: { view: true, edit: true },
            BackedOutReason: { view: true, edit: true },
            TotalDue: { view: true, edit: false },
            TotalPaid: { view: true, edit: false },
          },
        },
      },
    },
    {
      name: "Recruiter",
      permissions: {
        clients: {
          module: { view: true, create: false, edit: true, delete: false },
          fields: {
            ClientName: { view: true, edit: false },
            EnrollmentDate: { view: true, edit: false },
            TechStack: { view: true, edit: true },
            PersonalPhoneNumber: { view: true, edit: true },
            PersonalEmailAddress: { view: true, edit: true },
            AssignedRecruiterID: { view: true, edit: false },
            VisaStatus: { view: true, edit: true },
            LinkedInURL: { view: true, edit: true },
            ClientStatus: { view: true, edit: true },
            SubscriptionPlanID: { view: true, edit: false },
            PostPlacementPlanID: { view: true, edit: false },
            MarketingStartDate: { view: true, edit: true },
            MarketingEndDate: { view: true, edit: true },
            MarketingEmailID: { view: true, edit: true },
            MarketingEmailPassword: { view: false, edit: false },
            PlacedDate: { view: true, edit: true },
            BackedOutDate: { view: true, edit: true },
            BackedOutReason: { view: true, edit: true },
            TotalDue: { view: false, edit: false },
            TotalPaid: { view: false, edit: false },
          },
        },
      },
    },
  ]
  
  export const getUserRole = (roleName: string): UserRole | undefined => {
    return roles.find((role) => role.name === roleName)
  }
  
  