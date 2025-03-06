using Backend.Dtos;
using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Repositories
{
    public interface IMarketingActivityRepository
    {
        Task<List<MarketingActivityListDto>> GetMarketingActivitiesForDateAsync(DateTime date,string role, int employeeId, int? supervisorId);
        Task<MarketingActivityDetailDto?> GetMarketingActivityByIdAsync(int id,string role, int employeeId, int? supervisorId);
        Task AddMarketingActivityAsync(ApplicationCount applicationCount);
        Task UpdateMarketingActivityAsync(ApplicationCount applicationCount);
    }
}