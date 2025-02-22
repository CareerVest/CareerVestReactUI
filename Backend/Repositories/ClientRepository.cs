using Backend.Data;
using Backend.Dtos;
using Backend.Models;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
<<<<<<< HEAD
using System;
=======
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
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

<<<<<<< HEAD
=======
        /// ✅ Fetch all clients with role-based filtering
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
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

<<<<<<< HEAD
=======
        /// ✅ Fetch a specific client by ID with role-based filtering
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
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
<<<<<<< HEAD
                    MarketingEmailPassword = null, // Excluded for security
                    AssignedRecruiterID = c.AssignedRecruiterID,
                    AssignedRecruiterName = c.AssignedRecruiter != null
=======
                    AssignedRecruiterID = c.AssignedRecruiterID,
    AssignedRecruiterName = c.AssignedRecruiter != null
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
                        ? $"{c.AssignedRecruiter.FirstName} {c.AssignedRecruiter.LastName}"
                        : "Unassigned",
                    ClientStatus = c.ClientStatus,
                    PlacedDate = c.PlacedDate,
                    BackedOutDate = c.BackedOutDate,
                    BackedOutReason = c.BackedOutReason,
                    SubscriptionPlanID = c.SubscriptionPlanID,
<<<<<<< HEAD
                    SubscriptionPlanName = c.SubscriptionPlan != null ? c.SubscriptionPlan.PlanName : null,
                    ServiceAgreementUrl = c.SubscriptionPlan != null ? c.SubscriptionPlan.ServiceAgreementURL : null,
                    TotalDue = c.TotalDue,
                    TotalPaid = c.TotalPaid,
                    PostPlacementPlanID = c.PostPlacementPlanID,
                    PostPlacementPlanName = c.PostPlacementPlan != null ? c.PostPlacementPlan.PlanName : null,
                    PromissoryNoteUrl = c.PostPlacementPlan != null ? c.PostPlacementPlan.PromissoryNoteURL : null,
                    SubscriptionPlan = c.SubscriptionPlan != null
                        ? new SubscriptionPlanDto
                        {
                            SubscriptionPlanID = c.SubscriptionPlan.SubscriptionPlanID,
                            PlanName = c.SubscriptionPlan.PlanName,
                            ServiceAgreementUrl = c.SubscriptionPlan.ServiceAgreementURL,
                            SubscriptionPlanPaymentStartDate = c.SubscriptionPlan.SubscriptionPlanPaymentStartDate,
                            TotalSubscriptionAmount = c.SubscriptionPlan.TotalSubscriptionAmount,
                            CreatedTS = c.SubscriptionPlan.CreatedTS,
                            CreatedBy = c.SubscriptionPlan.CreatedBy,
                            UpdatedTS = c.SubscriptionPlan.UpdatedTS,
                            UpdatedBy = c.SubscriptionPlan.UpdatedBy
                        }
                        : null,
                    PostPlacementPlan = c.PostPlacementPlan != null
                        ? new PostPlacementPlanDto
                        {
                            PostPlacementPlanID = c.PostPlacementPlan.PostPlacementPlanID,
                            PlanName = c.PostPlacementPlan.PlanName,
                            PromissoryNoteUrl = c.PostPlacementPlan.PromissoryNoteURL,
                            PostPlacementPlanPaymentStartDate = c.PostPlacementPlan.PostPlacementPaymentStartDate,
                            TotalPostPlacementAmount = c.PostPlacementPlan.TotalPostPlacementAmount,
                            CreatedTS = c.PostPlacementPlan.CreatedTS,
                            CreatedBy = c.PostPlacementPlan.CreatedBy,
                            UpdatedTS = c.PostPlacementPlan.UpdatedTS,
                            UpdatedBy = c.PostPlacementPlan.UpdatedBy
                        }
                        : null,
                    PaymentSchedules = c.PaymentSchedules
                        .Select(ps => new PaymentScheduleDto
                        {
                            PaymentScheduleID = ps.PaymentScheduleID,
                            ClientID = ps.ClientID,
                            PaymentDate = ps.PaymentDate,
                            Amount = (double)ps.Amount,
                            IsPaid = ps.IsPaid,
                            PaymentType = ps.PaymentType,
                            SubscriptionPlanID = ps.SubscriptionPlanID,
                            PostPlacementPlanID = ps.PostPlacementPlanID,
                            CreatedTS = ps.CreatedTS,
                            CreatedBy = ps.CreatedBy,
                            UpdatedTS = ps.UpdatedTS,
                            UpdatedBy = ps.UpdatedBy
=======
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
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
                        }).ToList()
                })
                .FirstOrDefaultAsync();
        }

<<<<<<< HEAD
        public async Task<Client> AddClientAsync(Client client)
        {
            _context.Clients.Add(client);
            await _context.SaveChangesAsync();
            return client;
        }

=======
        /// ✅ Update a client (Only authorized roles should access this via service layer)
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
        public async Task UpdateClientAsync(Client client)
        {
            _context.Clients.Update(client);
            await _context.SaveChangesAsync();
        }

<<<<<<< HEAD
=======
        /// ✅ Retrieve Service Agreement or Promissory Note file URL
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
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