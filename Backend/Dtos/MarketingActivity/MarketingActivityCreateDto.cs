using System;

namespace Backend.Dtos
{
    public class MarketingActivityCreateDto
    {
        public int ClientID { get; set; }
        public DateTime Date { get; set; }
        public int TotalManualApplications { get; set; }
        public int TotalEasyApplications { get; set; }
        public int TotalReceivedInterviews { get; set; }
    }
}