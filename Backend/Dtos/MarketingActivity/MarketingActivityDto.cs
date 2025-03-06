using System;

namespace Backend.Dtos
{
    public class InterviewStatsDto
    {
        public DateTime Date { get; set; }
        public int Screening { get; set; }
        public int Technical { get; set; }
        public int FinalRound { get; set; }
        public int Total { get; set; }
    }

    public class MarketingActivityCountDto
    {
        public int ClientID { get; set; }
        public string ClientName { get; set; }
        public DateTime Date { get; set; }
        public int TotalManualApplications { get; set; } = 0; // Derived from interviews
        public int TotalEasyApplications { get; set; } = 0;  // Derived from interviews
        public int TotalReceivedInterviews { get; set; } = 0; // Count of interviews
    }
}