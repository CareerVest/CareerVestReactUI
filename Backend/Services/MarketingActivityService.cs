using Backend.Dtos;
using Backend.Repositories;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class MarketingActivityService : IMarketingActivityService
    {
        private readonly IMarketingActivityRepository _marketingActivityRepository;
        private readonly ILogger<MarketingActivityService> _logger;

        public MarketingActivityService(
            IMarketingActivityRepository marketingActivityRepository,
            ILogger<MarketingActivityService> logger)
        {
            _marketingActivityRepository = marketingActivityRepository;
            _logger = logger;
        }

        public async Task<StandupDashboardDto> GetStandupDashboardDataAsync(
            string azureUserId,
            string role,
            int? supervisorId,
            DateTime today,
            int? recruiterId)
        {
            _logger.LogInformation("Fetching standup dashboard data for user {AzureUserId} with role {Role}", azureUserId, role);
            try
            {
                return await _marketingActivityRepository.GetStandupDashboardDataAsync(azureUserId, role, supervisorId, today, recruiterId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching standup dashboard data for user {AzureUserId}", azureUserId);
                throw;
            }
        }

        public async Task<FilteredDashboardDto> GetFilteredDashboardDataAsync(
            string azureUserId,
            string role,
            int? supervisorId,
            FilterStateDto filters,
            DateTime date)
        {
            _logger.LogInformation("Fetching filtered dashboard data for user {AzureUserId} with role {Role}", azureUserId, role);
            try
            {
                return await _marketingActivityRepository.GetFilteredDashboardDataAsync(azureUserId, role, supervisorId, filters, date);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching filtered dashboard data for user {AzureUserId}", azureUserId);
                throw;
            }
        }
    }
}