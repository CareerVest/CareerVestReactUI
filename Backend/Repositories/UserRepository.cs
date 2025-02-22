using System.Threading.Tasks;
using Backend.Data;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Backend.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UserRepository> _logger;

        public UserRepository(ApplicationDbContext context, ILogger<UserRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Employee> GetUserByReferenceIdAsync(string employeeReferenceId)
        {
            _logger.LogInformation($"Fetching user by EmployeeReferenceID: {employeeReferenceId}");

            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.EmployeeReferenceID == employeeReferenceId);

            if (employee == null)
            {
                _logger.LogWarning($"No user found with EmployeeReferenceID: {employeeReferenceId}");
                throw new KeyNotFoundException($"No user found with EmployeeReferenceID: {employeeReferenceId}");
            }

            return employee;
        }
    }
}