using Backend.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IInterviewChainService
    {
        Task<List<InterviewChainListDto>> GetInterviewChainsForUserAsync(string azureUserId, string role, int? supervisorId);
        Task<InterviewChainDetailDto?> GetInterviewChainByIdForUserAsync(int id, string azureUserId, string role, int? supervisorId);
        Task<int> CreateInterviewChainAsync(InterviewChainCreateDto dto, string azureUserId);
        Task UpdateInterviewChainAsync(int id, InterviewChainUpdateDto dto, string azureUserId);
        Task<bool> AddInterviewToChainAsync(InterviewChainAddDto dto, string azureUserId);
        Task EndInterviewAsync(int id, InterviewChainEndDto dto, string azureUserId);
        Task<bool> DeleteInterviewChainAsync(int id, string azureUserId);
    }
}