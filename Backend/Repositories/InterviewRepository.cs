using Backend.Data;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Repositories
{
    public class InterviewRepository : IInterviewRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<InterviewRepository> _logger;
        private readonly IAccessControlService _accessControlService;

        public InterviewRepository(
            ApplicationDbContext context,
            ILogger<InterviewRepository> logger,
            IAccessControlService accessControlService)
        {
            _context = context;
            _logger = logger;
            _accessControlService = accessControlService;
        }

        public async Task<List<InterviewListDto>> GetAllInterviewsAsync(string role, int employeeId, int? supervisorId)
        {
            _logger.LogInformation("Fetching all interviews from the database with role {Role} for employee {EmployeeId}", role, employeeId);
            try
            {
                IQueryable<Interview> query = _context.Interviews
                    .Include(i => i.Recruiter)
                    .Include(i => i.Client);

                switch (role.ToLowerInvariant())
                {
                    case "admin":
                    case "recruiter":
                    case "senior_recruiter":
                        // No filtering for Admin, Recruiter, or Senior_Recruiter (all see all interviews)
                        break;

                    case "sales_executive":
                    case "resume_writer":
                    case "default":
                        // Others see no interviews
                        query = query.Where(i => false);
                        break;

                    default:
                        query = query.Where(i => false); // No access by default for unrecognized roles
                        break;
                }

                var interviews = await query
                .Where(x => x.IsActive == true)
                    .AsNoTracking()
                    .ToListAsync();

                return interviews.Select(i => new InterviewListDto
                {
                    InterviewID = i.InterviewID,
                    InterviewEntryDate = i.InterviewEntryDate,
                    RecruiterName = i.Recruiter != null ? $"{i.Recruiter.FirstName} {i.Recruiter.LastName}" : null,
                    InterviewDate = i.InterviewDate,
                    InterviewStartTime = i.InterviewStartTime,
                    InterviewEndTime = i.InterviewEndTime,
                    ClientName = i.Client != null ? i.Client.ClientName : null,
                    InterviewType = i.InterviewType,
                    InterviewStatus = i.InterviewStatus,
                    CreatedDate = i.CreatedDate,
                    ModifiedDate = i.ModifiedDate,
                    EndClientName = i.EndClientName
                }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching all interviews for role {Role}", role);
                throw;
            }
        }

        public async Task<Interview?> GetInterviewByIdAsync(int id, string role, int employeeId, int? supervisorId)
        {
            _logger.LogInformation("Fetching interview by ID {Id} with role {Role} for employee {EmployeeId}", id, role, employeeId);
            try
            {
                IQueryable<Interview> query = _context.Interviews
                    .Include(i => i.Recruiter)
                    .Include(i => i.Client)
                    .Where(i => i.InterviewID == id);

                switch (role.ToLowerInvariant())
                {
                    case "admin":
                    case "recruiter":
                    case "senior_recruiter":
                        // No filtering for Admin, Recruiter, or Senior_Recruiter (all see all interviews)
                        break;

                    case "sales_executive":
                    case "resume_writer":
                    case "default":
                        // Others see no interviews
                        query = query.Where(i => false);
                        break;

                    default:
                        query = query.Where(i => false); // No access by default for unrecognized roles
                        break;
                }

                return await query.FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching interview with ID {Id}", id);
                throw;
            }
        }

        public async Task<Interview> GetInterviewByIdAsync(int id)
        {
            _logger.LogInformation("Fetching interview by ID {Id} without role filter", id);
            try
            {
                var interview = await _context.Interviews
                    .Include(i => i.Recruiter)
                    .Include(i => i.Client)
                    .FirstOrDefaultAsync(i => i.InterviewID == id);
                if (interview == null)
                {
                    _logger.LogWarning("Interview with ID {Id} not found", id);
                    throw new KeyNotFoundException($"Interview with ID {id} not found.");
                }
                return interview;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching interview with ID {Id}", id);
                throw;
            }
        }

        public async Task AddInterviewAsync(Interview interview)
        {
            _logger.LogInformation("Adding new interview with ID {InterviewID}", interview.InterviewID);
            try
            {
                _context.Interviews.Add(interview);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding interview with ID {InterviewID}", interview.InterviewID);
                throw;
            }
        }

        public async Task UpdateInterviewAsync(Interview interview)
        {
            _logger.LogInformation("Updating interview with ID {InterviewID}", interview.InterviewID);
            try
            {
                _context.Interviews.Update(interview);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating interview with ID {InterviewID}", interview.InterviewID);
                throw;
            }
        }

        public async Task InactivateInterviewAsync(Interview interview)
        {
            _logger.LogInformation("Deleting interview with ID {InterviewID}", interview.InterviewID);
            try
            {
                _context.Interviews.Update(interview);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting interview with ID {InterviewID}", interview.InterviewID);
                throw;
            }
        }
    }
}