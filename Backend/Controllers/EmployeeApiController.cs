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
    [Route("api/v1/employees")]
    [ApiController]
    [Authorize]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly ILogger<EmployeesController> _logger;

        public EmployeesController(IEmployeeService employeeService, ILogger<EmployeesController> logger)
        {
            _employeeService = employeeService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeListDto>>> GetEmployees() // Changed return type to IEnumerable<EmployeeListDto>
        {
            var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
            var role = User.FindFirstValue(ClaimTypes.Role);
            var supervisorId = User.FindFirstValue("SupervisorID");

            if (string.IsNullOrEmpty(role))
            {
                _logger.LogWarning($"User {azureUserId} attempted to access employees without a valid role.");
                return Unauthorized("User role is required.");
            }

            var employees = await _employeeService.GetEmployeesForUserAsync(azureUserId, role, supervisorId != null ? int.Parse(supervisorId) : (int?)null);
            return Ok(employees);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
            var role = User.FindFirstValue(ClaimTypes.Role);
            var supervisorId = User.FindFirstValue("SupervisorID");

            if (string.IsNullOrEmpty(role))
            {
                _logger.LogWarning($"User {azureUserId} attempted to access an employee without a valid role.");
                return Unauthorized("User role is required.");
            }

            var employee = await _employeeService.GetEmployeeByIdForUserAsync(id, azureUserId, role, supervisorId != null ? int.Parse(supervisorId) : (int?)null);
            if (employee == null)
                return NotFound("Employee not found or unauthorized.");

            return Ok(employee);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEmployee([FromBody] EmployeeCreateDto employeeCreateDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for employee creation.");
                return BadRequest(ModelState);
            }

            var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
            var role = User.FindFirstValue(ClaimTypes.Role);

            if (role != "Admin")
            {
                _logger.LogWarning($"User {azureUserId} (Role: {role}) attempted to create employee without Admin role.");
                return Unauthorized("Only Admin can create employees.");
            }

            try
            {
                var success = await _employeeService.CreateEmployeeAsync(employeeCreateDto, azureUserId);
                return Ok(new { success });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating employee for user {AzureUserId}", azureUserId);
                return StatusCode(500, "An error occurred while creating the employee.");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] EmployeeUpdateDto employeeUpdateDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for employee update.");
                return BadRequest(ModelState);
            }

            var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
            var role = User.FindFirstValue(ClaimTypes.Role);
            var employeeId = await _employeeService.GetEmployeeIdByAzureIdAsync(azureUserId);

            // if (role != "Admin" && employeeId != id)
            // {
            //     _logger.LogWarning($"User {azureUserId} (Role: {role}) attempted to update employee {id} without permission.");
            //     return Unauthorized("Only Admin or the employee themselves can update this employee.");
            // }

            try
            {
                await _employeeService.UpdateEmployeeAsync(id, employeeUpdateDto, azureUserId);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Employee not found.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating employee {EmployeeId} for user {AzureUserId}", id, azureUserId);
                return StatusCode(500, "An error occurred while updating the employee.");
            }
        }

        /// <summary>
        /// Marks an employee as inactive instead of deleting them.
        /// </summary>
        /// <param name="id">Employee ID</param>
        /// <returns>No content if successful</returns>
        [HttpPut("{id}/inactivate")]
        public async Task<IActionResult> InactivateEmployee(int id)
        {
            var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
            var role = User.FindFirstValue(ClaimTypes.Role);

            if (role != "Admin")
            {
                _logger.LogWarning($"User {azureUserId} (Role: {role}) attempted to mark employee {id} as inactive without Admin role.");
                return Unauthorized("Only Admin can mark employees as inactive.");
            }

            try
            {
                var success = await _employeeService.InactivateEmployeeAsync(id, azureUserId);
                if (!success)
                {
                    return NotFound("Employee not found or unauthorized.");
                }
                _logger.LogInformation($"Employee {id} marked as inactive successfully for user {azureUserId}.");
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Employee not found.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking employee {EmployeeId} as inactive for user {AzureUserId}", id, azureUserId);
                return StatusCode(500, "An error occurred while marking the employee as inactive.");
            }
        }

        [HttpGet("recruiters")]
        public async Task<IActionResult> GetRecruiters()
        {
            _logger.LogInformation("Received request to fetch recruiters.");
            try
            {
                var recruiters = await _employeeService.GetRecruitersAsync();
                return Ok(recruiters);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to fetch recruiters.");
                return StatusCode(500, "An error occurred while fetching recruiters.");
            }
        }
    }
}