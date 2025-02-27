using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace Backend.Dtos
{
    public class SubscriptionPlanDto
    {
        public int SubscriptionPlanID { get; set; }
        public string PlanName { get; set; }
        public string? ServiceAgreementUrl { get; set; }
        public DateTime? SubscriptionPlanPaymentStartDate { get; set; }
        public decimal? TotalSubscriptionAmount { get; set; } // Changed to decimal? to match TotalDue/TotalPaid
        public DateTime? CreatedTS { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedTS { get; set; }
        public string? UpdatedBy { get; set; }
    }
}