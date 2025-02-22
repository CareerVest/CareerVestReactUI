using Backend.DTOs;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
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

        // ✅ GET: api/v1/employees/recruiters
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