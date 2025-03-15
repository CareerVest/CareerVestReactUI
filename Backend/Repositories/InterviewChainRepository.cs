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
    public class InterviewChainRepository : IInterviewChainRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<InterviewChainRepository> _logger;
        private readonly IAccessControlService _accessControlService;

        public InterviewChainRepository(
            ApplicationDbContext context,
            ILogger<InterviewChainRepository> logger,
            IAccessControlService accessControlService)
        {
            _context = context;
            _logger = logger;
            _accessControlService = accessControlService;
        }

        public async Task<List<InterviewChainListDto>> GetAllInterviewChainsAsync(string role, int employeeId, int? supervisorId)
        {
            var filter = _accessControlService.GetFilter<InterviewChain>(role, "InterviewChains", employeeId, supervisorId);

            var latestInterviewSubquery = _context.InterviewChain
                .Where(c => c.ParentInterviewChainID != null)
                .GroupBy(c => c.InterviewChainID)
                .Select(g => new
                {
                    RootInterviewChainID = g.Min(c => c.InterviewChainID),
                    LatestInterview = g.OrderByDescending(c => c.InterviewDate ?? c.InterviewEntryDate)
                                      .ThenByDescending(c => c.UpdatedTS)
                                      .FirstOrDefault()
                });

            var chains = await _context.InterviewChain
                .Include(c => c.Client)
                .Include(c => c.Recruiter)
                //.Where(filter) // Uncomment if filter is needed
                .Where(c => c.ParentInterviewChainID == null)
                .GroupJoin(
                    latestInterviewSubquery,
                    chain => chain.InterviewChainID,
                    sub => sub.RootInterviewChainID,
                    (chain, latest) => new { chain, latest = latest.FirstOrDefault() })
                .Select(cl => new InterviewChainListDto
                {
                    InterviewChainID = cl.chain.InterviewChainID,
                    ClientID = cl.chain.ClientID,
                    ClientName = cl.chain.Client != null ? cl.chain.Client.ClientName : null,
                    EndClientName = cl.chain.EndClientName,
                    Position = cl.chain.Position,
                    ChainStatus = cl.chain.ChainStatus,
                    Rounds = cl.chain.Rounds,
                    InterviewEntryDate = cl.chain.InterviewEntryDate,
                    RecruiterID = cl.chain.RecruiterID,
                    RecruiterName = cl.chain.Recruiter != null ? $"{cl.chain.Recruiter.FirstName} {cl.chain.Recruiter.LastName}" : null,
                    LatestInterviewDate = cl.latest != null
                        ? cl.latest.LatestInterview.InterviewDate ?? cl.latest.LatestInterview.InterviewEntryDate
                        : cl.chain.InterviewDate,
                    LatestInterviewStatus = cl.latest != null
                        ? cl.latest.LatestInterview.InterviewStatus
                        : cl.chain.InterviewStatus,
                    LatestInterviewType = cl.latest != null
                        ? cl.latest.LatestInterview.InterviewType
                        : cl.chain.InterviewType
                })
                .ToListAsync();

            return chains;
        }

        public async Task<InterviewChainDetailDto?> GetInterviewChainByIdAsync(int id, string role, int employeeId, int? supervisorId)
        {
            var filter = _accessControlService.GetFilter<InterviewChain>(role, "InterviewChains", employeeId, supervisorId);

            var allInterviews = await _context.InterviewChain
                .Include(c => c.Client)
                .Include(c => c.Recruiter)
                .Include(c => c.ChildInterviews)
                //.Where(filter) // Uncomment if filtering is needed
                .ToListAsync();

            var rootChain = allInterviews.FirstOrDefault(c => c.InterviewChainID == id && c.ParentInterviewChainID == null);
            if (rootChain == null) return null;

            var interviews = new List<InterviewDto>();
            var interviewMap = allInterviews.ToDictionary(c => c.InterviewChainID);

            void CollectInterviews(int chainId)
            {
                if (interviewMap.TryGetValue(chainId, out var chain))
                {
                    interviews.Add(MapToInterviewDto(chain));
                    foreach (var child in chain.ChildInterviews)
                    {
                        CollectInterviews(child.InterviewChainID);
                    }
                }
            }

            CollectInterviews(rootChain.InterviewChainID);

            return new InterviewChainDetailDto
            {
                InterviewChainID = rootChain.InterviewChainID,
                ParentInterviewChainID = rootChain.ParentInterviewChainID,
                ClientID = rootChain.ClientID,
                ClientName = rootChain.Client != null ? rootChain.Client.ClientName : null,
                EndClientName = rootChain.EndClientName,
                Position = rootChain.Position,
                ChainStatus = rootChain.ChainStatus,
                Rounds = rootChain.Rounds,
                InterviewEntryDate = rootChain.InterviewEntryDate,
                RecruiterID = rootChain.RecruiterID,
                RecruiterName = rootChain.Recruiter != null ? $"{rootChain.Recruiter.FirstName} {rootChain.Recruiter.LastName}" : null,
                Interviews = interviews
            };
        }

        public async Task AddInterviewChainAsync(InterviewChain chain)
        {
            _context.InterviewChain.Add(chain);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateInterviewChainAsync(InterviewChain chain)
        {
            _context.InterviewChain.Update(chain);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteInterviewChainAsync(int id, string azureUserId)
        {
            var chain = await _context.InterviewChain
                .Include(c => c.ChildInterviews)
                .FirstOrDefaultAsync(c => c.InterviewChainID == id);
            if (chain == null) return false;

            _context.InterviewChain.RemoveRange(chain.ChildInterviews);
            _context.InterviewChain.Remove(chain);
            await _context.SaveChangesAsync();
            return true;
        }

        private InterviewDto MapToInterviewDto(InterviewChain chain)
        {
            return new InterviewDto
            {
                InterviewChainID = chain.InterviewChainID,
                ParentInterviewChainID = chain.ParentInterviewChainID,
                ClientID = chain.ClientID,
                EndClientName = chain.EndClientName,
                Position = chain.Position,
                ChainStatus = chain.ChainStatus,
                Rounds = chain.Rounds,
                InterviewEntryDate = chain.InterviewEntryDate,
                RecruiterID = chain.RecruiterID,
                InterviewDate = chain.InterviewDate,
                InterviewStartTime = chain.InterviewStartTime,
                InterviewEndTime = chain.InterviewEndTime,
                InterviewMethod = chain.InterviewMethod,
                InterviewType = chain.InterviewType,
                InterviewStatus = chain.InterviewStatus,
                InterviewOutcome = chain.InterviewOutcome,
                InterviewSupport = chain.InterviewSupport, // Ensure this is mapped
                InterviewFeedback = chain.InterviewFeedback,
                Comments = chain.Comments,
                CreatedTS = chain.CreatedTS,
                UpdatedTS = chain.UpdatedTS,
                CreatedBy = chain.CreatedBy,
                UpdatedBy = chain.UpdatedBy
            };
        }
    }
}