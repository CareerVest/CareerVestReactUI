using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class InterviewChain
    {
        [Key]
        public int InterviewChainID { get; set; }

        [ForeignKey("ParentInterviewChain")]
        public int? ParentInterviewChainID { get; set; } // Links to previous chain for same EndClientName
        public InterviewChain? ParentInterviewChain { get; set; }

        [ForeignKey("Client")]
        public int? ClientID { get; set; }
        public Client? Client { get; set; }

        public string? EndClientName { get; set; } // From old interviews table

        [StringLength(100)]
        public string? Position { get; set; } // Job position

        [StringLength(50)]
        public string? ChainStatus { get; set; } // "Active", "Successful", "Unsuccessful"

        public int Rounds { get; set; } // Number of interviews in the chain

        [Required]
        public DateTime InterviewEntryDate { get; set; } // Date the chain was entered

        [ForeignKey("Recruiter")]
        public int? RecruiterID { get; set; }
        public Employee? Recruiter { get; set; }

        public DateTime? InterviewDate { get; set; }
        [StringLength(50)]
        public string? InterviewStartTime { get; set; }
        [StringLength(50)]
        public string? InterviewEndTime { get; set; }
        [StringLength(100)]
        public string? InterviewMethod { get; set; }
        [StringLength(100)]
        public string? InterviewType { get; set; }
        [StringLength(50)]
        public string? InterviewStatus { get; set; } // "Scheduled", "In Progress", "Completed"
        [StringLength(50)]
        public string? InterviewOutcome { get; set; } // "Next", "Offer", "Rejected"
        public string? InterviewSupport { get; set; }
        public string? InterviewFeedback { get; set; }
        public string? Comments { get; set; }

        [Required]
        public DateTime CreatedTS { get; set; } = DateTime.UtcNow;
        [Required]
        public DateTime UpdatedTS { get; set; } = DateTime.UtcNow;

        [StringLength(100)]
        public string? CreatedBy { get; set; }
        [StringLength(100)]
        public string? UpdatedBy { get; set; }

        // Navigation property for interviews in the chain
        public virtual ICollection<InterviewChain> ChildInterviews { get; set; } = new List<InterviewChain>();
    }
}