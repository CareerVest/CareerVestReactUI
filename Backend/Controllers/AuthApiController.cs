using Backend.Services;
using Backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/v1/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        // ✅ Microsoft Login: Extracts EmployeeReferenceId from the request
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AzureAdLoginDto loginDto)
        {
            if (string.IsNullOrWhiteSpace(loginDto.EmployeeReferenceId))
            {
                _logger.LogWarning("Login failed: Missing EmployeeReferenceId.");
                return BadRequest(new { Message = "EmployeeReferenceId is required." });
            }

            _logger.LogInformation("Login attempt for EmployeeReferenceId: {EmployeeReferenceId}", loginDto.EmployeeReferenceId);

            try
            {
                // ✅ Calls `AuthenticateAsync` which internally validates the user and generates a JWT token
                var token = await _authService.AuthenticateAsync(loginDto.EmployeeReferenceId);
                
                if (token == null)
                {
                    _logger.LogWarning("Login failed: User not found or not authorized for EmployeeReferenceId: {EmployeeReferenceId}", loginDto.EmployeeReferenceId);
                    return Unauthorized(new { Message = "User not found or not authorized." });
                }

                _logger.LogInformation("Login successful for EmployeeReferenceId: {EmployeeReferenceId}", loginDto.EmployeeReferenceId);
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during login for EmployeeReferenceId: {EmployeeReferenceId}", loginDto.EmployeeReferenceId);
                return StatusCode(500, new { Message = "An unexpected error occurred during login." });
            }
        }
    }
}