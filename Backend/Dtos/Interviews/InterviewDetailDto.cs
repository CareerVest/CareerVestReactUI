namespace Backend.Dtos
{
    public class InterviewDetailDto
    {
        public int InterviewID { get; set; }
        public DateTime InterviewEntryDate { get; set; }
        public int? RecruiterID { get; set; }
        public string? RecruiterName { get; set; }
        public DateTime? InterviewDate { get; set; }
        public string? InterviewStartTime { get; set; }
        public string? InterviewEndTime { get; set; }
        public int? ClientID { get; set; }
        public string? ClientName { get; set; }
        public string? InterviewType { get; set; }
        public string? InterviewStatus { get; set; }
        public string? InterviewSupport { get; set; }

        public string? Technology { get; set; }
        public string? InterviewMethod { get; set; }
        public string? InterviewFeedback { get; set; }
        public string? Comments { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string? EndClientName { get; set; }
    }
}