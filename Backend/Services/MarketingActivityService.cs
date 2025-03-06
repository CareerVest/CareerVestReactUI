using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class MarketingActivityService : IMarketingActivityService
    {
        private readonly IMarketingActivityRepository _marketingActivityRepository;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly ILogger<MarketingActivityService> _logger;

        public MarketingActivityService(
            IMarketingActivityRepository marketingActivityRepository,
            IEmployeeRepository employeeRepository,
            ILogger<MarketingActivityService> logger)
        {
            _marketingActivityRepository = marketingActivityRepository;
            _employeeRepository = employeeRepository;
            _logger = logger;
        }

        public async Task<List<MarketingActivityListDto>> GetMarketingActivitiesForDateAsync(DateTime date, string azureUserId,string role, int? supervisorId)
        {
            _logger.LogInformation("Fetching marketing activities for date {Date} for user {AzureUserId}", date, azureUserId);
            try
            {
                var employeeId = await _employeeRepository.GetEmployeeIdByAzureIdAsync(azureUserId);
                return await _marketingActivityRepository.GetMarketingActivitiesForDateAsync(date, role, employeeId, supervisorId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching marketing activities for date {Date} and user {AzureUserId}", date, azureUserId);
                throw;
            }
        }

        public async Task<MarketingActivityDetailDto?> GetMarketingActivityByIdAsync(int id, string azureUserId,string role, int? supervisorId)
        {
            _logger.LogInformation("Fetching marketing activity {Id} for user {AzureUserId}", id, azureUserId);
            try
            {
                var employeeId = await _employeeRepository.GetEmployeeIdByAzureIdAsync(azureUserId);
                return await _marketingActivityRepository.GetMarketingActivityByIdAsync(id, role, employeeId, supervisorId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching marketing activity {Id} for user {AzureUserId}", id, azureUserId);
                throw;
            }
        }

        public async Task<bool> CreateMarketingActivityAsync(MarketingActivityCreateDto marketingActivityDto, string azureUserId)
        {
            _logger.LogInformation("Creating marketing activity for user {AzureUserId}", azureUserId);
            try
            {
                var employeeId = await _employeeRepository.GetEmployeeIdByAzureIdAsync(azureUserId);
                var applicationCount = new ApplicationCount
                {
                    ClientID = marketingActivityDto.ClientID,
                    RecruiterID = employeeId,
                    Date = marketingActivityDto.Date,
                    TotalManualApplications = marketingActivityDto.TotalManualApplications,
                    TotalEasyApplications = marketingActivityDto.TotalEasyApplications,
                    TotalReceivedInterviews = marketingActivityDto.TotalReceivedInterviews,
                    CreatedBy = azureUserId,
                    UpdatedBy = azureUserId,
                    CreatedTS = DateTime.UtcNow,
                    UpdatedTS = DateTime.UtcNow
                };

                await _marketingActivityRepository.AddMarketingActivityAsync(applicationCount);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating marketing activity for user {AzureUserId}", azureUserId);
                throw;
            }
        }

        public async Task UpdateMarketingActivityAsync(int id, MarketingActivityUpdateDto marketingActivityDto, string azureUserId)
        {
            _logger.LogInformation("Updating marketing activity {Id} for user {AzureUserId}", id, azureUserId);
            try
            {
                var employeeId = await _employeeRepository.GetEmployeeIdByAzureIdAsync(azureUserId);
                var applicationCount = new ApplicationCount
                {
                    ApplicationCountID = id,
                    ClientID = marketingActivityDto.ClientID,
                    RecruiterID = employeeId,
                    Date = marketingActivityDto.Date,
                    TotalManualApplications = marketingActivityDto.TotalManualApplications,
                    TotalEasyApplications = marketingActivityDto.TotalEasyApplications,
                    TotalReceivedInterviews = marketingActivityDto.TotalReceivedInterviews,
                    UpdatedBy = azureUserId,
                    UpdatedTS = DateTime.UtcNow
                };

                await _marketingActivityRepository.UpdateMarketingActivityAsync(applicationCount);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating marketing activity {Id} for user {AzureUserId}", id, azureUserId);
                throw;
            }
        }
    }
}