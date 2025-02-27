// utils/permissions.ts
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
  }
  
  interface AppPermissions {
    clients: Record<string, ClientPermissions>;
    employees: Record<string, any>;
    interviews: Record<string, any>;
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
    employees: { /* ... */ },
    interviews: { /* ... */ },
  };
  
  export default permissions;