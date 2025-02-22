using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Interfaces
{
    public interface IUserRepository
    {
        Task<Employee> GetUserByReferenceIdAsync(string employeeReferenceId);
    }
}