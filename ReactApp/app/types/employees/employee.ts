export interface Employee {
    EmployeeID: number;
    FirstName: string;
    LastName: string;
    PersonalEmailAddress: string;
    CompanyEmailAddress: string | null;
    PersonalPhoneNumber: string | null;
    PersonalPhoneCountryCode: string | null;
    JoinedDate: string | null;
    Status: string;
    TerminatedDate: string | null;
    EmployeeReferenceID: string | null;
    CompanyComments: string | null;
    Role: string;
    SupervisorID: number | null;
  }