using System;

namespace Backend.Dtos
{
    public class PaymentScheduleDto
    {
        public int PaymentScheduleID { get; set; }
        public int ClientID { get; set; }
        public DateTime? PaymentDate { get; set; }
        public double Amount { get; set; }
        public bool IsPaid { get; set; }
        public int? SubscriptionPlanID { get; set; }
        public int? PostPlacementPlanID { get; set; }
        public string PaymentType { get; set; }
        public DateTime? CreatedTS { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedTS { get; set; }
        public string? UpdatedBy { get; set; }
    }
}