using System;
using System.Collections.Generic;

namespace Backend.Dtos
{
    public class StandupDashboardDto
    {
        public ApplicationCountsSummaryDto ApplicationCounts { get; set; }
        public InterviewSummaryDto TodaysReceivedInterviews { get; set; }
        public InterviewSummaryDto TodaysScheduledInterviews { get; set; }
    }

    public class ApplicationCountsSummaryDto
    {
        // Change to nullable Dictionary and default to null
        public Dictionary<int, MarketingActivityApplicationCountDto> ClientCounts { get; set; } = null;
    }

    public class InterviewSummaryDto
    {
        public int Total { get; set; }
        public int Screening { get; set; }
        public int Technical { get; set; }
        public int FinalRound { get; set; }
        public Dictionary<int, ClientInterviewsDto> Clients { get; set; } = new Dictionary<int, ClientInterviewsDto>();
    }

    public class FilteredDashboardDto
    {
        public Dictionary<int, ClientInterviewsDto> Clients { get; set; } = new Dictionary<int, ClientInterviewsDto>();
    }

    public class ClientInterviewsDto
    {
        public int ClientID { get; set; }
        public string ClientName { get; set; }
        public string ClientStatus { get; set; }
        public int? RecruiterID { get; set; }
        public string RecruiterName { get; set; }
        public List<MarketingActivityInterviewListDto> Interviews { get; set; } = new List<MarketingActivityInterviewListDto>();
        public MarketingActivityApplicationCountDto ApplicationCount { get; set; }
    }

    public class MarketingActivityInterviewListDto
    {
        public int InterviewID { get; set; }
        public DateTime InterviewEntryDate { get; set; } // Required in model
        public int? RecruiterID { get; set; }
        public string RecruiterName { get; set; }
        public DateTime? InterviewDate { get; set; }
        public string InterviewStartTime { get; set; }
        public string InterviewEndTime { get; set; }
        public int? ClientID { get; set; } // Nullable in model
        public string ClientName { get; set; }
        public string InterviewType { get; set; }
        public string InterviewStatus { get; set; }
        public string InterviewMethod { get; set; } // Added from model
        public string Technology { get; set; } // Renamed from Tech for clarity
        public string InterviewFeedback { get; set; } // Added from model
        public string InterviewSupport { get; set; } // Added from model
        public bool? IsActive { get; set; }
        public string Comments { get; set; } // Added from model
        public string EndClientName { get; set; }
        public string Time { get; set; } // Constructed from StartTime and EndTime
        public string Company { get; set; } // Maps to EndClientName
    }

    public class MarketingActivityApplicationCountDto
    {
        public int ApplicationCountID { get; set; }
        public int ClientID { get; set; }
        public string ClientName { get; set; }
        public int? RecruiterID { get; set; }
        public string Date { get; set; }
        public int TotalManualApplications { get; set; }
        public int TotalEasyApplications { get; set; }
        public int TotalReceivedInterviews { get; set; }
        public string CreatedTS { get; set; }
        public string UpdatedTS { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }
}