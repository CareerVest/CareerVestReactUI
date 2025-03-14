using System;
using System.Collections.Generic;

namespace Backend.Dtos
{
    public class InterviewChainDetailDto
    {
        public int InterviewChainID { get; set; }
        public int? ParentInterviewChainID { get; set; }
        public int? ClientID { get; set; }
        public string? ClientName { get; set; }
        public string? EndClientName { get; set; }
        public string? Position { get; set; }
        public string? ChainStatus { get; set; }
        public int Rounds { get; set; }
        public DateTime InterviewEntryDate { get; set; }
        public int? RecruiterID { get; set; }
        public string? RecruiterName { get; set; }
        public List<InterviewDto> Interviews { get; set; } = new List<InterviewDto>();
    }

    public class InterviewDto
    {
        public int InterviewChainID { get; set; }
        public int? ParentInterviewChainID { get; set; }
        public int? ClientID { get; set; }
        public string EndClientName { get; set; }
        public string Position { get; set; }
        public string ChainStatus { get; set; }
        public int Rounds { get; set; }
        public DateTime InterviewEntryDate { get; set; }
        public int? RecruiterID { get; set; }
        public DateTime? InterviewDate { get; set; }
        public string InterviewStartTime { get; set; }
        public string InterviewEndTime { get; set; }
        public string InterviewMethod { get; set; }
        public string InterviewType { get; set; }
        public string InterviewStatus { get; set; }
        public string InterviewOutcome { get; set; }
        public string InterviewSupport { get; set; }
        public string InterviewFeedback { get; set; }
        public string Comments { get; set; }
        public DateTime CreatedTS { get; set; }
        public DateTime UpdatedTS { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }
}