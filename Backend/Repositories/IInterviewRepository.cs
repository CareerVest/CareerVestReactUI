using Backend.Dtos;
using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Repositories
{
    public interface IInterviewRepository
    {
        Task<List<InterviewListDto>> GetAllInterviewsAsync(string role, int employeeId, int? supervisorId);
        Task<Interview?> GetInterviewByIdAsync(int id, string role, int employeeId, int? supervisorId);
        Task<Interview> GetInterviewByIdAsync(int id);
        Task AddInterviewAsync(Interview interview);
        Task UpdateInterviewAsync(Interview interview);
        Task InactivateInterviewAsync(Interview interview);

        // New method for Marketing Activity
        Task<List<InterviewStatsDto>> GetInterviewStatsForDateAsync(DateTime date, string role, int employeeId, int? supervisorId);
    }
}