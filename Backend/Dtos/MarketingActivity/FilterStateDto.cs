using System;

namespace Backend.Dtos
{
    public class FilterStateDto
    {
        public string Recruiter { get; set; } = "all"; // Matches recruiter ID or "all"
        public DateTime? StartDate { get; set; } // Start of date range
        public DateTime? EndDate { get; set; } // End of date range
        public string Status { get; set; } = "all"; // "all", "scheduled", "completed", "cancelled"
        public string Type { get; set; } = "all"; // "all", "Screening", "Technical", "Final Round"
        public string SearchQuery { get; set; } = ""; // Free-text search input (e.g., "client:XYZ status:completed")
        public string[] QuickFilters { get; set; } = Array.Empty<string>(); // Array of quick filter strings (e.g., ["Today", "Scheduled"])
    }
}