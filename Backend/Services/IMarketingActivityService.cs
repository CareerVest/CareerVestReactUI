using Backend.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IMarketingActivityService
    {
        Task<List<MarketingActivityListDto>> GetMarketingActivitiesForDateAsync(DateTime date, string azureUserId, string role, int? supervisorId);
        Task<MarketingActivityDetailDto?> GetMarketingActivityByIdAsync(int id, string azureUserId, string role, int? supervisorId);
        Task<bool> CreateMarketingActivityAsync(MarketingActivityCreateDto marketingActivityDto, string azureUserId);
        Task UpdateMarketingActivityAsync(int id, MarketingActivityUpdateDto marketingActivityDto, string azureUserId);
    }
}