using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using System;

namespace Backend.Controllers
{
    [Authorize]
    [Route("api/v1/marketingActivity")]
    [ApiController]
    public class MarketingActivityController : ControllerBase
    {
        private readonly IInterviewService _interviewService;
        private readonly IClientService _clientService;
        private readonly IMarketingActivityService _marketingActivityService;
        private readonly ILogger<MarketingActivityController> _logger;

        public MarketingActivityController(
            IInterviewService interviewService,
            IClientService clientService,
            IMarketingActivityService marketingActivityService,
            ILogger<MarketingActivityController> logger)
        {
            _interviewService = interviewService;
            _clientService = clientService;
            _marketingActivityService = marketingActivityService;
            _logger = logger;
        }

        [HttpGet("clients")]
        public async Task<ActionResult<List<ClientListDto>>> GetClients()
        {
            try
            {
                var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
                var role = User.FindFirstValue(ClaimTypes.Role);
                var supervisorId = User.FindFirstValue("SupervisorID");

                var clients = await _clientService.GetClientsForUserAsync(azureUserId, role, supervisorId != null ? int.Parse(supervisorId) : (int?)null);
                if (clients == null || !clients.Any()) return NotFound("No clients found for the current user.");
                return Ok(clients);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching clients");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("clients/search")]
        public async Task<ActionResult<List<ClientListDto>>> GetClientsWithSearchAndFilters([FromQuery] string query, [FromQuery] string quickFilters)
        {
            try
            {
                var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
                var role = User.FindFirstValue(ClaimTypes.Role);
                var supervisorId = User.FindFirst("SupervisorID")?.Value is string supId ? int.Parse(supId) : (int?)null;
                var filters = ParseFilters(query, quickFilters);

                var clients = await _clientService.GetClientsForUserWithFiltersAsync(azureUserId, role, supervisorId, filters);
                if (clients == null || !clients.Any()) return NotFound("No clients found matching the filters.");
                return Ok(clients);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching clients with search and filters");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("stats")]
        public async Task<ActionResult<List<InterviewStatsDto>>> GetInterviewStats([FromQuery] string date)
        {
            try
            {
                var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
                var supervisorId = User.FindFirst("SupervisorID")?.Value is string supId ? int.Parse(supId) : (int?)null;
                if (string.IsNullOrEmpty(date)) date = DateTime.Today.ToString("yyyy-MM-dd");
                var dateTime = DateTime.Parse(date);

                var stats = await _interviewService.GetInterviewStatsForDateAsync(dateTime, azureUserId, supervisorId);
                if (stats == null || !stats.Any()) return NotFound($"No interview stats found for {date}.");
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching interview stats");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("counts")]
        public async Task<ActionResult<List<MarketingActivityListDto>>> GetMarketingActivities([FromQuery] string date = null)
        {
            try
            {
                var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
                var role = User.FindFirstValue(ClaimTypes.Role);
                var supervisorId = User.FindFirstValue("SupervisorID");

                if (string.IsNullOrEmpty(role))
                {
                    _logger.LogWarning($"User {azureUserId} attempted to access employees without a valid role.");
                    return Unauthorized("User role is required.");
                }
                if (string.IsNullOrEmpty(date)) date = DateTime.Today.ToString("yyyy-MM-dd");
                var dateTime = DateTime.Parse(date);

                var activities = await _marketingActivityService.GetMarketingActivitiesForDateAsync(dateTime, azureUserId, role, supervisorId != null ? int.Parse(supervisorId) : (int?)null);
                if (activities == null || !activities.Any()) return Ok(new List<MarketingActivityListDto>()); // Return 200 with empty list instead of 404
                return Ok(activities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching marketing activities");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("counts/{id}")]
        public async Task<ActionResult<MarketingActivityDetailDto>> GetMarketingActivity(int id)
        {
            try
            {
                var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
                var role = User.FindFirstValue(ClaimTypes.Role);
                var supervisorId = User.FindFirstValue("SupervisorID");

                if (string.IsNullOrEmpty(role))
                {
                    _logger.LogWarning($"User {azureUserId} attempted to access employees without a valid role.");
                    return Unauthorized("User role is required.");
                }

                var activity = await _marketingActivityService.GetMarketingActivityByIdAsync(id, azureUserId, role, supervisorId != null ? int.Parse(supervisorId) : (int?)null);
                if (activity == null) return NotFound($"Marketing activity with ID {id} not found.");
                return Ok(activity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching marketing activity {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("counts")]
        public async Task<ActionResult> CreateMarketingActivity([FromBody] MarketingActivityCreateDto marketingActivityDto)
        {
            try
            {
                var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");

                var success = await _marketingActivityService.CreateMarketingActivityAsync(marketingActivityDto, azureUserId);
                if (!success) return NotFound("Failed to create marketing activity (user may lack permission or data issues)");
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating marketing activity");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("counts/{id}")]
        public async Task<IActionResult> UpdateMarketingActivity(int id, [FromBody] MarketingActivityUpdateDto marketingActivityDto)
        {
            try
            {
                var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");

                await _marketingActivityService.UpdateMarketingActivityAsync(id, marketingActivityDto, azureUserId);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Marketing activity not found");
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid("User lacks permission to update marketing activity");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating marketing activity {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("interviews")]
        public async Task<ActionResult<List<InterviewListDto>>> GetInterviews()
        {
            try
            {
                var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
                var role = User.FindFirstValue(ClaimTypes.Role);
                var supervisorId = User.FindFirst("SupervisorID")?.Value is string supId ? int.Parse(supId) : (int?)null;

                var interviews = await _interviewService.GetInterviewsForUserAsync(azureUserId, role, supervisorId);
                if (interviews == null || !interviews.Any()) return NotFound("No interviews found for the current user.");
                return Ok(interviews);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching interviews");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("interviews/{id}")]
        public async Task<ActionResult<InterviewDetailDto>> GetInterview(int id)
        {
            try
            {
                var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
                var role = User.FindFirstValue(ClaimTypes.Role);
                var supervisorId = User.FindFirst("SupervisorID")?.Value is string supId ? int.Parse(supId) : (int?)null;

                var interview = await _interviewService.GetInterviewByIdForUserAsync(id, azureUserId, role, supervisorId);
                if (interview == null) return NotFound($"Interview with ID {id} not found.");
                return Ok(interview);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching interview {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("interviews")]
        public async Task<ActionResult> CreateInterview([FromBody] InterviewCreateDto interviewDto)
        {
            try
            {
                var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
                var role = User.FindFirstValue(ClaimTypes.Role);

                var success = await _interviewService.CreateInterviewAsync(interviewDto, azureUserId);
                if (!success) return NotFound("Failed to create interview (user may lack permission or data issues)");
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating interview");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("interviews/{id}")]
        public async Task<IActionResult> UpdateInterview(int id, [FromBody] InterviewUpdateDto interviewDto)
        {
            try
            {
                var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
                var role = User.FindFirstValue(ClaimTypes.Role);

                await _interviewService.UpdateInterviewAsync(id, interviewDto, azureUserId);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Interview not found");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating interview {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("interviews/{id}")]
        public async Task<IActionResult> DeleteInterview(int id)
        {
            try
            {
                var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
                var role = User.FindFirstValue(ClaimTypes.Role);

                var success = await _interviewService.DeleteInterviewAsync(id, azureUserId);
                if (!success) return NotFound("Interview not found or user lacks permission");
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting interview {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        private FilterStateDto ParseFilters(string query, string quickFiltersJson)
        {
            var filters = new FilterStateDto
            {
                SearchQuery = query ?? "",
            };

            if (!string.IsNullOrEmpty(quickFiltersJson))
            {
                try
                {
                    filters.QuickFilters = System.Text.Json.JsonSerializer.Deserialize<string[]>(quickFiltersJson) ?? Array.Empty<string>();
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to parse quickFilters JSON: {QuickFiltersJson}", quickFiltersJson);
                    filters.QuickFilters = Array.Empty<string>();
                }
            }

            // Parse search query into filters
            if (!string.IsNullOrEmpty(filters.SearchQuery))
            {
                var searchParts = filters.SearchQuery.Split(" ", StringSplitOptions.RemoveEmptyEntries)
                    .Select(part => part.Trim().ToLowerInvariant());
                foreach (var part in searchParts)
                {
                    if (part.StartsWith("client:"))
                    {
                        filters.Recruiter = part.Substring("client:".Length) ?? "all";
                    }
                    else if (part.StartsWith("status:"))
                    {
                        filters.Status = part.Substring("status:".Length) switch
                        {
                            "scheduled" => "scheduled",
                            "completed" => "completed",
                            "cancelled" => "cancelled",
                            _ => "all"
                        };
                    }
                    else if (part.StartsWith("type:"))
                    {
                        filters.Type = part.Substring("type:".Length) switch
                        {
                            "screening" => "Screening",
                            "technical" => "Technical",
                            "final round" => "Final Round",
                            _ => "all"
                        };
                    }
                    else if (DateTime.TryParse(part, out DateTime date))
                    {
                        filters.StartDate = date;
                        filters.EndDate = date; // Single date as both start and end for simplicity
                    }
                }
            }

            // Apply quick filters
            foreach (var quickFilter in filters.QuickFilters)
            {
                switch (quickFilter.ToLowerInvariant())
                {
                    case "today":
                        filters.StartDate = DateTime.Today;
                        filters.EndDate = DateTime.Today;
                        break;
                    case "scheduled":
                        filters.Status = "scheduled";
                        break;
                    case "completed":
                        filters.Status = "completed";
                        break;
                    case "screening":
                        filters.Type = "Screening";
                        break;
                    case "technical":
                        filters.Type = "Technical";
                        break;
                    case "final round":
                        filters.Type = "Final Round";
                        break;
                }
            }

            return filters;
        }
    }
}