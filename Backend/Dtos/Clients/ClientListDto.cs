using System;
using Backend.Models;

namespace Backend.Dtos
{
    public class ClientListDto
    {
        public int ClientID { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public DateTime? EnrollmentDate { get; set; }
        public string? TechStack { get; set; }
        public string? ClientStatus { get; set; }
        
        public int? AssignedRecruiterID { get; set; } // ✅ Added AssignedRecruiterID
        public string? AssignedRecruiterName { get; set; } // ✅ Recruiter's Name
        public int? SalesPersonID { get; set; } // ✅ Added SalesPersonID
        public string? SalesPerson { get; set; } // ✅ Flattened Sales Person Name
        public decimal TotalDue { get; set; }
        public decimal TotalPaid { get; set; }

        public virtual ICollection<InterviewListDto> Interviews { get; set; } = new List<InterviewListDto>();
    }
}