using Backend.Dtos;
using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Repositories
{
    public interface IInterviewChainRepository
    {
        Task<List<InterviewChainListDto>> GetAllInterviewChainsAsync(string role, int employeeId, int? supervisorId);
        Task<InterviewChainDetailDto?> GetInterviewChainByIdAsync(int id, string role, int employeeId, int? supervisorId);
        Task AddInterviewChainAsync(InterviewChain chain);
        Task UpdateInterviewChainAsync(InterviewChain chain);
        Task<bool> DeleteInterviewChainAsync(int id, string azureUserId);
    }
}