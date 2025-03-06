using System;

namespace Backend.Dtos
{
    public class MarketingActivityListDto
    {
        public int ApplicationCountID { get; set; }
        public int ClientID { get; set; }
        public string ClientName { get; set; }
        public DateTime Date { get; set; }
        public int TotalManualApplications { get; set; }
        public int TotalEasyApplications { get; set; }
        public int TotalReceivedInterviews { get; set; }
    }
}