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
  [key: string]: boolean | PermissionSection;
}

interface EmployeePermissions {
  basicInfo: PermissionSection;
  addEmployee: boolean;
  viewEmployee: boolean;
  editEmployee: boolean;
  deleteEmployee: boolean;
  [key: string]: boolean | PermissionSection;
}

interface InterviewPermissions {
  basicInfo: PermissionSection;
  addInterview: boolean;
  viewInterview: boolean;
  editInterview: boolean;
  deleteInterview: boolean;
  [key: string]: boolean | PermissionSection;
}

interface InterviewChainPermissions {
  basicInfo: PermissionSection;
  addInterviewChain: boolean;
  viewInterviewChain: boolean;
  editInterviewChain: boolean;
  deleteInterviewChain: boolean;
  [key: string]: boolean | PermissionSection;
}

export interface AppPermissions {
  clients: Record<string, ClientPermissions>;
  employees: Record<string, EmployeePermissions>;
  interviews: Record<string, InterviewPermissions>;
  interviewChains: Record<string, InterviewChainPermissions>;
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
      basicInfo: { view: true, edit: { self: true } },
      addEmployee: false,
      viewEmployee: true,
      editEmployee: true,
      deleteEmployee: false,
    },
    Sales_Executive: {
      basicInfo: { view: true, edit: { self: true } },
      addEmployee: false,
      viewEmployee: true,
      editEmployee: false,
      deleteEmployee: false,
    },
    recruiter: {
      basicInfo: { view: true, edit: { self: true } },
      addEmployee: false,
      viewEmployee: true,
      editEmployee: false,
      deleteEmployee: false,
    },
    Resume_Writer: {
      basicInfo: { view: true, edit: { self: true } },
      addEmployee: false,
      viewEmployee: true,
      editEmployee: false,
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
      basicInfo: { view: true, edit: true },
      addInterview: true,
      viewInterview: true,
      editInterview: true,
      deleteInterview: true,
    },
    recruiter: {
      basicInfo: { view: true, edit: true },
      addInterview: true,
      viewInterview: true,
      editInterview: true,
      deleteInterview: true,
    },
    Senior_Recruiter: {
      basicInfo: { view: true, edit: true },
      addInterview: true,
      viewInterview: true,
      editInterview: true,
      deleteInterview: true,
    },
    Sales_Executive: {
      basicInfo: { view: true, edit: true },
      addInterview: true,
      viewInterview: true,
      editInterview: true,
      deleteInterview: true,
    },
    Resume_Writer: {
      basicInfo: { view: true, edit: false },
      addInterview: false,
      viewInterview: true,
      editInterview: false,
      deleteInterview: false,
    },
    default: {
      basicInfo: { view: true, edit: false },
      addInterview: false,
      viewInterview: true,
      editInterview: false,
      deleteInterview: false,
    },
  },
  interviewChains: {
    Admin: {
      basicInfo: { view: true, edit: true },
      addInterviewChain: true,
      viewInterviewChain: true,
      editInterviewChain: true,
      deleteInterviewChain: true,
    },
    recruiter: {
      basicInfo: { view: true, edit: true },
      addInterviewChain: true,
      viewInterviewChain: true,
      editInterviewChain: true,
      deleteInterviewChain: true,
    },
    Senior_Recruiter: {
      basicInfo: { view: true, edit: true },
      addInterviewChain: true,
      viewInterviewChain: true,
      editInterviewChain: true,
      deleteInterviewChain: true,
    },
    Sales_Executive: {
      basicInfo: { view: true, edit: true },
      addInterviewChain: true,
      viewInterviewChain: true,
      editInterviewChain: true,
      deleteInterviewChain: true,
    },
    Resume_Writer: {
      basicInfo: { view: true, edit: false },
      addInterviewChain: false,
      viewInterviewChain: true,
      editInterviewChain: false,
      deleteInterviewChain: false,
    },
    default: {
      basicInfo: { view: true, edit: false },
      addInterviewChain: false,
      viewInterviewChain: true,
      editInterviewChain: false,
      deleteInterviewChain: false,
    },
  },
};

export default permissions;
