export interface ClientList {
  clientID: number;
  clientName: string;
  enrollmentDate: string | null;
  techStack: string | null;
  clientStatus: string | null;
  salesPerson: string | null; // Flattened from Employee Table
  assignedRecruiterName: string | null; // Flattened from Employee Table
}