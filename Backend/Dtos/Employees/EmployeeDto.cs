namespace Backend.Dtos
{
    public class EmployeeDto
    {
        public int EmployeeID { get; set; }
        public string EmployeeReferenceID { get; set; }
        public string FirstName { get; set; } = string.Empty; // New
        public string LastName { get; set; } = string.Empty; // New
        public string PersonalEmailAddress { get; set; } = string.Empty; // New
        public string CompanyEmailAddress { get; set; }
        public string? PersonalPhoneNumber { get; set; } // New
        public string? PersonalPhoneCountryCode { get; set; }
        public DateTime JoinedDate { get; set; } // New
        public string Status { get; set; } = string.Empty; // New
        public DateTime? TerminatedDate { get; set; }
        public string Role { get; set; } = string.Empty;
        public int? SupervisorID { get; set; }
        public string? CompanyComments { get; set; }
    }
}