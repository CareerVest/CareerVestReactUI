using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Graph;

namespace Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly GraphServiceClient _graphClient;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            IConfiguration configuration,
            IUserRepository userRepository,
            IEmployeeRepository employeeRepository,
            GraphServiceClient graphClient,
            ILogger<AuthService> logger)
        {
            _configuration = configuration;
            _userRepository = userRepository;
            _employeeRepository = employeeRepository;
            _graphClient = graphClient;
            _logger = logger;
        }

        public async Task<string> AuthenticateAsync(string employeeReferenceId)
        {
            _logger.LogInformation($"Authentication attempt for EmployeeReferenceId: {employeeReferenceId}");

            var user = await _userRepository.GetUserByReferenceIdAsync(employeeReferenceId);
            if (user == null)
            {
                _logger.LogInformation($"User not found, attempting onboarding for {employeeReferenceId}");
                user = await OnboardEmployeeAsync(employeeReferenceId);
                if (user == null)
                {
                    _logger.LogWarning($"Onboarding failed for EmployeeReferenceId {employeeReferenceId}.");
                    return null;
                }
            }
            else
            {
                await CheckEmployeeStatusAsync(user);
            }

            _logger.LogInformation($"User {user.EmployeeReferenceID} authenticated successfully.");
            return GenerateJwtToken(user);
        }

        private async Task<Employee> OnboardEmployeeAsync(string employeeReferenceId)
        {
            try
            {
                var graphUser = await _graphClient.Users[employeeReferenceId]
                    .Request()
                    .GetAsync();

                if (graphUser.AccountEnabled != true)
                {
                    _logger.LogWarning($"User {employeeReferenceId} is not enabled in Microsoft 365.");
                    return null;
                }

                var employee = new Employee
                {
                    EmployeeReferenceID = employeeReferenceId,
                    FirstName = graphUser.GivenName ?? "Unknown",
                    LastName = graphUser.Surname ?? "Unknown",
                    CompanyEmailAddress = graphUser.Mail ?? graphUser.UserPrincipalName,
                    PersonalEmailAddress = graphUser.Mail ?? graphUser.UserPrincipalName,
                    JoinedDate = DateTime.UtcNow,
                    Status = "Active",
                    Role = graphUser.JobTitle ?? "Default",
                    CreatedTS = DateTime.UtcNow,
                    UpdatedTS = DateTime.UtcNow
                };

                await _employeeRepository.AddEmployeeAsync(employee);
                return employee;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to onboard employee {employeeReferenceId}");
                return null;
            }
        }

        private async Task CheckEmployeeStatusAsync(Employee employee)
        {
            try
            {
                var graphUser = await _graphClient.Users[employee.EmployeeReferenceID]
                    .Request()
                    .GetAsync();

                if (graphUser.AccountEnabled != true && employee.Status != "Inactive")
                {
                    employee.Status = "Inactive";
                    employee.TerminatedDate = DateTime.UtcNow;
                    await _employeeRepository.UpdateEmployeeAsync(employee);
                    _logger.LogInformation($"Employee {employee.EmployeeReferenceID} status updated to Inactive.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to check status for employee {employee.EmployeeReferenceID}");
            }
        }

        public static Dictionary<string, string> GetClaimsFromToken(ClaimsPrincipal userPrincipal)
        {
            var claims = new Dictionary<string, string>();
            if (userPrincipal == null) return claims;

            claims["EmployeeReferenceId"] = userPrincipal.FindFirst("oid")?.Value ?? "";
            claims["Email"] = userPrincipal.FindFirst(ClaimTypes.Email)?.Value ?? "";
            claims["Name"] = userPrincipal.FindFirst(ClaimTypes.Name)?.Value ?? "";
            claims["Role"] = userPrincipal.FindFirst(ClaimTypes.Role)?.Value ?? "";
            return claims;
        }

        private string GenerateJwtToken(Employee user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.EmployeeID.ToString()),
                new Claim("EmployeeReferenceId", user.EmployeeReferenceID),
                new Claim(ClaimTypes.Email, user.CompanyEmailAddress),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("Role", user.Role),
                new Claim("EmployeeID", user.EmployeeID.ToString())
            };

            if (user.Role == "RecruitingLead" && user.SupervisorID.HasValue)
            {
                claims.Add(new Claim("SupervisorID", user.SupervisorID.Value.ToString()));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(8),
                Audience = _configuration["Jwt:Audience"],
                Issuer = _configuration["Jwt:Issuer"],
                SigningCredentials = null
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateJwtSecurityToken(tokenDescriptor);
            return tokenHandler.WriteToken(securityToken);
        }
    }
}