using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface IEmployeeRepository
    {
        Task<List<Employee>> GetRecruitersAsync();
    }
}