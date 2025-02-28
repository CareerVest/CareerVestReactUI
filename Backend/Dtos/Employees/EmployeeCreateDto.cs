namespace Backend.Dtos
{
    public class EmployeeCreateDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PersonalEmailAddress { get; set; }
        public string CompanyEmailAddress { get; set; }
        public string? PersonalPhoneNumber { get; set; }
        public string? PersonalPhoneCountryCode { get; set; } // New
        public DateTime JoinedDate { get; set; }
        public string Status { get; set; }
        public string Role { get; set; }
        public int? SupervisorID { get; set; }
        public string EmployeeReferenceID { get; set; }
        public string? CompanyComments { get; set; } // New
    }
}