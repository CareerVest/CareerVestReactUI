using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace Backend.Dtos
{
    public class ClientDetailDto
    {
        public int ClientID { get; set; }
        public string? ClientName { get; set; } // Made nullable
        public DateTime? EnrollmentDate { get; set; }
        public string? TechStack { get; set; }
        public string? VisaStatus { get; set; }
        public string? PersonalPhoneNumber { get; set; }
        public string? PersonalEmailAddress { get; set; }
        public string? LinkedInURL { get; set; }
        public DateTime? MarketingStartDate { get; set; }
        public DateTime? MarketingEndDate { get; set; }
        public string? MarketingEmailID { get; set; }
        public string? MarketingEmailPassword { get; set; } // Added to match frontend
        public int? AssignedRecruiterID { get; set; }
        public string? AssignedRecruiterName { get; set; }
        public string? ClientStatus { get; set; } // Made nullable
        public DateTime? PlacedDate { get; set; }
        public DateTime? BackedOutDate { get; set; }
        public string? BackedOutReason { get; set; }
        public int? SubscriptionPlanID { get; set; }
        public string? SubscriptionPlanName { get; set; } // Made nullable
        public string? ServiceAgreementUrl { get; set; } // Made nullable
        public decimal TotalDue { get; set; }
        public decimal TotalPaid { get; set; }
        public int? PostPlacementPlanID { get; set; }
        public string? PostPlacementPlanName { get; set; } // Made nullable
        public string? PromissoryNoteUrl { get; set; } // Made nullable
        public SubscriptionPlanDto? SubscriptionPlan { get; set; } // Added nested object
        public PostPlacementPlanDto? PostPlacementPlan { get; set; } // Added nested object
        public List<PaymentScheduleDto> PaymentSchedules { get; set; } = new List<PaymentScheduleDto>();
    }
}