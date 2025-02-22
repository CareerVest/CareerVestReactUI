using System.Threading.Tasks;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Interfaces
{
    public interface IAuthService
    {
        Task<string> AuthenticateAsync(string employeeReferenceId);
    }
}