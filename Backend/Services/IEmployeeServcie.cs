using Backend.Dtos;
using Backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IEmployeeService
    {
        Task<List<EmployeeListDto>> GetEmployeesForUserAsync(string azureUserId, string role, int? supervisorId); // Changed return type to EmployeeListDto
        Task<EmployeeDto?> GetEmployeeByIdForUserAsync(int employeeId, string azureUserId, string role, int? supervisorId);
        Task<bool> CreateEmployeeAsync(EmployeeCreateDto employeeDto, string azureUserId);
        Task UpdateEmployeeAsync(int id, EmployeeUpdateDto employeeDto, string azureUserId);
        Task<List<RecruiterDTO>> GetRecruitersAsync();
        Task<bool> InactivateEmployeeAsync(int employeeId, string azureUserId, string role, int? supervisorId);
        Task<int> GetEmployeeIdByAzureIdAsync(string azureUserId);
    }
}