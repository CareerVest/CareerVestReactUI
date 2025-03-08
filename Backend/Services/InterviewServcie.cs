using Backend.Data;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class InterviewService : IInterviewService
    {
        private readonly IInterviewRepository _interviewRepository;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IClientRepository _clientRepository;
        private readonly ILogger<InterviewService> _logger;
        private readonly IAccessControlService _accessControlService;
        private readonly ApplicationDbContext _context;

        public InterviewService(
            IInterviewRepository interviewRepository,
            IEmployeeRepository employeeRepository,
            IClientRepository clientRepository,
            ILogger<InterviewService> logger,
            ApplicationDbContext context,
            IAccessControlService accessControlService)
        {
            _interviewRepository = interviewRepository;
            _employeeRepository = employeeRepository;
            _clientRepository = clientRepository;
            _logger = logger;
            _context = context;
            _accessControlService = accessControlService;
        }

        public async Task<List<InterviewListDto>> GetInterviewsForUserAsync(string azureUserId, string role, int? supervisorId)
        {
            _logger.LogInformation("Fetching interviews for user {AzureUserId}", azureUserId);
            try
            {
                var employeeId = await GetEmployeeIdByAzureIdAsync(azureUserId);
                var interviews = await _interviewRepository.GetAllInterviewsAsync(role, employeeId, supervisorId);
                return interviews;//.Select(i => MapToListDto(i)).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching interviews for user {AzureUserId}", azureUserId);
                throw;
            }
        }

        public async Task<InterviewDetailDto?> GetInterviewByIdForUserAsync(int interviewId, string azureUserId, string role, int? supervisorId)
        {
            _logger.LogInformation("Fetching interview {InterviewId} for user {AzureUserId}", interviewId, azureUserId);
            try
            {
                var employeeId = await GetEmployeeIdByAzureIdAsync(azureUserId);
                var interview = await _interviewRepository.GetInterviewByIdAsync(interviewId, role, employeeId, supervisorId);
                return interview != null ? MapToDetailDto(interview) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching interview {InterviewId} for user {AzureUserId}", interviewId, azureUserId);
                throw;
            }
        }

        public async Task<bool> CreateInterviewAsync(InterviewCreateDto interviewDto, string azureUserId)
        {
            _logger.LogInformation("Creating interview for user {AzureUserId}", azureUserId);
            try
            {
                var interview = new Interview
                {
                    InterviewEntryDate = DateTime.UtcNow,
                    RecruiterID = interviewDto.RecruiterID,
                    InterviewDate = interviewDto.InterviewDate,
                    InterviewStartTime = interviewDto.InterviewStartTime,
                    InterviewEndTime = interviewDto.InterviewEndTime,
                    ClientID = interviewDto.ClientID,
                    InterviewType = interviewDto.InterviewType,
                    InterviewStatus = interviewDto.InterviewStatus,
                    InterviewSupport = interviewDto.InterviewSupport,
                    InterviewMethod = interviewDto.InterviewMethod,
                    InterviewFeedback = interviewDto.InterviewFeedback,
                    Technology = interviewDto.Technology,
                    Comments = interviewDto.Comments,
                    EndClientName = interviewDto.EndClientName,
                    CreatedDate = DateTime.UtcNow,
                    ModifiedDate = DateTime.UtcNow
                };
                await _interviewRepository.AddInterviewAsync(interview);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating interview for user {AzureUserId}", azureUserId);
                throw;
            }
        }

        public async Task UpdateInterviewAsync(int id, InterviewUpdateDto interviewDto, string azureUserId)
        {
            _logger.LogInformation("Updating interview {InterviewId} for user {AzureUserId}", id, azureUserId);
            try
            {
                var interview = await _interviewRepository.GetInterviewByIdAsync(id);
                if (interview == null)
                    throw new KeyNotFoundException($"Interview with ID {id} not found.");

                interview.InterviewEntryDate = interviewDto.InterviewEntryDate;
                interview.RecruiterID = interviewDto.RecruiterID;
                interview.InterviewDate = interviewDto.InterviewDate;
                interview.InterviewStartTime = interviewDto.InterviewStartTime;
                interview.InterviewEndTime = interviewDto.InterviewEndTime;
                interview.ClientID = interviewDto.ClientID;
                interview.InterviewType = interviewDto.InterviewType;
                interview.InterviewStatus = interviewDto.InterviewStatus;
                interview.InterviewSupport = interviewDto.InterviewSupport;
                interview.InterviewMethod = interviewDto.InterviewMethod;
                interview.InterviewFeedback = interviewDto.InterviewFeedback;
                interview.Technology = interviewDto.Technology;
                interview.Comments = interviewDto.Comments;
                interview.EndClientName = interviewDto.EndClientName;
                interview.ModifiedDate = DateTime.UtcNow;

                await _interviewRepository.UpdateInterviewAsync(interview);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating interview {InterviewId} for user {AzureUserId}", id, azureUserId);
                throw;
            }
        }

        public async Task<bool> DeleteInterviewAsync(int interviewId, string azureUserId)
        {
            _logger.LogInformation("Deleting interview {InterviewId} for user {AzureUserId}", interviewId, azureUserId);
            try
            {
                var interview = await _interviewRepository.GetInterviewByIdAsync(interviewId);
                if (interview == null)
                {
                    _logger.LogWarning($"Interview {interviewId} not found for deletion.");
                    return false;
                }
                interview.IsActive = false;
                await _interviewRepository.InactivateInterviewAsync(interview);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting interview {InterviewId} for user {AzureUserId}", interviewId, azureUserId);
                throw;
            }
        }

        public async Task<int> GetEmployeeIdByAzureIdAsync(string azureUserId)
        {
            return await _employeeRepository.GetEmployeeIdByAzureIdAsync(azureUserId);
        }

        private InterviewDetailDto MapToDetailDto(Interview interview)
        {
            return new InterviewDetailDto
            {
                InterviewID = interview.InterviewID,
                InterviewEntryDate = interview.InterviewEntryDate,
                RecruiterID = interview.RecruiterID,
                RecruiterName = interview.Recruiter != null ? $"{interview.Recruiter.FirstName} {interview.Recruiter.LastName}" : null,
                InterviewDate = interview.InterviewDate,
                InterviewStartTime = interview.InterviewStartTime,
                InterviewEndTime = interview.InterviewEndTime,
                ClientID = interview.ClientID,
                ClientName = interview.Client != null ? interview.Client.ClientName : null,
                InterviewType = interview.InterviewType,
                InterviewStatus = interview.InterviewStatus,
                InterviewSupport = interview.InterviewSupport,
                InterviewMethod = interview.InterviewMethod,
                InterviewFeedback = interview.InterviewFeedback,
                Technology = interview.Technology,
                Comments = interview.Comments,
                CreatedDate = interview.CreatedDate,
                ModifiedDate = interview.ModifiedDate,
                EndClientName = interview.EndClientName
            };
        }

        private async Task<string> GetRoleFromEmployee(int employeeId)
        {
            var employee = await _employeeRepository.GetEmployeeByIdAsync(employeeId);
            return employee?.Role ?? "default";
        }
    }
}