using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Employee
    {
        [Key]
        public int EmployeeID { get; set; }

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string PersonalEmailAddress { get; set; }

        [Phone]
        [MaxLength(15)]
        public string? PersonalPhoneNumber { get; set; }

        [MaxLength(5)]
        public string? PersonalPhoneCountryCode { get; set; }

        [EmailAddress]
        [MaxLength(100)]
        public string? CompanyEmailAddress { get; set; }

        [Required]
        public DateTime JoinedDate { get; set; } = DateTime.Now;

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } //Removed nullable ? to ensure it's required

        public DateTime? TerminatedDate { get; set; }

        [MaxLength(50)]
        public string? EmployeeReferenceID { get; set; }

        [MaxLength(1000)] //Set max length for CompanyComments
        public string? CompanyComments { get; set; }

        [Required]
        [MaxLength(50)]
        public string Role { get; set; } //Removed nullable ? to ensure it's required

        public int? SupervisorID { get; set; }
        public Employee? Supervisor { get; set; }

        // Timestamps for tracking changes
        public DateTime CreatedTS { get; set; }
        public DateTime? UpdatedTS { get; set; }

        // Navigation property for the many-to-many relationship with TeamLeadEmployee
        // public ICollection<TeamLeadEmployee> TeamLeadEmployees { get; set; } = new List<TeamLeadEmployee>();
    }
}