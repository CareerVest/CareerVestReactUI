using Backend.Data;
using Backend.Dtos;
using Backend.Models;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Repositories
{
    public class ClientRepository : IClientRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ClientRepository> _logger;
        private readonly IAccessControlService _accessControlService;

        public ClientRepository(ApplicationDbContext context, ILogger<ClientRepository> logger, IAccessControlService accessControlService)
        {
            _context = context;
            _logger = logger;
            _accessControlService = accessControlService;
        }

        /// ✅ Fetch all clients with role-based filtering
        public async Task<IEnumerable<ClientListDto>> GetAllClientsAsync(string role, int employeeId, int? supervisorId)
        {
            var filter = _accessControlService.GetFilter<Client>(role, "Clients", employeeId, supervisorId);
            return await _context.Clients
                .Include(c => c.AssignedRecruiter)
                .ThenInclude(r => r.Supervisor)
                .AsNoTracking()
                .Where(filter)
                .Select(c => new ClientListDto
                {
                    ClientID = c.ClientID,
                    ClientName = c.ClientName,
                    EnrollmentDate = c.EnrollmentDate,
                    TechStack = c.TechStack,
                    ClientStatus = c.ClientStatus,
                    AssignedRecruiterID = c.AssignedRecruiterID,
                    AssignedRecruiterName = c.AssignedRecruiter != null
                        ? $"{c.AssignedRecruiter.FirstName} {c.AssignedRecruiter.LastName}"
                        : "Unassigned",
                    TotalDue = c.TotalDue,
                    TotalPaid = c.TotalPaid
                })
                .ToListAsync();
        }

        /// ✅ Fetch a specific client by ID with role-based filtering
        public async Task<ClientDetailDto?> GetClientByIdAsync(int clientId, string role, int employeeId, int? supervisorId)
        {
            var filter = _accessControlService.GetFilter<Client>(role, "Clients", employeeId, supervisorId);
            return await _context.Clients
                .Include(c => c.AssignedRecruiter)
                .Include(c => c.SubscriptionPlan)
                .Include(c => c.PostPlacementPlan)
                .Include(c => c.PaymentSchedules)
                .Where(filter)
                .Where(c => c.ClientID == clientId)
                .Select(c => new ClientDetailDto
                {
                    ClientID = c.ClientID,
                    ClientName = c.ClientName,
                    EnrollmentDate = c.EnrollmentDate,
                    TechStack = c.TechStack,
                    VisaStatus = c.VisaStatus,
                    PersonalPhoneNumber = c.PersonalPhoneNumber,
                    PersonalEmailAddress = c.PersonalEmailAddress,
                    LinkedInURL = c.LinkedInURL,
                    MarketingStartDate = c.MarketingStartDate,
                    MarketingEndDate = c.MarketingEndDate,
                    MarketingEmailID = c.MarketingEmailID,
                    AssignedRecruiterID = c.AssignedRecruiterID,
    AssignedRecruiterName = c.AssignedRecruiter != null
                        ? $"{c.AssignedRecruiter.FirstName} {c.AssignedRecruiter.LastName}"
                        : "Unassigned",
                    ClientStatus = c.ClientStatus,
                    PlacedDate = c.PlacedDate,
                    BackedOutDate = c.BackedOutDate,
                    BackedOutReason = c.BackedOutReason,
                    SubscriptionPlanID = c.SubscriptionPlanID,
                    SubscriptionPlanName = c.SubscriptionPlan.PlanName,
                    ServiceAgreementUrl = c.SubscriptionPlan.ServiceAgreementURL,
                    TotalDue = c.TotalDue,
                    TotalPaid = c.TotalPaid,
                    PostPlacementPlanID = c.PostPlacementPlanID,
                    PostPlacementPlanName = c.PostPlacementPlan.PlanName,
                    PromissoryNoteUrl = c.PostPlacementPlan.PromissoryNoteURL,
                    PaymentSchedules = c.PaymentSchedules
                        .Select(ps => new PaymentScheduleDto
                        {
                            PaymentDate = ps.PaymentDate,
                            Amount = ps.Amount,
                            IsPaid = ps.IsPaid,
                            PaymentType = ps.PaymentType
                        }).ToList()
                })
                .FirstOrDefaultAsync();
        }

        /// ✅ Update a client (Only authorized roles should access this via service layer)
        public async Task UpdateClientAsync(Client client)
        {
            _context.Clients.Update(client);
            await _context.SaveChangesAsync();
        }

        /// ✅ Retrieve Service Agreement or Promissory Note file URL
        public async Task<string?> GetClientFileUrlAsync(int clientId, string fileType)
        {
            var client = await _context.Clients
                .Include(c => c.SubscriptionPlan)
                .Include(c => c.PostPlacementPlan)
                .FirstOrDefaultAsync(c => c.ClientID == clientId);

            if (client == null)
            {
                _logger.LogWarning($"Client not found. ClientID: {clientId}");
                return null;
            }

            return fileType == "ServiceAgreement"
                ? client.SubscriptionPlan?.ServiceAgreementURL
                : client.PostPlacementPlan?.PromissoryNoteURL;
        }
    }
}