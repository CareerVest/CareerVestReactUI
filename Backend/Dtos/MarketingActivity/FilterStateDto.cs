using System;

namespace Backend.Dtos
{
    public class FilterStateDto
    {
        public string Recruiter { get; set; } = "all";
        public string Status { get; set; } = "all";
        public string Type { get; set; } = "all";
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}