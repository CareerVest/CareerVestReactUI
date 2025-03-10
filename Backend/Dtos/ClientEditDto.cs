using System;
using System.Collections.Generic;

namespace Backend.Dtos
{
    public class ClientEditDto
    {
        public int ClientID { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public DateTime? EnrollmentDate { get; set; }
        public string? TechStack { get; set; }
        public string? VisaStatus { get; set; }
        public string? PersonalPhoneNumber { get; set; }
        public string? PersonalEmailAddress { get; set; }
        public string? LinkedInURL { get; set; }
        public DateTime? MarketingStartDate { get; set; }
        public DateTime? MarketingEndDate { get; set; }
        public string? MarketingEmailID { get; set; }
        public int? AssignedRecruiterID { get; set; }
        public string? AssignedRecruiterName { get; set; }
        public string? ClientStatus { get; set; }
        public DateTime? PlacedDate { get; set; }
        public DateTime? BackedOutDate { get; set; }
        public string? BackedOutReason { get; set; }
        public int? SubscriptionPlanID { get; set; }
        public string? SubscriptionPlanName { get; set; }
        public decimal TotalDue { get; set; }
        public decimal TotalPaid { get; set; }
        public int? PostPlacementPlanID { get; set; }
        public string? PostPlacementPlanName { get; set; }
        public List<PaymentScheduleDto> PaymentSchedules { get; set; } = new();
    }
}