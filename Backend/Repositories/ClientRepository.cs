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
                    ClientStatus = c.ClientStatus, // Include the status in the DTO
                    AssignedRecruiterID = c.AssignedRecruiterID,
                    AssignedRecruiterName = c.AssignedRecruiter != null
                        ? $"{c.AssignedRecruiter.FirstName} {c.AssignedRecruiter.LastName}"
                        : "Unassigned",
                    TotalDue = c.TotalDue,
                    TotalPaid = c.TotalPaid
                })
                .ToListAsync();
        }

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
                    MarketingEmailPassword = null, // Excluded for security
                    AssignedRecruiterID = c.AssignedRecruiterID,
                    AssignedRecruiterName = c.AssignedRecruiter != null
                        ? $"{c.AssignedRecruiter.FirstName} {c.AssignedRecruiter.LastName}"
                        : "Unassigned",
                    ClientStatus = c.ClientStatus, // Include the status in the DTO
                    PlacedDate = c.PlacedDate,
                    BackedOutDate = c.BackedOutDate,
                    BackedOutReason = c.BackedOutReason,
                    SubscriptionPlanID = c.SubscriptionPlanID,
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
                        }).ToList(),
                    //InactivatedDate = c.InactivatedDate // Include inactivated date if applicable
                })
                .FirstOrDefaultAsync();
        }

        public async Task<List<Client>> GetClientsByRecruiterIdAsync(int recruiterId, string role, int employeeId, int? supervisorId)
        {
            _logger.LogInformation($"Fetching clients assigned to recruiter {recruiterId} for user with role {role} and employee ID {employeeId}.");

            try
            {
                // Apply role-based filter using AccessControlService
                var filter = _accessControlService.GetFilter<Client>(role, "Clients", employeeId, supervisorId);

                // Ensure the recruiterId matches the filter criteria for the current user's role
                var query = _context.Clients
                    .Include(c => c.AssignedRecruiter)
                    .ThenInclude(r => r.Supervisor)
                    .AsNoTracking()
                    .Where(c => c.AssignedRecruiterID == recruiterId);

                // Apply the role-based filter
                query = query.Where(filter);

                // Return List<Client> directly from the database
                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching clients for recruiter {recruiterId} with role {role} and employee ID {employeeId}.");
                throw;
            }
        }

        public async Task<Client> AddClientAsync(Client client)
        {
            _context.Clients.Add(client);
            await _context.SaveChangesAsync();
            return client;
        }

        public async Task UpdateClientAsync(Client client)
        {
            _context.Clients.Update(client);
            await _context.SaveChangesAsync();
        }

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

            // Allow access to files even for inactive clients, but log the status
            if (client.ClientStatus == "Inactive")
            {
                _logger.LogInformation($"Accessing file for inactive client {clientId}. FileType: {fileType}");
            }

            return fileType == "ServiceAgreement"
                ? client.SubscriptionPlan?.ServiceAgreementURL
                : client.PostPlacementPlan?.PromissoryNoteURL;
        }

        public async Task<bool> InactivateClientAsync(int clientId, string azureUserId)
        {
            var client = await _context.Clients
                .Include(c => c.AssignedRecruiter)
                .FirstOrDefaultAsync(c => c.ClientID == clientId);

            if (client == null)
            {
                _logger.LogWarning($"Client {clientId} not found for inactivation by user {azureUserId}.");
                return false;
            }

            // Reassign client to supervisor if they have an assigned recruiter
            if (client.AssignedRecruiterID.HasValue)
            {
                var recruiter = await _context.Employees
                    .FirstOrDefaultAsync(e => e.EmployeeID == client.AssignedRecruiterID.Value);
                if (recruiter != null && recruiter.SupervisorID.HasValue)
                {
                    client.AssignedRecruiterID = recruiter.SupervisorID; // Reassign to supervisor
                    _logger.LogInformation($"Reassigned client {clientId} from recruiter {recruiter.EmployeeID} to supervisor {recruiter.SupervisorID} for user {azureUserId}.");
                }
                else
                {
                    _logger.LogWarning($"No supervisor found for recruiter of client {clientId} by user {azureUserId}.");
                    return false;
                }
            }

            // Mark client as Inactive and set InactivatedDate
            client.ClientStatus = "Inactive";
            //client.InactivatedDate = DateTime.UtcNow; // Assuming InactivatedDate exists in the Client model
            _context.Clients.Update(client);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Client {clientId} marked as inactive by user {azureUserId}.");
            return true;
        }
    }
}