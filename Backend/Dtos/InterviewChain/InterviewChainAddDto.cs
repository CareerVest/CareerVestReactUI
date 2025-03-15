using System;

namespace Backend.Dtos
{
    public class InterviewChainAddDto
    {
        public int InterviewChainID { get; set; }
        public int ParentInterviewChainID { get; set; }
        public DateTime? InterviewDate { get; set; }
        public string? InterviewStartTime { get; set; }
        public string? InterviewEndTime { get; set; }
        public string? InterviewType { get; set; }
        public string? InterviewMethod { get; set; }
        public string? InterviewSupport { get; set; }
        public string? InterviewStatus { get; set; } = "Scheduled";
        public string? Comments { get; set; }
    }
}