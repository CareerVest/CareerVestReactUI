using System;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Repositories
{
    public interface IMarketingActivityRepository
    {
        Task<StandupDashboardDto> GetStandupDashboardDataAsync(
            string azureUserId,
            string role,
            int? supervisorId,
            DateTime today,
            int? recruiterId);

        Task<FilteredDashboardDto> GetFilteredDashboardDataAsync(
            string azureUserId,
            string role,
            int? supervisorId,
            FilterStateDto filters,
            DateTime date);
    }
}