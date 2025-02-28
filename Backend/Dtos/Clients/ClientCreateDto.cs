using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace Backend.Dtos
{
    public class ClientCreateDto
    {
        public string ClientName { get; set; }
        public DateTime? EnrollmentDate { get; set; }
        public string? TechStack { get; set; }
        public string? PersonalPhoneNumber { get; set; }
        public string? PersonalEmailAddress { get; set; }
        public int? AssignedRecruiterID { get; set; }
        public string? VisaStatus { get; set; }
        public string? LinkedInURL { get; set; }
        public string ClientStatus { get; set; }
        public DateTime? MarketingStartDate { get; set; }
        public DateTime? MarketingEndDate { get; set; }
        public string? MarketingEmailID { get; set; }
        public string? MarketingEmailPassword { get; set; }
        public DateTime? PlacedDate { get; set; }
        public DateTime? BackedOutDate { get; set; }
        public string? BackedOutReason { get; set; }
        public double TotalDue { get; set; }
        public double TotalPaid { get; set; }
        public SubscriptionPlanDto? SubscriptionPlan { get; set; }
        public PostPlacementPlanDto? PostPlacementPlan { get; set; }
        public IFormFile? ServiceAgreement { get; set; }
        public IFormFile? PromissoryNote { get; set; }
        public List<PaymentScheduleDto>? PaymentSchedules { get; set; }
    }
}