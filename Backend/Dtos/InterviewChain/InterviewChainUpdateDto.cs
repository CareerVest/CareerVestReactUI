using System;

namespace Backend.Dtos
{
    public class InterviewChainUpdateDto
    {
        public int InterviewChainID { get; set; }
        public string? ChainStatus { get; set; }
        public DateTime? InterviewDate { get; set; }
        public string? InterviewStartTime { get; set; }
        public string? InterviewEndTime { get; set; }
        public string? InterviewType { get; set; }
        public string? InterviewMethod { get; set; }
        public string? InterviewStatus { get; set; }
        public string? InterviewOutcome { get; set; }
        public string? InterviewSupport { get; set; }
        public string? InterviewFeedback { get; set; }
        public string? Comments { get; set; }
    }
}