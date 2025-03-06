using System;

namespace Backend.Dtos
{
    public class MarketingActivityUpdateDto
    {
        public int ApplicationCountID { get; set; }
        public int ClientID { get; set; }
        public DateTime Date { get; set; }
        public int TotalManualApplications { get; set; }
        public int TotalEasyApplications { get; set; }
        public int TotalReceivedInterviews { get; set; }
    }
}