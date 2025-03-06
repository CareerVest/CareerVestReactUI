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

        public async Task<List<MarketingActivityListDto>> GetMarketingActivitiesForDateAsync(DateTime date,string role, int employeeId, int? supervisorId)
        {
            _logger.LogInformation("Fetching marketing activities for date {Date} for employee {EmployeeId}", date, employeeId);
            try
            {
                var filter = _accessControlService.GetFilter<ApplicationCount>(role, "MarketingActivity", employeeId, supervisorId);
                IQueryable<ApplicationCount> query = _context.ApplicationCounts
                    .Include(ac => ac.Client)
                    .Include(ac => ac.Recruiter)
                    .Where(ac => ac.Date == date.Date)
                    .Where(filter);

                var activities = await query
                    .AsNoTracking()
                    .ToListAsync();

                return activities.Select(ac => new MarketingActivityListDto
                {
                    ApplicationCountID = ac.ApplicationCountID,
                    ClientID = ac.ClientID,
                    ClientName = ac.Client?.ClientName,
                    Date = ac.Date,
                    TotalManualApplications = ac.TotalManualApplications,
                    TotalEasyApplications = ac.TotalEasyApplications,
                    TotalReceivedInterviews = ac.TotalReceivedInterviews
                }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching marketing activities for date {Date} and employee {EmployeeId}", date, employeeId);
                throw;
            }
        }

        public async Task<MarketingActivityDetailDto?> GetMarketingActivityByIdAsync(int id,string role, int employeeId, int? supervisorId)
        {
            _logger.LogInformation("Fetching marketing activity {Id} for employee {EmployeeId}", id, employeeId);
            try
            {
                var filter = _accessControlService.GetFilter<ApplicationCount>(role, "MarketingActivity", employeeId, supervisorId);
                IQueryable<ApplicationCount> query = _context.ApplicationCounts
                    .Include(ac => ac.Client)
                    .Include(ac => ac.Recruiter)
                    .Where(ac => ac.ApplicationCountID == id)
                    .Where(filter);

                var applicationCount = await query.FirstOrDefaultAsync();
                return applicationCount != null ? MapToDetailDto(applicationCount) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching marketing activity {Id} for employee {EmployeeId}", id, employeeId);
                throw;
            }
        }

        public async Task AddMarketingActivityAsync(ApplicationCount applicationCount)
        {
            _logger.LogInformation("Adding new marketing activity with ID {ApplicationCountID}", applicationCount.ApplicationCountID);
            try
            {
                var role = await GetRoleFromEmployee(applicationCount.RecruiterID);
                var employeeFilter = _accessControlService.GetFilter<Employee>(role, "Clients", applicationCount.RecruiterID);
                var clientFilter = _accessControlService.GetFilter<Client>(role, "Clients", applicationCount.RecruiterID);

                var client = await _context.Clients
                    .FirstOrDefaultAsync(c => c.ClientID == applicationCount.ClientID && clientFilter.Compile()(c));
                if (client == null)
                    throw new UnauthorizedAccessException("User is not authorized to manage this client's application counts.");

                var recruiter = await _context.Employees
                    .FirstOrDefaultAsync(e => e.EmployeeID == applicationCount.RecruiterID && employeeFilter.Compile()(e));
                if (recruiter == null || recruiter.EmployeeID != applicationCount.RecruiterID)
                    throw new UnauthorizedAccessException("Invalid recruiter for this operation.");

                _context.ApplicationCounts.Add(applicationCount);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding marketing activity with ID {ApplicationCountID}", applicationCount.ApplicationCountID);
                throw;
            }
        }

        public async Task UpdateMarketingActivityAsync(ApplicationCount applicationCount)
        {
            _logger.LogInformation("Updating marketing activity with ID {ApplicationCountID}", applicationCount.ApplicationCountID);
            try
            {
                var role = await GetRoleFromEmployee(applicationCount.RecruiterID);
                var employeeFilter = _accessControlService.GetFilter<Employee>(role, "Clients", applicationCount.RecruiterID);
                var clientFilter = _accessControlService.GetFilter<Client>(role, "Clients", applicationCount.RecruiterID);

                var client = await _context.Clients
                    .FirstOrDefaultAsync(c => c.ClientID == applicationCount.ClientID && clientFilter.Compile()(c));
                if (client == null)
                    throw new UnauthorizedAccessException("User is not authorized to manage this client's application counts.");

                var recruiter = await _context.Employees
                    .FirstOrDefaultAsync(e => e.EmployeeID == applicationCount.RecruiterID && employeeFilter.Compile()(e));
                if (recruiter == null || recruiter.EmployeeID != applicationCount.RecruiterID)
                    throw new UnauthorizedAccessException("Invalid recruiter for this operation.");

                _context.ApplicationCounts.Update(applicationCount);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating marketing activity with ID {ApplicationCountID}", applicationCount.ApplicationCountID);
                throw;
            }
        }

        private async Task<string> GetRoleFromEmployee(int employeeId)
        {
            var employee = await _context.Employees.FindAsync(employeeId);
            return employee?.Role ?? "default";
        }

        private MarketingActivityDetailDto MapToDetailDto(ApplicationCount ac)
        {
            return new MarketingActivityDetailDto
            {
                ApplicationCountID = ac.ApplicationCountID,
                ClientID = ac.ClientID,
                ClientName = ac.Client?.ClientName,
                Date = ac.Date,
                TotalManualApplications = ac.TotalManualApplications,
                TotalEasyApplications = ac.TotalEasyApplications,
                TotalReceivedInterviews = ac.TotalReceivedInterviews,
                CreatedTS = ac.CreatedTS,
                UpdatedTS = ac.UpdatedTS,
                CreatedBy = ac.CreatedBy,
                UpdatedBy = ac.UpdatedBy
            };
        }
    }
}