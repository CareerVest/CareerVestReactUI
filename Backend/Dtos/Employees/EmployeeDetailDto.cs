using System;

namespace Backend.Dtos
{
    public class EmployeeDetailDto
    {
        public int EmployeeID { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string PersonalEmailAddress { get; set; } = string.Empty;
        public string CompanyEmailAddress { get; set; } = string.Empty;
        public string? PersonalPhoneNumber { get; set; }
        public string? PersonalPhoneCountryCode { get; set; } // New
        public DateTime JoinedDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? TerminatedDate { get; set; } // New
        public string EmployeeReferenceID { get; set; } = string.Empty;
        public string? CompanyComments { get; set; } // New
        public string Role { get; set; } = string.Empty;
        public int? SupervisorID { get; set; }
        public string? SupervisorName { get; set; }
        public DateTime CreatedTS { get; set; }
        public DateTime? UpdatedTS { get; set; }
    }
}