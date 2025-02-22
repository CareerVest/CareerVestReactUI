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

namespace Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<AuthService> _logger;

        public AuthService(IConfiguration configuration, IUserRepository userRepository, ILogger<AuthService> logger)
        {
            _configuration = configuration;
            _userRepository = userRepository;
            _logger = logger;
        }

        // ✅ Microsoft Login: Authenticate using EmployeeReferenceId from Azure AD Token
        public async Task<string> AuthenticateAsync(string employeeReferenceId)
        {
            _logger.LogInformation($"Authentication attempt for EmployeeReferenceId: {employeeReferenceId}");

            var user = await _userRepository.GetUserByReferenceIdAsync(employeeReferenceId);
            if (user == null)
            {
                _logger.LogWarning($"User with EmployeeReferenceId {employeeReferenceId} not found.");
                return null;
            }

            _logger.LogInformation($"User {user.EmployeeReferenceID} authenticated successfully.");
            return GenerateJwtToken(user);
        }

        // ✅ Extract Claims from Azure AD Token (Used in Middleware)
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

        // ✅ Generate a Secure JWT Token with Role-Based Claims (No `Jwt:Key` Required)
        private string GenerateJwtToken(Employee user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.EmployeeID.ToString()),
                new Claim("EmployeeReferenceId", user.EmployeeReferenceID), // Azure AD ID
                new Claim(ClaimTypes.Email, user.CompanyEmailAddress),
                new Claim(ClaimTypes.Role, user.Role), // Role-Based Access Control
                new Claim("Role", user.Role), 
                new Claim("EmployeeID", user.EmployeeID.ToString())
            };

            // ✅ If the user is a Recruiting Lead, add their SupervisorID claim
            if (user.Role == "RecruitingLead" && user.SupervisorID.HasValue)
            {
                claims.Add(new Claim("SupervisorID", user.SupervisorID.Value.ToString()));
            }

            // ✅ Generate the token using Azure AD as the authority
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(8),
                Audience = _configuration["Jwt:Audience"],
                Issuer = _configuration["Jwt:Issuer"],
                SigningCredentials = null // ✅ No signing key needed (Azure AD handles it)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateJwtSecurityToken(tokenDescriptor);
            return tokenHandler.WriteToken(securityToken);
        }
    }
}