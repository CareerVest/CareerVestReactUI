using Backend.Data;
using Backend.Dtos;
using Backend.Models;
using Backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Services;

namespace Backend.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<EmployeeRepository> _logger;
        private readonly IAccessControlService _accessControlService;

        public EmployeeRepository(
            ApplicationDbContext context,
            ILogger<EmployeeRepository> logger,
            IAccessControlService accessControlService)
        {
            _context = context;
            _logger = logger;
            _accessControlService = accessControlService;
        }

        public async Task<List<EmployeeListDto>> GetAllEmployeesAsync(string role, int employeeId, int? supervisorId) // Changed return type to EmployeeListDto
        {
            _logger.LogInformation("Fetching all employees from the database with role {Role} for employee {EmployeeId}", role, employeeId);
            try
            {
                IQueryable<Employee> query = _context.Employees;

                switch (role.ToLowerInvariant())
                {
                    case "admin":
                        // Admin sees all employees
                        break;

                    case "senior_recruiter":
                        // Senior Recruiter sees their record and employees under their supervision
                        query = query.Where(e => e.EmployeeID == employeeId || e.SupervisorID == employeeId);
                        break;

                    case "recruiter":
                    case "sales_executive":
                    case "resume_writer":
                    case "default":
                        // Recruiter, Sales Executive, Resume Writer, and Default see only their own record
                        query = query.Where(e => e.EmployeeID == employeeId);
                        break;

                    default:
                        query = query.Where(e => false); // No access by default for unrecognized roles
                        break;
                }

                var employees = await query
                    .ToListAsync();

                // Map Employee to EmployeeListDto
                return employees.Select(e => new EmployeeListDto
                {
                    EmployeeID = e.EmployeeID,
                    FirstName = e.FirstName,
                    LastName = e.LastName,
                    PersonalEmailAddress = e.PersonalEmailAddress,
                    CompanyEmailAddress = e.CompanyEmailAddress,
                    PersonalPhoneNumber = e.PersonalPhoneNumber,
                    PersonalPhoneCountryCode = e.PersonalPhoneCountryCode,
                    JoinedDate = e.JoinedDate,
                    Status = e.Status,
                    TerminatedDate = e.TerminatedDate,
                    // EmployeeReferenceID = e.EmployeeReferenceID,
                    CompanyComments = e.CompanyComments,
                    Role = e.Role,
                    SupervisorID = e.SupervisorID,
                    SupervisorName = e.Supervisor != null ? $"{e.Supervisor.FirstName} {e.Supervisor.LastName}" : null
                }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching all employees for role {Role}", role);
                throw;
            }
        }

        public async Task<Employee?> GetEmployeeByIdAsync(int id, string role, int employeeId, int? supervisorId)
        {
            _logger.LogInformation("Fetching employee by ID {Id} with role {Role} for employee {EmployeeId}", id, role, employeeId);
            try
            {
                IQueryable<Employee> query = _context.Employees.Where(e => e.EmployeeID == id);

                switch (role.ToLowerInvariant())
                {
                    case "admin":
                        // Admin can see any employee
                        break;

                    case "senior_recruiter":
                        // Senior Recruiter can see their record or employees under their supervision
                        query = query.Where(e => e.EmployeeID == employeeId || e.SupervisorID == employeeId);
                        break;

                    case "recruiter":
                    case "sales_executive":
                    case "resume_writer":
                    case "default":
                        // Others can only see their own record
                        query = query.Where(e => e.EmployeeID == employeeId);
                        break;

                    default:
                        query = query.Where(e => false); // No access by default for unrecognized roles
                        break;
                }

                return await query.FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching employee with ID {Id}", id);
                throw;
            }
        }

        public async Task<Employee> GetEmployeeByIdAsync(int id)
        {
            _logger.LogInformation("Fetching employee by ID {Id} without role filter", id);
            try
            {
                var employee = await _context.Employees
                    .FirstOrDefaultAsync(e => e.EmployeeID == id);
                if (employee == null)
                {
                    _logger.LogWarning("Employee with ID {Id} not found", id);
                    throw new KeyNotFoundException($"Employee with ID {id} not found.");
                }
                return employee;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching employee with ID {Id}", id);
                throw;
            }
        }

        public async Task<int> GetEmployeeIdByAzureIdAsync(string azureUserId)
        {
            _logger.LogInformation("Fetching employee ID by Azure ID {AzureUserId}", azureUserId);
            try
            {
                var employee = await _context.Employees
                    .FirstOrDefaultAsync(e => e.EmployeeReferenceID == azureUserId);
                if (employee == null)
                {
                    _logger.LogWarning("Employee with Azure ID {AzureUserId} not found", azureUserId);
                    throw new KeyNotFoundException("Employee not found for Azure ID.");
                }
                return employee.EmployeeID;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching employee ID for Azure ID {AzureUserId}", azureUserId);
                throw;
            }
        }

        public async Task AddEmployeeAsync(Employee employee)
        {
            _logger.LogInformation("Adding new employee with ReferenceID {EmployeeReferenceID}", employee.EmployeeReferenceID);
            try
            {
                _context.Employees.Add(employee);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding employee with ReferenceID {EmployeeReferenceID}", employee.EmployeeReferenceID);
                throw;
            }
        }

        public async Task UpdateEmployeeAsync(Employee employee)
        {
            _logger.LogInformation("Updating employee with ID {EmployeeID}", employee.EmployeeID);
            try
            {
                _context.Employees.Update(employee);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating employee with ID {EmployeeID}", employee.EmployeeID);
                throw;
            }
        }

        public async Task<List<Employee>> GetRecruitersAsync()
        {
            _logger.LogInformation("Fetching all recruiters from the database.");
            try
            {
                return await _context.Employees
                    .Where(e => e.Role == "Bench Sales Recruiter" || e.Role == "Senior Recruiter" || e.Role == "Trainee Bench Sales Recruiter")
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching recruiters.");
                throw;
            }
        }

        public async Task<Employee> GetEmployeeByAzureIdAsync(string azureUserId)
        {
            _logger.LogInformation("Fetching employee by Azure ID {AzureUserId}", azureUserId);
            try
            {
                var employee = await _context.Employees
                    .FirstOrDefaultAsync(e => e.EmployeeReferenceID == azureUserId);
                if (employee == null)
                {
                    _logger.LogWarning("Employee with Azure ID {AzureUserId} not found", azureUserId);
                    throw new KeyNotFoundException($"No employee found with Azure ID: {azureUserId}");
                }
                return employee;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching employee with Azure ID {AzureUserId}", azureUserId);
                throw;
            }
        }

        /// <summary>
        /// Retrieves all employees supervised by the specified supervisor ID.
        /// </summary>
        public async Task<List<Employee>> GetEmployeesBySupervisorIdAsync(int supervisorId)
        {
            _logger.LogInformation("Fetching employees supervised by ID {SupervisorId}", supervisorId);
            try
            {
                return await _context.Employees
                    .Where(e => e.SupervisorID == supervisorId)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching employees supervised by ID {SupervisorId}", supervisorId);
                throw;
            }
        }
    }
}