using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Dtos;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/v1/interviews")]
    [ApiController]
    [Authorize]
    public class InterviewsController : ControllerBase
    {
        private readonly IInterviewService _interviewService;
        private readonly ILogger<InterviewsController> _logger;

        public InterviewsController(IInterviewService interviewService, ILogger<InterviewsController> logger)
        {
            _interviewService = interviewService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<InterviewListDto>>> GetInterviews()
        {
            var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
            var role = User.FindFirstValue(ClaimTypes.Role);
            var supervisorId = User.FindFirstValue("SupervisorID");

            if (string.IsNullOrEmpty(role))
            {
                _logger.LogWarning($"User {azureUserId} attempted to access interviews without a valid role.");
                return Unauthorized("User role is required.");
            }

            var interviews = await _interviewService.GetInterviewsForUserAsync(azureUserId, role, supervisorId != null ? int.Parse(supervisorId) : (int?)null);
            return Ok(interviews);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetInterviewById(int id)
        {
            var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
            var role = User.FindFirstValue(ClaimTypes.Role);
            var supervisorId = User.FindFirstValue("SupervisorID");

            if (string.IsNullOrEmpty(role))
            {
                _logger.LogWarning($"User {azureUserId} attempted to access an interview without a valid role.");
                return Unauthorized("User role is required.");
            }

            var interview = await _interviewService.GetInterviewByIdForUserAsync(id, azureUserId, role, supervisorId != null ? int.Parse(supervisorId) : (int?)null);
            if (interview == null)
                return NotFound("Interview not found or unauthorized.");

            return Ok(interview);
        }

        [HttpPost]
        public async Task<IActionResult> CreateInterview([FromBody] InterviewCreateDto interviewCreateDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for interview creation.");
                return BadRequest(ModelState);
            }

            var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
            var role = User.FindFirstValue(ClaimTypes.Role);

            // Restrict creation to certain roles (e.g., Admin, Senior_Recruiter, Recruiter)
            if (!new[] { "Admin", "Senior_Recruiter", "Recruiter" }.Contains(role))
            {
                _logger.LogWarning($"User {azureUserId} (Role: {role}) attempted to create interview without permission.");
                return Unauthorized("Only Admin, Senior Recruiter, or Recruiter can create interviews.");
            }

            try
            {
                var success = await _interviewService.CreateInterviewAsync(interviewCreateDto, azureUserId);
                return Ok(new { success });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating interview for user {AzureUserId}", azureUserId);
                return StatusCode(500, "An error occurred while creating the interview.");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInterview(int id, [FromBody] InterviewUpdateDto interviewUpdateDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for interview update.");
                return BadRequest(ModelState);
            }

            var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
            var role = User.FindFirstValue(ClaimTypes.Role);

            // Restrict updates to certain roles (e.g., Admin, Senior_Recruiter, Recruiter, or self)
            var employeeId = await _interviewService.GetEmployeeIdByAzureIdAsync(azureUserId);
            var interview = await _interviewService.GetInterviewByIdForUserAsync(id, azureUserId, role, null);
            if (interview == null || (!new[] { "Admin", "Senior_Recruiter", "Recruiter" }.Contains(role) && interview.RecruiterID != employeeId))
            {
                _logger.LogWarning($"User {azureUserId} (Role: {role}) attempted to update interview {id} without permission.");
                return Unauthorized("Only Admin, Senior Recruiter, Recruiter, or the assigned recruiter can update this interview.");
            }

            try
            {
                await _interviewService.UpdateInterviewAsync(id, interviewUpdateDto, azureUserId);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Interview not found.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating interview {InterviewId} for user {AzureUserId}", id, azureUserId);
                return StatusCode(500, "An error occurred while updating the interview.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInterview(int id)
        {
            var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
            var role = User.FindFirstValue(ClaimTypes.Role);

            // Restrict deletion to Admin only
            if (role != "Admin")
            {
                _logger.LogWarning($"User {azureUserId} (Role: {role}) attempted to delete interview {id} without Admin role.");
                return Unauthorized("Only Admin can delete interviews.");
            }

            try
            {
                var success = await _interviewService.DeleteInterviewAsync(id, azureUserId);
                if (!success)
                    return NotFound("Interview not found or unauthorized.");

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting interview {InterviewId} for user {AzureUserId}", id, azureUserId);
                return StatusCode(500, "An error occurred while deleting the interview.");
            }
        }
    }
}