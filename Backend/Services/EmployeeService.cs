using Backend.DTOs;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly ILogger<EmployeeService> _logger;

        public EmployeeService(IEmployeeRepository employeeRepository, ILogger<EmployeeService> logger)
        {
            _employeeRepository = employeeRepository;
            _logger = logger;
        }

        // ✅ Fetch recruiters and map to DTO
        public async Task<List<RecruiterDTO>> GetRecruitersAsync()
        {
            _logger.LogInformation("Fetching recruiters via EmployeeService.");
            try
            {
                var recruiters = await _employeeRepository.GetRecruitersAsync();

                // Map Employee to RecruiterDTO
                return recruiters.Select(e => new RecruiterDTO
                {
                    EmployeeID = e.EmployeeID,
                    FirstName = e.FirstName,
                    LastName = e.LastName
                }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred in EmployeeService while fetching recruiters.");
                throw;
            }
        }
    }
}