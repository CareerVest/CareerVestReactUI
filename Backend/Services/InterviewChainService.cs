using Backend.Data;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class InterviewChainService : IInterviewChainService
    {
        private readonly IInterviewChainRepository _repository;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<InterviewChainService> _logger;

        public InterviewChainService(
            IInterviewChainRepository repository,
            ApplicationDbContext context,
            ILogger<InterviewChainService> logger)
        {
            _repository = repository;
            _context = context;
            _logger = logger;
        }

        public async Task<List<InterviewChainListDto>> GetInterviewChainsForUserAsync(string azureUserId, string role, int? supervisorId)
        {
            return await _repository.GetAllInterviewChainsAsync(role, await GetEmployeeIdAsync(azureUserId), supervisorId);
        }

        public async Task<InterviewChainDetailDto?> GetInterviewChainByIdForUserAsync(int id, string azureUserId, string role, int? supervisorId)
        {
            return await _repository.GetInterviewChainByIdAsync(id, role, await GetEmployeeIdAsync(azureUserId), supervisorId);
        }

        public async Task<int> CreateInterviewChainAsync(InterviewChainCreateDto dto, string azureUserId)
        {
            var chain = new InterviewChain
            {
                ClientID = dto.ClientID,
                EndClientName = dto.EndClientName,
                Position = dto.Position,
                RecruiterID = dto.RecruiterID,
                InterviewEntryDate = dto.InterviewEntryDate,
                InterviewDate = dto.InterviewDate,
                InterviewStartTime = dto.InterviewStartTime,
                InterviewEndTime = dto.InterviewEndTime,
                InterviewMethod = dto.InterviewMethod,
                InterviewType = dto.InterviewType,
                InterviewStatus = dto.InterviewStatus,
                ChainStatus = "Active",
                Rounds = 1,
                Comments = dto.Comments,
                CreatedBy = azureUserId,
                UpdatedBy = azureUserId
            };

            await _repository.AddInterviewChainAsync(chain);
            return chain.InterviewChainID;
        }

        public async Task UpdateInterviewChainAsync(int id, InterviewChainUpdateDto dto, string azureUserId)
        {
            var chain = await _context.InterviewChain
                .Include(c => c.ChildInterviews)
                .FirstOrDefaultAsync(c => c.InterviewChainID == id);
            if (chain == null) throw new KeyNotFoundException("Interview chain not found.");

            // Update chain-level fields
            if (dto.ChainStatus != null)
            {
                chain.ChainStatus = dto.ChainStatus;
                if (dto.ChainStatus == "Active" && chain.InterviewOutcome != null)
                {
                    chain.InterviewStatus = "Scheduled";
                    chain.InterviewOutcome = null;
                }
            }

            // Update interview-level fields
            chain.InterviewDate = dto.InterviewDate ?? chain.InterviewDate;
            chain.InterviewStartTime = dto.InterviewStartTime ?? chain.InterviewStartTime;
            chain.InterviewEndTime = dto.InterviewEndTime ?? chain.InterviewEndTime;
            chain.InterviewMethod = dto.InterviewMethod ?? chain.InterviewMethod;
            chain.InterviewType = dto.InterviewType ?? chain.InterviewType;
            chain.InterviewStatus = dto.InterviewStatus ?? chain.InterviewStatus;
            chain.InterviewOutcome = dto.InterviewOutcome ?? chain.InterviewOutcome;
            chain.InterviewFeedback = dto.InterviewFeedback ?? chain.InterviewFeedback;
            chain.Comments = dto.Comments ?? chain.Comments;
            chain.UpdatedTS = DateTime.UtcNow;
            chain.UpdatedBy = azureUserId;

            // If InterviewStatus is set to "Scheduled", ensure InterviewOutcome is null
            if (chain.InterviewStatus == "Scheduled")
            {
                chain.InterviewOutcome = null;
            }

            await _repository.UpdateInterviewChainAsync(chain);
        }

        public async Task<bool> AddInterviewToChainAsync(InterviewChainAddDto dto, string azureUserId)
        {
            var parentChain = await _context.InterviewChain
                .FirstOrDefaultAsync(c => c.InterviewChainID == dto.InterviewChainID);
            if (parentChain == null) return false;

            var newInterview = new InterviewChain
            {
                ParentInterviewChainID = dto.InterviewChainID,
                ClientID = parentChain.ClientID,
                EndClientName = parentChain.EndClientName,
                Position = parentChain.Position,
                RecruiterID = parentChain.RecruiterID,
                InterviewEntryDate = DateTime.UtcNow,
                InterviewDate = dto.InterviewDate,
                InterviewStartTime = dto.InterviewStartTime,
                InterviewEndTime = dto.InterviewEndTime,
                InterviewMethod = dto.InterviewMethod,
                InterviewType = dto.InterviewType,
                InterviewStatus = dto.InterviewStatus,
                ChainStatus = "Active",
                Rounds = parentChain.Rounds + 1,
                Comments = dto.Comments,
                CreatedBy = azureUserId,
                UpdatedBy = azureUserId
            };

            parentChain.Rounds++;
            parentChain.InterviewStatus = "Completed";
            parentChain.InterviewOutcome = "Next";
            await _repository.UpdateInterviewChainAsync(parentChain);
            await _repository.AddInterviewChainAsync(newInterview);
            return true;
        }

        public async Task EndInterviewAsync(int id, InterviewChainEndDto dto, string azureUserId)
        {
            var chain = await _context.InterviewChain
                .Include(c => c.ChildInterviews)
                .FirstOrDefaultAsync(c => c.InterviewChainID == id);
            if (chain == null) throw new KeyNotFoundException("Interview chain not found.");

            // Update the current chain's details
            chain.InterviewStatus = "Completed";
            chain.InterviewOutcome = dto.InterviewOutcome;
            chain.InterviewFeedback = dto.InterviewFeedback ?? chain.InterviewFeedback;
            chain.Comments = dto.Comments ?? chain.Comments;
            chain.UpdatedTS = DateTime.UtcNow;
            chain.UpdatedBy = azureUserId;

            // Handle the chain status based on the outcome
            switch (dto.InterviewOutcome)
            {
                case "Offer":
                    // Find the root parent chain and update its status to "Successful"
                    var offerRootChain = await GetRootParentChainAsync(chain);
                    if (offerRootChain != null)
                    {
                        offerRootChain.ChainStatus = "Successful";
                        offerRootChain.UpdatedTS = DateTime.UtcNow;
                        offerRootChain.UpdatedBy = azureUserId;
                        await _repository.UpdateInterviewChainAsync(offerRootChain);
                    }
                    break;
                case "Rejected":
                    var rejectedRootChain = await GetRootParentChainAsync(chain);
                    if (rejectedRootChain != null)
                    {
                        rejectedRootChain.ChainStatus = "Unsuccessful";
                        rejectedRootChain.UpdatedTS = DateTime.UtcNow;
                        rejectedRootChain.UpdatedBy = azureUserId;
                        await _repository.UpdateInterviewChainAsync(rejectedRootChain);
                    }
                    break;
                case "Next":
                    chain.ChainStatus = "Active";
                    await _repository.UpdateInterviewChainAsync(chain);
                    break;
                case "AddNew":
                    chain.ChainStatus = "Active";
                    await AddInterviewToChainAsync(new InterviewChainAddDto
                    {
                        InterviewChainID = id,
                        InterviewDate = null,
                        InterviewStartTime = null,
                        InterviewEndTime = null,
                        InterviewMethod = null,
                        InterviewType = null,
                        InterviewStatus = "Scheduled",
                        Comments = dto.Comments
                    }, azureUserId);
                    await _repository.UpdateInterviewChainAsync(chain);
                    break;
            }

            // Update the current chain unless it's already updated via AddNew
            if (dto.InterviewOutcome != "Offer" && dto.InterviewOutcome != "AddNew")
            {
                await _repository.UpdateInterviewChainAsync(chain);
            }
        }

        // Helper method to find the root parent chain
        private async Task<InterviewChain> GetRootParentChainAsync(InterviewChain chain)
        {
            var currentChain = chain;
            while (currentChain.ParentInterviewChainID.HasValue)
            {
                currentChain = await _context.InterviewChain
                    .FirstOrDefaultAsync(c => c.InterviewChainID == currentChain.ParentInterviewChainID.Value);
                if (currentChain == null)
                {
                    throw new KeyNotFoundException("Parent chain not found in hierarchy.");
                }
            }
            return currentChain;
        }

        public async Task<bool> DeleteInterviewChainAsync(int id, string azureUserId)
        {
            return await _repository.DeleteInterviewChainAsync(id, azureUserId);
        }

        private async Task<int> GetEmployeeIdAsync(string azureUserId)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.EmployeeReferenceID == azureUserId);
            return employee?.EmployeeID ?? throw new InvalidOperationException("User not found.");
        }
    }
}