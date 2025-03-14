using System;

namespace Backend.Dtos
{
    public class InterviewChainEndDto
    {
        public int InterviewChainID { get; set; }
        public string? InterviewOutcome { get; set; } // "Next", "Offer", "Rejected", "AddNew"
        public string? InterviewFeedback { get; set; }
        public string? Comments { get; set; }
    }
}