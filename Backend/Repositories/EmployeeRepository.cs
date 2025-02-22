using Backend.Data;
using Backend.Models;
using Backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<EmployeeRepository> _logger;

        public EmployeeRepository(ApplicationDbContext context, ILogger<EmployeeRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        // ✅ Fetch all recruiters
        public async Task<List<Employee>> GetRecruitersAsync()
        {
            _logger.LogInformation("Fetching all recruiters from the database.");
            try
            {
                return await _context.Employees
                    .Where(e => e.Role == "Bench Sales Recruiter" || e.Role == "Senior Recruiter" || e.Role == "Trainee Bench Sales Recruiter") // Adjust this condition based on your role structure
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching recruiters.");
                throw;
            }
        }
    }
}