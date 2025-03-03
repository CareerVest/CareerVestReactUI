using Backend.Dtos;
using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IEmployeeRepository
    {
        Task<List<EmployeeListDto>> GetAllEmployeesAsync(string role, int employeeId, int? supervisorId); // Changed return type to EmployeeListDto
        Task<Employee?> GetEmployeeByIdAsync(int id, string role, int employeeId, int? supervisorId);
        Task<Employee> GetEmployeeByIdAsync(int id);
        Task<int> GetEmployeeIdByAzureIdAsync(string azureUserId);
        Task AddEmployeeAsync(Employee employee);
        Task UpdateEmployeeAsync(Employee employee);
        Task<List<Employee>> GetRecruitersAsync();
        Task<Employee> GetEmployeeByAzureIdAsync(string azureUserId); // Existing method to fetch employee by Azure ID
        Task<List<Employee>> GetEmployeesBySupervisorIdAsync(int supervisorId); // New method to fetch employees by supervisor ID
    }
}