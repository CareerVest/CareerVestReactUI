using Backend.Data;
using Backend.Dtos;
using Backend.DTOs;
using Backend.Interfaces;
using Backend.Models;
using Backend.Repositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IClientRepository _clientRepository;
        private readonly ILogger<EmployeeService> _logger;
        private readonly IAccessControlService _accessControlService;
        private readonly ApplicationDbContext _context;

        public EmployeeService(
            IEmployeeRepository employeeRepository,
            ILogger<EmployeeService> logger,
            ApplicationDbContext context,
            IClientRepository clientRepository,
            IAccessControlService accessControlService)
        {
            _employeeRepository = employeeRepository;
            _logger = logger;
            _context = context;
            _clientRepository = clientRepository;
            _accessControlService = accessControlService;
        }

        public async Task<List<EmployeeListDto>> GetEmployeesForUserAsync(string azureUserId, string role, int? supervisorId)
        {
            _logger.LogInformation("Fetching employees for user {AzureUserId}", azureUserId);
            try
            {
                var employeeId = await GetEmployeeIdByAzureIdAsync(azureUserId);
                var employees = await _employeeRepository.GetAllEmployeesAsync(role, employeeId, supervisorId);
                return employees.Select(e => MapToListDto(e)).ToList(); // Ensure e is EmployeeListDto, correct the mapping
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching employees for user {AzureUserId}", azureUserId);
                throw;
            }
        }

        public async Task<EmployeeDto?> GetEmployeeByIdForUserAsync(int id, string azureUserId, string role, int? supervisorId)
        {
            _logger.LogInformation("Fetching employee {EmployeeId} for user {AzureUserId}", id, azureUserId);
            try
            {
                var employeeId = await GetEmployeeIdByAzureIdAsync(azureUserId);
                var employee = await _employeeRepository.GetEmployeeByIdAsync(id, role, employeeId, supervisorId);
                return employee != null ? MapToDto(employee) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching employee {EmployeeId} for user {AzureUserId}", id, azureUserId);
                throw;
            }
        }

        public async Task<bool> CreateEmployeeAsync(EmployeeCreateDto employeeDto, string azureUserId)
        {
            _logger.LogInformation("Creating employee for user {AzureUserId}", azureUserId);
            try
            {
                var role = (await _employeeRepository.GetEmployeeByAzureIdAsync(azureUserId))?.Role;
                // if (role != "Admin")
                // {
                //     _logger.LogWarning($"User {azureUserId} (Role: {role}) attempted to create employee without Admin role.");
                //     throw new UnauthorizedAccessException("Only Admin can create employees.");
                // }

                // if (!DateTime.TryParse(employeeDto.JoinedDate, out DateTime joinedDate))
                // {
                //     throw new ArgumentException($"Invalid JoinedDate format: {employeeDto.JoinedDate}");
                // }

                var employee = new Employee
                {
                    FirstName = employeeDto.FirstName,
                    LastName = employeeDto.LastName,
                    PersonalEmailAddress = employeeDto.PersonalEmailAddress,
                    CompanyEmailAddress = employeeDto.CompanyEmailAddress,
                    PersonalPhoneNumber = employeeDto.PersonalPhoneNumber,
                    PersonalPhoneCountryCode = employeeDto.PersonalPhoneCountryCode,
                    JoinedDate = employeeDto.JoinedDate, // Parse string to DateTime
                    Status = employeeDto.Status, // Ensure Status is string
                    Role = employeeDto.Role,
                    SupervisorID = employeeDto.SupervisorID,
                    EmployeeReferenceID = employeeDto.EmployeeReferenceID,
                    CompanyComments = employeeDto.CompanyComments,
                    CreatedTS = DateTime.UtcNow,
                    UpdatedTS = DateTime.UtcNow
                };
                await _employeeRepository.AddEmployeeAsync(employee);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating employee for user {AzureUserId}", azureUserId);
                throw;
            }
        }

        public async Task UpdateEmployeeAsync(int id, EmployeeUpdateDto employeeDto, string azureUserId)
        {
            _logger.LogInformation("Updating employee {EmployeeId} for user {AzureUserId}", id, azureUserId);
            try
            {
                var employee = await _employeeRepository.GetEmployeeByIdAsync(id);
                if (employee == null)
                    throw new KeyNotFoundException($"Employee with ID {id} not found.");

                var userEmployeeId = await GetEmployeeIdByAzureIdAsync(azureUserId);
                var role = (await _employeeRepository.GetEmployeeByAzureIdAsync(azureUserId))?.Role;

                // if (role != "Admin" && userEmployeeId != id)
                // {
                //     _logger.LogWarning($"User {azureUserId} (Role: {role}) attempted to update employee {id} without permission.");
                //     throw new UnauthorizedAccessException("Only Admin or the employee themselves can update this employee.");
                // }

                // if (!string.IsNullOrEmpty(employeeDto.JoinedDate) && !DateTime.TryParse(employeeDto.JoinedDate, out DateTime joinedDate))
                // {
                //     throw new ArgumentException($"Invalid JoinedDate format: {employeeDto.JoinedDate}");
                // }

                employee.FirstName = employeeDto.FirstName;
                employee.LastName = employeeDto.LastName;
                employee.PersonalEmailAddress = employeeDto.PersonalEmailAddress;
                employee.CompanyEmailAddress = employeeDto.CompanyEmailAddress;
                employee.PersonalPhoneNumber = employeeDto.PersonalPhoneNumber;
                employee.PersonalPhoneCountryCode = employeeDto.PersonalPhoneCountryCode;
                employee.JoinedDate = employeeDto.JoinedDate; // Parse string to DateTime if provided
                employee.Status = employeeDto.Status;
                employee.Role = employeeDto.Role;
                employee.SupervisorID = employeeDto.SupervisorID;
                employee.EmployeeReferenceID = employeeDto.EmployeeReferenceID;
                employee.CompanyComments = employeeDto.CompanyComments;
                // // Convert string TerminatedDate to DateTime? if not null or empty
                // if (!string.IsNullOrEmpty(employeeDto.TerminatedDate))
                // {
                //     if (DateTime.TryParse(employeeDto.TerminatedDate, out DateTime parsedDate))
                //     {
                //         employee.TerminatedDate = parsedDate;
                //     }
                //     else
                //     {
                //         throw new ArgumentException($"Invalid TerminatedDate format: {employeeDto.TerminatedDate}");
                //     }
                // }
                // else
                // {
                //     employee.TerminatedDate = null; // Set to null if empty or not provided
                // }
                employee.UpdatedTS = DateTime.UtcNow;

                await _employeeRepository.UpdateEmployeeAsync(employee);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating employee {EmployeeId} for user {AzureUserId}", id, azureUserId);
                throw;
            }
        }

        public async Task<bool> InactivateEmployeeAsync(int employeeId, string azureUserId)
        {
            _logger.LogInformation("Marking employee {EmployeeId} as inactive for user {AzureUserId}", employeeId, azureUserId);
            try
            {
                var role = (await _employeeRepository.GetEmployeeByAzureIdAsync(azureUserId))?.Role;
                // if (role != "Admin")
                // {
                //     _logger.LogWarning($"User {azureUserId} (Role: {role}) attempted to mark employee {employeeId} as inactive without Admin role.");
                //     throw new UnauthorizedAccessException("Only Admin can mark employees as inactive.");
                // }

                var employee = await _employeeRepository.GetEmployeeByIdAsync(employeeId);
                if (employee == null)
                {
                    _logger.LogWarning($"Employee {employeeId} not found for inactivation.");
                    return false;
                }

                // Step 1: Reassign clients assigned to this employee (if they are a recruiter)
                var clientsAssigned = await _clientRepository.GetClientsByRecruiterIdAsync(employeeId);
                if (clientsAssigned != null && clientsAssigned.Any())
                {
                    int? supervisorId = employee.SupervisorID;
                    if (supervisorId == null)
                    {
                        _logger.LogWarning($"Employee {employeeId} has clients but no supervisor to reassign to.");
                        throw new InvalidOperationException("Cannot mark employee as inactive with assigned clients without a supervisor.");
                    }

                    foreach (var client in clientsAssigned)
                    {
                        client.AssignedRecruiterID = supervisorId; // Reassign to the employee's supervisor
                        await _clientRepository.UpdateClientAsync(client);
                    }
                    _logger.LogInformation($"Reassigned {clientsAssigned.Count()} clients from employee {employeeId} to supervisor {supervisorId}.");
                }

                // Step 2: Reassign subordinates (employees supervised by this employee) to this employee's supervisor
                var subordinates = await _employeeRepository.GetEmployeesBySupervisorIdAsync(employeeId);
                if (subordinates != null && subordinates.Any())
                {
                    int? supervisorId = employee.SupervisorID;
                    if (supervisorId == null)
                    {
                        _logger.LogWarning($"Employee {employeeId} has subordinates but no supervisor to reassign to.");
                        throw new InvalidOperationException("Cannot mark employee as inactive with subordinates without a supervisor.");
                    }

                    foreach (var subordinate in subordinates)
                    {
                        subordinate.SupervisorID = supervisorId; // Reassign to the employee's supervisor
                        await _employeeRepository.UpdateEmployeeAsync(subordinate);
                    }
                    _logger.LogInformation($"Reassigned {subordinates.Count} subordinates from employee {employeeId} to supervisor {supervisorId}.");
                }

                // Step 3: Mark the employee as Inactive
                employee.Status = "Inactive";
                employee.TerminatedDate = DateTime.UtcNow; // Updated to DateTime instead of string
                await _employeeRepository.UpdateEmployeeAsync(employee);
                _logger.LogInformation($"Employee {employeeId} marked as inactive successfully.");

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking employee {EmployeeId} as inactive for user {AzureUserId}", employeeId, azureUserId);
                throw;
            }
        }

        public async Task<List<RecruiterDTO>> GetRecruitersAsync()
        {
            _logger.LogInformation("Fetching recruiters via EmployeeService.");
            try
            {
                var recruiters = await _employeeRepository.GetRecruitersAsync();
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

        public async Task<int> GetEmployeeIdByAzureIdAsync(string azureUserId)
        {
            return await _employeeRepository.GetEmployeeIdByAzureIdAsync(azureUserId);
        }

        private EmployeeDto MapToDto(Employee employee)
        {
            return new EmployeeDto
            {
                EmployeeID = employee.EmployeeID,
                EmployeeReferenceID = employee.EmployeeReferenceID,
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                PersonalEmailAddress = employee.PersonalEmailAddress,
                CompanyEmailAddress = employee.CompanyEmailAddress,
                PersonalPhoneNumber = employee.PersonalPhoneNumber,
                PersonalPhoneCountryCode = employee.PersonalPhoneCountryCode,
                JoinedDate = employee.JoinedDate, // Convert DateTime to string for DTO
                Status = employee.Status,
                //TerminatedDate = employee.TerminatedDate, // Convert DateTime? to string for DTO
                Role = employee.Role,
                SupervisorID = employee.SupervisorID,
                CompanyComments = employee.CompanyComments
            };
        }

        private EmployeeListDto MapToListDto(EmployeeListDto employeeDto)
        {
            return new EmployeeListDto
            {
                EmployeeID = employeeDto.EmployeeID,
                FirstName = employeeDto.FirstName,
                LastName = employeeDto.LastName,
                PersonalEmailAddress = employeeDto.PersonalEmailAddress,
                CompanyEmailAddress = employeeDto.CompanyEmailAddress,
                PersonalPhoneNumber = employeeDto.PersonalPhoneNumber,
                PersonalPhoneCountryCode = employeeDto.PersonalPhoneCountryCode,
                JoinedDate = employeeDto.JoinedDate, // Keep as string if EmployeeListDto expects string
                Status = employeeDto.Status,
                //TerminatedDate = employeeDto.TerminatedDate, // Keep as string if EmployeeListDto expects string
                CompanyComments = employeeDto.CompanyComments,
                Role = employeeDto.Role,
                SupervisorID = employeeDto.SupervisorID,
                SupervisorName = employeeDto.SupervisorName
            };
        }
    }
}