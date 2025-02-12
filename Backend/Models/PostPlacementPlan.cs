using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class PostPlacementPlan
    {
        [Key]
        public int PostPlacementPlanID { get; set; }

        //[Required] // Made required
        [StringLength(255)]
        public string? PlanName { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? Description { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        [Range(0, double.MaxValue, ErrorMessage = "Total Post Placement Amount must be a positive number.")]
        public decimal? TotalPostPlacementAmount { get; set; }

        [DataType(DataType.Date)]
        public DateTime? PostPlacementPaymentStartDate { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        [Url]
        public string? PromissoryNoteURL { get; set; }

        public DateTime CreatedTS { get; set; } = DateTime.UtcNow; // Default value

        public DateTime? UpdatedTS { get; set; }

        [StringLength(255)]
        public string? CreatedBy { get; set; }

        [StringLength(255)]
        public string? UpdatedBy { get; set; }

        [JsonIgnore]
        public virtual ICollection<Client> Clients { get; set; } = new HashSet<Client>(); // Better performance

        public PostPlacementPlan()
        {
        }
    }
}