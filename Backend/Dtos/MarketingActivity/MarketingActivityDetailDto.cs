using System;

namespace Backend.Dtos
{
    public class MarketingActivityDetailDto
    {
        public int ApplicationCountID { get; set; }
        public int ClientID { get; set; }
        public string ClientName { get; set; }
        public DateTime Date { get; set; }
        public int TotalManualApplications { get; set; }
        public int TotalEasyApplications { get; set; }
        public int TotalReceivedInterviews { get; set; }
        public DateTime CreatedTS { get; set; }
        public DateTime? UpdatedTS { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }
}