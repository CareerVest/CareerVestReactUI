using System;
using System.Collections.Generic;

namespace Backend.Dtos
{
    public class InterviewChainListDto
    {
        public int InterviewChainID { get; set; }
        public int? ClientID { get; set; }
        public string? ClientName { get; set; }
        public string? EndClientName { get; set; }
        public string? Position { get; set; }
        public string? ChainStatus { get; set; }
        public int Rounds { get; set; }
        public DateTime InterviewEntryDate { get; set; }
        public int? RecruiterID { get; set; }
        public string? RecruiterName { get; set; }
        public DateTime? LatestInterviewDate { get; set; }
        public string? LatestInterviewStatus { get; set; } // Added
        public string? LatestInterviewType { get; set; }
    }
}