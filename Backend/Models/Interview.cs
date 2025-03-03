using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Interview
    {
        [Key]
        public int InterviewID { get; set; }

        [Required]
        public DateTime InterviewEntryDate { get; set; }

        public int? RecruiterID { get; set; }
        [ForeignKey(nameof(RecruiterID))]
        public Employee? Recruiter { get; set; }

        public DateTime? InterviewDate { get; set; }

        [MaxLength(50)]
        public string? InterviewStartTime { get; set; }

        [MaxLength(50)]
        public string? InterviewEndTime { get; set; }

        public int? ClientID { get; set; }
        [ForeignKey(nameof(ClientID))]
        public Client? Client { get; set; }

        [MaxLength(50)]
        public string? InterviewType { get; set; }

        [MaxLength(50)]
        public string? InterviewStatus { get; set; }
        [MaxLength(50)]
        public string? InterviewMethod { get; set; }
        [MaxLength(50)]
        public string? Technology { get; set; }
        [MaxLength(50)]
        public string? InterviewFeedback { get; set; }

        public string? InterviewSupport { get; set; }

        public bool? IsActive { get; set; }

        public string? Comments { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime ModifiedDate { get; set; } = DateTime.UtcNow;

        public string? EndClientName { get; set; }
    }
}