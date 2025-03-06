using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class ApplicationCount
    {
        [Key]
        public int ApplicationCountID { get; set; }

        [Required]
        public int ClientID { get; set; }

        [ForeignKey("ClientID")]
        public virtual Client Client { get; set; }

        [Required]
        public int RecruiterID { get; set; }

        [ForeignKey("RecruiterID")]
        public virtual Employee Recruiter { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }

        [Required]
        public int TotalManualApplications { get; set; } = 0;

        [Required]
        public int TotalEasyApplications { get; set; } = 0;

        [Required]
        public int TotalReceivedInterviews { get; set; } = 0;

        public DateTime CreatedTS { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedTS { get; set; }

        [Required]
        [StringLength(255)]
        public string CreatedBy { get; set; }

        [StringLength(255)]
        public string UpdatedBy { get; set; }
    }
}