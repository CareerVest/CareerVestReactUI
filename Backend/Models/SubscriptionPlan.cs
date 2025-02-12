using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class SubscriptionPlan
    {
        [Key]
        public int SubscriptionPlanID { get; set; }

        [Required] // Made required
        [StringLength(255)]
        public string PlanName { get; set; } = string.Empty; // Default to empty string

        [Column(TypeName = "nvarchar(max)")]
        public string? Description { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        [Range(0, double.MaxValue, ErrorMessage = "Total Subscription Amount must be a positive number.")]
        public decimal? TotalSubscriptionAmount { get; set; }

        [DataType(DataType.Date)]
        public DateTime? SubscriptionPlanPaymentStartDate { get; set; }

        [Url]
        [Column(TypeName = "nvarchar(max)")]
        public string? ServiceAgreementURL { get; set; }

        public DateTime CreatedTS { get; set; } = DateTime.UtcNow; // Default value

        public DateTime? UpdatedTS { get; set; }

        [StringLength(255)]
        public string? CreatedBy { get; set; }

        [StringLength(255)]
        public string? UpdatedBy { get; set; }

        [JsonIgnore]
        public virtual ICollection<Client> Clients { get; set; } = new HashSet<Client>(); // Better performance

        public SubscriptionPlan()
        {
        }
    }
}