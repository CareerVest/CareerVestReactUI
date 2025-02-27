using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace Backend.Dtos
{
    public class PostPlacementPlanDto
    {
        public int PostPlacementPlanID { get; set; }
        public string PlanName { get; set; }
        public string? PromissoryNoteUrl { get; set; }
        public DateTime? PostPlacementPlanPaymentStartDate { get; set; }
        public decimal? TotalPostPlacementAmount { get; set; } // Changed to decimal? to match TotalDue/TotalPaid
        public DateTime? CreatedTS { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedTS { get; set; }
        public string? UpdatedBy { get; set; }
    }
}