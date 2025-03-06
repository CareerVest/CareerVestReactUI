using Backend.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IInterviewService
    {
        Task<List<InterviewListDto>> GetInterviewsForUserAsync(string azureUserId, string role, int? supervisorId);
        Task<InterviewDetailDto?> GetInterviewByIdForUserAsync(int interviewId, string azureUserId, string role, int? supervisorId);
        Task<bool> CreateInterviewAsync(InterviewCreateDto interviewDto, string azureUserId);
        Task UpdateInterviewAsync(int id, InterviewUpdateDto interviewDto, string azureUserId);
        Task<bool> DeleteInterviewAsync(int interviewId, string azureUserId);
        Task<int> GetEmployeeIdByAzureIdAsync(string azureUserId);

        // New method for Marketing Activity
        Task<List<InterviewStatsDto>> GetInterviewStatsForDateAsync(DateTime date, string azureUserId, int? supervisorId);
    }
}