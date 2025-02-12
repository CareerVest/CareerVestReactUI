using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models;

namespace Backend.Models
{
    public class Client
    {
        [Key]
        public int ClientID { get; set; }

        [Required]
        [StringLength(255)]
        public string? ClientName { get; set; }

        [DataType(DataType.Date)]
        public DateTime? EnrollmentDate { get; set; }

        [StringLength(500)]
        public string? TechStack { get; set; }

        [DataType(DataType.Date)]
        public DateTime? MarketingStartDate { get; set; }

        [DataType(DataType.Date)]
        public DateTime? PlacedDate { get; set; }

        [DataType(DataType.Date)]
        public DateTime? BackedOutDate { get; set; }

        [StringLength(1000)]
        public string? BackedOutReason { get; set; }

        [StringLength(255)]
        public string? ResumeBlobKey { get; set; }

        [Phone]
        [StringLength(20)]
        public string? PersonalPhoneNumber { get; set; }

        [EmailAddress]
        [StringLength(255)]
        public string? PersonalEmailAddress { get; set; }

        [EmailAddress]
        [StringLength(255)]
        public string? MarketingEmailID { get; set; }

        [StringLength(255)]
        [DataType(DataType.Password)]
        public string? MarketingEmailPassword { get; set; }

        public int? AssignedRecruiterID { get; set; }

        [ForeignKey("AssignedRecruiterID")]
        public Employee? AssignedRecruiter { get; set; }

        [StringLength(50)]
        public string? VisaStatus { get; set; }

        [StringLength(255)]
        [Url]
        public string? LinkedInURL { get; set; }

        [DataType(DataType.Date)]
        public DateTime? MarketingEndDate { get; set; }

        [StringLength(100)]
        public string? JobOutcome { get; set; }

        [DataType(DataType.Date)]
        public DateTime? JobStartDate { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? JobSalary { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        [Range(0, 100)]
        public decimal? PercentageFee { get; set; }

        [StringLength(50)]
        public string? ClientStatus { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime? CreatedTS { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime? UpdatedTS { get; set; }

        [StringLength(255)]
        public string? CreatedBy { get; set; }

        [StringLength(255)]
        public string? UpdatedBy { get; set; }

        public int? SubscriptionPlanID { get; set; }

        [ForeignKey("SubscriptionPlanID")]
        public SubscriptionPlan? SubscriptionPlan { get; set; }

        public int? PostPlacementPlanID { get; set; }

        [ForeignKey("PostPlacementPlanID")]
        public PostPlacementPlan? PostPlacementPlan { get; set; }

        //Added financial tracking fields for Accounting Module
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalDue { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPaid { get; set; } = 0;

        //Ensured Payment Schedules relationship remains intact
        //public virtual ICollection<PaymentSchedule> PaymentSchedules { get; set; } = new List<PaymentSchedule>();

        public Client()
        {
        }
    }
}