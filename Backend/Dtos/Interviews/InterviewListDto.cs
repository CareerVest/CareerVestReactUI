namespace Backend.Dtos
{
    public class InterviewListDto
    {
        public int InterviewID { get; set; }
        public DateTime InterviewEntryDate { get; set; }
        public string? RecruiterName { get; set; } // Derived from RecruiterID
        public DateTime? InterviewDate { get; set; }
        public string? InterviewStartTime { get; set; }
        public string? InterviewEndTime { get; set; }
        public string? ClientName { get; set; } // Derived from ClientID
        public string? InterviewType { get; set; }
        public string? InterviewStatus { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string? EndClientName { get; set; }
    }
}