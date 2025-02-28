using System;

namespace Backend.Dtos
{
    public class EmployeeListDto
    {
        public int EmployeeID { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string PersonalEmailAddress { get; set; } = string.Empty; // New
        public string CompanyEmailAddress { get; set; } = string.Empty;
        public string? PersonalPhoneNumber { get; set; } // New
        public string? PersonalPhoneCountryCode { get; set; }
        public DateTime JoinedDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? TerminatedDate { get; set; }
        public string Role { get; set; } = string.Empty;
        public int? SupervisorID { get; set; }
        public string? SupervisorName { get; set; }
        public string? CompanyComments { get; set; }
    }
}