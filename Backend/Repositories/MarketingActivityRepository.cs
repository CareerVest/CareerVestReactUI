using Backend.Data;
using Backend.Dtos;
using Backend.Models;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Repositories
{
    public class MarketingActivityRepository : IMarketingActivityRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<MarketingActivityRepository> _logger;
        private readonly IAccessControlService _accessControlService;

        public MarketingActivityRepository(
            ApplicationDbContext context,
            ILogger<MarketingActivityRepository> logger,
            IAccessControlService accessControlService)
        {
            _context = context;
            _logger = logger;
            _accessControlService = accessControlService;
        }

        private async Task<int> GetEmployeeIdAsync(string azureUserId)
        {
            var employeeId = await _context.Employees
                .Where(e => e.EmployeeReferenceID == azureUserId)
                .Select(e => e.EmployeeID)
                .FirstOrDefaultAsync();

            if (employeeId == 0)
            {
                _logger.LogWarning("Employee not found for Azure ID {AzureUserId}", azureUserId);
                throw new KeyNotFoundException("Employee not found for Azure ID.");
            }
            return employeeId;
        }

        private (int Screening, int Technical, int FinalRound) CountInterviewTypes(IEnumerable<MarketingActivityInterviewListDto> interviews)
        {
            var screeningTypes = new List<string> { "Screening" };
            var finalRoundTypes = new List<string> { "FinalRound", "Final Discussion", "Managerial Round" };
            int screening = 0, technical = 0, finalRound = 0;

            foreach (var i in interviews)
            {
                if (screeningTypes.Contains(i.InterviewType)) screening++;
                else if (finalRoundTypes.Contains(i.InterviewType)) finalRound++;
                else technical++; // Assume all others are Technical
            }
            return (screening, technical, finalRound);
        }

        public async Task<StandupDashboardDto> GetStandupDashboardDataAsync(
            string azureUserId,
            string role,
            int? supervisorId,
            DateTime today,
            int? recruiterId)
        {
            _logger.LogInformation("Fetching standup dashboard data for user {AzureUserId} with role {Role} for {Date} and recruiterId {RecruiterId}", azureUserId, role, today, recruiterId);
            try
            {
                var employeeId = await GetEmployeeIdAsync(azureUserId);
                var clientFilter = _accessControlService.GetFilter<Client>(role, "Clients", employeeId, supervisorId);

                // Determine recruiter filter
                int? effectiveRecruiterId = recruiterId ?? employeeId;

                // Step 1: Fetch clients filtered by recruiterId if provided
                var clientsQuery = _context.Clients
                    //.Where(clientFilter)
                    .Where(c => c.AssignedRecruiterID == effectiveRecruiterId)
                    .Include(c => c.AssignedRecruiter)
                    .AsNoTracking();
                var clients = await clientsQuery.ToListAsync();
                var clientIds = clients.Select(c => c.ClientID).ToList();

                // Step 2: Fetch application counts for today
                var applicationCounts = await _context.ApplicationCounts
                    .Where(ac => clientIds.Contains(ac.ClientID) && ac.Date.Date == today.Date)
                    .AsNoTracking()
                    .ToListAsync();

                // Only create dictionary if there are counts
                Dictionary<int, MarketingActivityApplicationCountDto> appCountsDict = null;
                if (applicationCounts.Any())
                {
                    appCountsDict = applicationCounts.ToDictionary(
                        ac => ac.ClientID,
                        ac => new MarketingActivityApplicationCountDto
                        {
                            ApplicationCountID = ac.ApplicationCountID,
                            ClientID = ac.ClientID,
                            ClientName = clients.FirstOrDefault(c => c.ClientID == ac.ClientID)?.ClientName ?? "",
                            RecruiterID = ac.RecruiterID,
                            Date = ac.Date.ToString("yyyy-MM-dd"),
                            TotalManualApplications = ac.TotalManualApplications,
                            TotalEasyApplications = ac.TotalEasyApplications,
                            TotalReceivedInterviews = ac.TotalReceivedInterviews,
                            CreatedTS = ac.CreatedTS.ToString("o"),
                            UpdatedTS = ac.UpdatedTS?.ToString("o"),
                            CreatedBy = ac.CreatedBy,
                            UpdatedBy = ac.UpdatedBy
                        });
                }

                // Step 3: Fetch today's received interviews (InterviewEntryDate = today)
                var receivedInterviews = await _context.Interviews
                    .Where(i => i.ClientID.HasValue && clientIds.Contains(i.ClientID.Value) && i.IsActive == true && i.InterviewEntryDate.Date == today.Date)
                    .Where(i => recruiterId == null || i.RecruiterID == effectiveRecruiterId)
                    .Include(i => i.Client)
                    .Include(i => i.Recruiter)
                    .AsNoTracking()
                    .Select(i => new MarketingActivityInterviewListDto
                    {
                        InterviewID = i.InterviewID,
                        InterviewEntryDate = i.InterviewEntryDate,
                        RecruiterID = i.RecruiterID,
                        RecruiterName = i.Recruiter != null ? $"{i.Recruiter.FirstName} {i.Recruiter.LastName}" : null,
                        InterviewDate = i.InterviewDate,
                        InterviewStartTime = i.InterviewStartTime,
                        InterviewEndTime = i.InterviewEndTime,
                        ClientID = i.ClientID,
                        ClientName = i.Client != null ? i.Client.ClientName : "",
                        InterviewType = i.InterviewType ?? "",
                        InterviewStatus = i.InterviewStatus ?? "",
                        InterviewMethod = i.InterviewMethod,
                        Technology = i.Technology,
                        InterviewFeedback = i.InterviewFeedback,
                        InterviewSupport = i.InterviewSupport,
                        IsActive = i.IsActive ?? true,
                        Comments = i.Comments,
                        EndClientName = i.EndClientName,
                        Time = i.InterviewStartTime != null && i.InterviewEndTime != null ? $"{i.InterviewStartTime} - {i.InterviewEndTime}" : "",
                        Company = i.EndClientName
                    })
                    .ToListAsync();

                var receivedClients = receivedInterviews
                    .GroupBy(i => i.ClientID ?? 0)
                    .ToDictionary(
                        g => g.Key,
                        g =>
                        {
                            var client = clients.First(c => c.ClientID == g.Key);
                            return new ClientInterviewsDto
                            {
                                ClientID = g.Key,
                                ClientName = client.ClientName,
                                ClientStatus = client.ClientStatus,
                                RecruiterID = client.AssignedRecruiterID,
                                RecruiterName = client.AssignedRecruiter != null ? $"{client.AssignedRecruiter.FirstName} {client.AssignedRecruiter.LastName}" : null,
                                Interviews = g.ToList(),
                                ApplicationCount = appCountsDict != null && appCountsDict.ContainsKey(g.Key) ? appCountsDict[g.Key] : null
                            };
                        });

                var (screeningR, technicalR, finalRoundR) = CountInterviewTypes(receivedInterviews);

                // Step 4: Fetch today's scheduled interviews (InterviewDate = today)
                var scheduledInterviews = await _context.Interviews
                    .Where(i => i.ClientID.HasValue && clientIds.Contains(i.ClientID.Value) && i.IsActive == true && i.InterviewDate.HasValue && i.InterviewDate.Value.Date == today.Date)
                    .Where(i => recruiterId == null || i.RecruiterID == effectiveRecruiterId)
                    .Include(i => i.Client)
                    .Include(i => i.Recruiter)
                    .AsNoTracking()
                    .Select(i => new MarketingActivityInterviewListDto
                    {
                        InterviewID = i.InterviewID,
                        InterviewEntryDate = i.InterviewEntryDate,
                        RecruiterID = i.RecruiterID,
                        RecruiterName = i.Recruiter != null ? $"{i.Recruiter.FirstName} {i.Recruiter.LastName}" : null,
                        InterviewDate = i.InterviewDate,
                        InterviewStartTime = i.InterviewStartTime,
                        InterviewEndTime = i.InterviewEndTime,
                        ClientID = i.ClientID,
                        ClientName = i.Client != null ? i.Client.ClientName : "",
                        InterviewType = i.InterviewType ?? "",
                        InterviewStatus = i.InterviewStatus ?? "",
                        InterviewMethod = i.InterviewMethod,
                        Technology = i.Technology,
                        InterviewFeedback = i.InterviewFeedback,
                        InterviewSupport = i.InterviewSupport,
                        IsActive = i.IsActive ?? true,
                        Comments = i.Comments,
                        EndClientName = i.EndClientName,
                        Time = i.InterviewStartTime != null && i.InterviewEndTime != null ? $"{i.InterviewStartTime} - {i.InterviewEndTime}" : "",
                        Company = i.EndClientName
                    })
                    .ToListAsync();

                var scheduledClients = scheduledInterviews
                    .GroupBy(i => i.ClientID ?? 0)
                    .ToDictionary(
                        g => g.Key,
                        g =>
                        {
                            var client = clients.First(c => c.ClientID == g.Key);
                            return new ClientInterviewsDto
                            {
                                ClientID = g.Key,
                                ClientName = client.ClientName,
                                ClientStatus = client.ClientStatus,
                                RecruiterID = client.AssignedRecruiterID,
                                RecruiterName = client.AssignedRecruiter != null ? $"{client.AssignedRecruiter.FirstName} {client.AssignedRecruiter.LastName}" : null,
                                Interviews = g.ToList(),
                                ApplicationCount = appCountsDict != null && appCountsDict.ContainsKey(g.Key) ? appCountsDict[g.Key] : null
                            };
                        });

                var (screeningS, technicalS, finalRoundS) = CountInterviewTypes(scheduledInterviews);

                return new StandupDashboardDto
                {
                    ApplicationCounts = new ApplicationCountsSummaryDto { ClientCounts = appCountsDict }, // ClientCounts will be null if no counts
                    TodaysReceivedInterviews = new InterviewSummaryDto
                    {
                        Total = receivedInterviews.Count,
                        Screening = screeningR,
                        Technical = technicalR,
                        FinalRound = finalRoundR,
                        Clients = receivedClients
                    },
                    TodaysScheduledInterviews = new InterviewSummaryDto
                    {
                        Total = scheduledInterviews.Count,
                        Screening = screeningS,
                        Technical = technicalS,
                        FinalRound = finalRoundS,
                        Clients = scheduledClients
                    }
                };
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
                var employeeId = await GetEmployeeIdAsync(azureUserId);
                var clientFilter = _accessControlService.GetFilter<Client>(role, "Clients", employeeId, supervisorId);

                // Determine recruiterId
                int? recruiterId = filters.Recruiter != "all" && !string.IsNullOrEmpty(filters.Recruiter)
                    ? int.Parse(filters.Recruiter)
                    : employeeId;

                var clients = await _context.Clients
                    .Where(clientFilter)
                    .Where(c => c.AssignedRecruiterID == recruiterId)
                    .Include(c => c.AssignedRecruiter)
                    .AsNoTracking()
                    .ToListAsync();

                var clientIds = clients.Select(c => c.ClientID).ToList();

                var screeningTypes = new List<string> { "Screening" };
                var finalRoundTypes = new List<string> { "FinalRound", "Final Discussion", "Managerial Round" };

                var interviews = await _context.Interviews
                    .Where(i => i.ClientID.HasValue && clientIds.Contains(i.ClientID.Value) && i.IsActive == true)
                    .Where(i =>
                        (!filters.StartDate.HasValue || i.InterviewDate >= filters.StartDate) &&
                        (!filters.EndDate.HasValue || i.InterviewDate <= filters.EndDate) &&
                        (string.IsNullOrEmpty(filters.Status) || filters.Status == "all" || i.InterviewStatus == filters.Status) &&
                        (string.IsNullOrEmpty(filters.Type) || filters.Type == "all" ||
                            (filters.Type == "Screening" && screeningTypes.Contains(i.InterviewType)) ||
                            (filters.Type == "FinalRound" && finalRoundTypes.Contains(i.InterviewType)) ||
                            (filters.Type == "Other" && !screeningTypes.Contains(i.InterviewType) && !finalRoundTypes.Contains(i.InterviewType))))
                    .Include(i => i.Client)
                    .Include(i => i.Recruiter)
                    .AsNoTracking()
                    .Select(i => new MarketingActivityInterviewListDto
                    {
                        InterviewID = i.InterviewID,
                        InterviewEntryDate = i.InterviewEntryDate,
                        RecruiterID = i.RecruiterID,
                        RecruiterName = i.Recruiter != null ? $"{i.Recruiter.FirstName} {i.Recruiter.LastName}" : null,
                        InterviewDate = i.InterviewDate,
                        InterviewStartTime = i.InterviewStartTime,
                        InterviewEndTime = i.InterviewEndTime,
                        ClientID = i.ClientID,
                        ClientName = i.Client != null ? i.Client.ClientName : "",
                        InterviewType = i.InterviewType ?? "",
                        InterviewStatus = i.InterviewStatus ?? "",
                        InterviewMethod = i.InterviewMethod,
                        Technology = i.Technology,
                        InterviewFeedback = i.InterviewFeedback,
                        InterviewSupport = i.InterviewSupport,
                        IsActive = i.IsActive ?? true,
                        Comments = i.Comments,
                        EndClientName = i.EndClientName,
                        Time = i.InterviewStartTime != null && i.InterviewEndTime != null ? $"{i.InterviewStartTime} - {i.InterviewEndTime}" : "",
                        Company = i.EndClientName
                    })
                    .ToListAsync();

                var applicationCounts = await _context.ApplicationCounts
                    .Where(ac => clientIds.Contains(ac.ClientID) && ac.Date.Date == date.Date)
                    .AsNoTracking()
                    .ToListAsync();

                var clientDict = interviews
                    .GroupBy(i => i.ClientID ?? 0)
                    .ToDictionary(
                        g => g.Key,
                        g =>
                        {
                            var client = clients.First(c => c.ClientID == g.Key);
                            var appCount = applicationCounts.FirstOrDefault(ac => ac.ClientID == g.Key);
                            return new ClientInterviewsDto
                            {
                                ClientID = g.Key,
                                ClientName = client.ClientName,
                                ClientStatus = client.ClientStatus,
                                RecruiterID = client.AssignedRecruiterID,
                                RecruiterName = client.AssignedRecruiter != null ? $"{client.AssignedRecruiter.FirstName} {client.AssignedRecruiter.LastName}" : null,
                                Interviews = g.ToList(),
                                ApplicationCount = appCount != null ? new MarketingActivityApplicationCountDto
                                {
                                    ApplicationCountID = appCount.ApplicationCountID,
                                    ClientID = appCount.ClientID,
                                    ClientName = client.ClientName,
                                    RecruiterID = appCount.RecruiterID,
                                    Date = appCount.Date.ToString("yyyy-MM-dd"),
                                    TotalManualApplications = appCount.TotalManualApplications,
                                    TotalEasyApplications = appCount.TotalEasyApplications,
                                    TotalReceivedInterviews = appCount.TotalReceivedInterviews,
                                    CreatedTS = appCount.CreatedTS.ToString("o"),
                                    UpdatedTS = appCount.UpdatedTS?.ToString("o"),
                                    CreatedBy = appCount.CreatedBy,
                                    UpdatedBy = appCount.UpdatedBy
                                } : null
                            };
                        });

                return new FilteredDashboardDto { Clients = clientDict };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching filtered dashboard data for user {AzureUserId}", azureUserId);
                throw;
            }
        }
    }
}