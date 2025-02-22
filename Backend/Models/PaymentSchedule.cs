using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class PaymentSchedule
    {
        [Key]
        public int PaymentScheduleID { get; set; }

        [Required]
        public int ClientID { get; set; }

        [ForeignKey("ClientID")]
        public virtual Client? Client { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime PaymentDate { get; set; }  // ✅ Made required

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }  // ✅ Made required

        [Required]
        [StringLength(50)]
        public string PaymentType { get; set; }  // ✅ Made required (Subscription / Post-Placement)

        public bool IsPaid { get; set; } = false;  // ✅ Default value

        public int? SubscriptionPlanID { get; set; }

        [ForeignKey("SubscriptionPlanID")]
        public virtual SubscriptionPlan? SubscriptionPlan { get; set; }

        public int? PostPlacementPlanID { get; set; }

        [ForeignKey("PostPlacementPlanID")]
        public virtual PostPlacementPlan? PostPlacementPlan { get; set; }

        [Required]
        [StringLength(20)]
        public string PaymentStatus { get; set; } = "Pending";  // ✅ Default value

        [Column(TypeName = "decimal(18,2)")]
        public decimal? AdjustedAmount { get; set; } // ✅ For payment modifications

        public DateTime CreatedTS { get; set; } = DateTime.UtcNow; // ✅ Default value

        public DateTime? UpdatedTS { get; set; }

        [StringLength(255)]
        public string? CreatedBy { get; set; }

        [StringLength(255)]
        public string? UpdatedBy { get; set; }

        [StringLength(255)]
        public string? LastModifiedBy { get; set; }  // ✅ Tracks who last modified the schedule
    }
}