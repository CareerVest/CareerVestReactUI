interface PermissionSection {
  view: boolean;
  edit: boolean | { [key: string]: boolean };
}

interface ClientPermissions {
  basicInfo: PermissionSection;
  marketingInfo: PermissionSection;
  subscriptionInfo: PermissionSection;
  postPlacementInfo: PermissionSection;
  addClient: boolean;
  viewClient: boolean;
  editClient: boolean;
  deleteClient: boolean;
  [key: string]: boolean | PermissionSection; // Added index signature
}

interface EmployeePermissions {
  basicInfo: PermissionSection;
  addEmployee: boolean;
  viewEmployee: boolean;
  editEmployee: boolean;
  deleteEmployee: boolean;
  [key: string]: boolean | PermissionSection; // Added index signature
}

interface InterviewPermissions {
  basicInfo: PermissionSection; // Optional, can include view/edit for specific fields if needed
  addInterview: boolean;
  viewInterview: boolean;
  editInterview: boolean;
  deleteInterview: boolean;
  [key: string]: boolean | PermissionSection; // Added index signature
}

export interface AppPermissions {
  clients: Record<string, ClientPermissions>;
  employees: Record<string, EmployeePermissions>;
  interviews: Record<string, InterviewPermissions>;
}

const permissions: AppPermissions = {
  clients: {
    Admin: {
      basicInfo: { view: true, edit: true },
      marketingInfo: { view: true, edit: true },
      subscriptionInfo: { view: true, edit: true },
      postPlacementInfo: { view: true, edit: true },
      addClient: true,
      viewClient: true,
      editClient: true,
      deleteClient: true,
    },
    Senior_Recruiter: {
      basicInfo: { view: true, edit: false },
      marketingInfo: {
        view: true,
        edit: {
          marketingStartDate: true,
          marketingEndDate: true,
          marketingEmailID: true,
          marketingEmailPassword: true,
          assignedRecruiterID: true,
          clientStatus: false,
          placedDate: false,
          backedOutDate: false,
          backedOutReason: false,
        },
      },
      subscriptionInfo: { view: false, edit: false },
      postPlacementInfo: { view: false, edit: false },
      addClient: false,
      viewClient: true,
      editClient: true,
      deleteClient: false,
    },
    Sales_Executive: {
      basicInfo: { view: true, edit: true },
      marketingInfo: { view: true, edit: true },
      subscriptionInfo: { view: true, edit: true },
      postPlacementInfo: { view: false, edit: false },
      addClient: false,
      viewClient: true,
      editClient: false,
      deleteClient: false,
    },
    recruiter: {
      basicInfo: { view: true, edit: false },
      marketingInfo: { view: false, edit: false },
      subscriptionInfo: { view: false, edit: false },
      postPlacementInfo: { view: false, edit: false },
      addClient: false,
      viewClient: true,
      editClient: false,
      deleteClient: false,
    },
    default: {
      basicInfo: { view: true, edit: false },
      marketingInfo: { view: false, edit: false },
      subscriptionInfo: { view: false, edit: false },
      postPlacementInfo: { view: false, edit: false },
      addClient: false,
      viewClient: true,
      editClient: false,
      deleteClient: false,
    },
  },
  employees: {
    Admin: {
      basicInfo: { view: true, edit: true },
      addEmployee: true,
      viewEmployee: true,
      editEmployee: true,
      deleteEmployee: true,
    },
    Senior_Recruiter: {
      basicInfo: { view: true, edit: { self: true } }, // Can edit only their own record
      addEmployee: false,
      viewEmployee: true, // Can view their own and supervised employees
      editEmployee: true, // Can edit their own and supervised employees
      deleteEmployee: false,
    },
    Sales_Executive: {
      basicInfo: { view: true, edit: { self: true } }, // Can edit only their own record
      addEmployee: false,
      viewEmployee: true, // Can view only their own record
      editEmployee: false, // Cannot edit others
      deleteEmployee: false,
    },
    recruiter: {
      basicInfo: { view: true, edit: { self: true } }, // Can edit only their own record
      addEmployee: false,
      viewEmployee: true, // Can view only their own record
      editEmployee: false, // Cannot edit others
      deleteEmployee: false,
    },
    Resume_Writer: {
      basicInfo: { view: true, edit: { self: true } }, // Can edit only their own record
      addEmployee: false,
      viewEmployee: true, // Can view only their own record
      editEmployee: false, // Cannot edit others
      deleteEmployee: false,
    },
    default: {
      basicInfo: { view: false, edit: false },
      addEmployee: false,
      viewEmployee: false,
      editEmployee: false,
      deleteEmployee: false,
    },
  },
  interviews: {
    Admin: {
      basicInfo: { view: true, edit: true }, // Optional, can be simplified if not needed
      addInterview: true,
      viewInterview: true,
      editInterview: true,
      deleteInterview: true,
    },
    recruiter: {
      basicInfo: { view: true, edit: true }, // Optional, can be simplified
      addInterview: true,
      viewInterview: true,
      editInterview: true,
      deleteInterview: true,
    },
    Senior_Recruiter: {
      basicInfo: { view: true, edit: true }, // Optional, can be simplified
      addInterview: true,
      viewInterview: true,
      editInterview: true,
      deleteInterview: true,
    },
    Sales_Executive: {
      basicInfo: { view: true, edit: true }, // Optional, can be simplified
      addInterview: true,
      viewInterview: true,
      editInterview: true,
      deleteInterview: true,
    },
    Resume_Writer: {
      basicInfo: { view: false, edit: false }, // Optional, can be simplified
      addInterview: false,
      viewInterview: false,
      editInterview: false,
      deleteInterview: false,
    },
    default: {
      basicInfo: { view: false, edit: false }, // Optional, can be simplified
      addInterview: false,
      viewInterview: false,
      editInterview: false,
      deleteInterview: false,
    },
  },
};

export default permissions;