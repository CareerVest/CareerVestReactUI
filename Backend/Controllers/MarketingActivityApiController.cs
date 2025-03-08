using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Dtos;
using Microsoft.Extensions.Logging;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/v1/marketing")]
    [ApiController]
    [Authorize]
    public class MarketingActivityController : ControllerBase
    {
        private readonly IMarketingActivityService _marketingActivityService;
        private readonly ILogger<MarketingActivityController> _logger;

        public MarketingActivityController(
            IMarketingActivityService marketingActivityService,
            ILogger<MarketingActivityController> logger)
        {
            _marketingActivityService = marketingActivityService;
            _logger = logger;
        }

        [HttpGet("dashboard/standup")]
        public async Task<ActionResult<StandupDashboardDto>> GetStandupDashboardData(
            [FromQuery] int? recruiterId)
        {
            var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
            var role = User.FindFirstValue(ClaimTypes.Role);
            var supervisorId = User.FindFirstValue("SupervisorID");

            if (string.IsNullOrEmpty(role))
            {
                _logger.LogWarning($"User {azureUserId} attempted to access standup dashboard without a valid role.");
                return Unauthorized("User role is required.");
            }

            try
            {
                var dashboardData = await _marketingActivityService.GetStandupDashboardDataAsync(
                    azureUserId,
                    role,
                    supervisorId != null ? int.Parse(supervisorId) : null,
                    DateTime.UtcNow.Date,
                    recruiterId
                );
                return Ok(dashboardData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching standup dashboard data for user {AzureUserId}", azureUserId);
                return StatusCode(500, "An error occurred while fetching standup dashboard data.");
            }
        }

        [HttpGet("dashboard/filtered")]
        public async Task<ActionResult<FilteredDashboardDto>> GetFilteredDashboardData(
            [FromQuery] int? recruiterId,
            [FromQuery] string? date,
            [FromQuery] string? status,
            [FromQuery] string? type,
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate)
        {
            var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
            var role = User.FindFirstValue(ClaimTypes.Role);
            var supervisorId = User.FindFirstValue("SupervisorID");

            if (string.IsNullOrEmpty(role))
            {
                _logger.LogWarning($"User {azureUserId} attempted to access filtered dashboard without a valid role.");
                return Unauthorized("User role is required.");
            }

            try
            {
                var filters = new FilterStateDto
                {
                    Recruiter = recruiterId?.ToString() ?? "all",
                    Status = status ?? "all",
                    Type = type ?? "all",
                    StartDate = startDate,
                    EndDate = endDate
                };

                var dashboardData = await _marketingActivityService.GetFilteredDashboardDataAsync(
                    azureUserId,
                    role,
                    supervisorId != null ? int.Parse(supervisorId) : null,
                    filters,
                    date != null ? DateTime.Parse(date) : DateTime.UtcNow.Date
                );
                return Ok(dashboardData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching filtered dashboard data for user {AzureUserId}", azureUserId);
                return StatusCode(500, "An error occurred while fetching filtered dashboard data.");
            }
        }
    }
}