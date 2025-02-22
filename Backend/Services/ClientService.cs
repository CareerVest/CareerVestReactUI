using Backend.Dtos;
<<<<<<< HEAD
=======
using Backend.Models;
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
using Backend.Repositories;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Backend.Data;
<<<<<<< HEAD
using Microsoft.Graph;
using Backend.Models;
using System;
using System.Linq;
=======
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)

namespace Backend.Services
{
    public class ClientService : IClientService
    {
        private readonly IClientRepository _clientRepository;
        private readonly ILogger<ClientService> _logger;
<<<<<<< HEAD
        private readonly ApplicationDbContext _context;
        private readonly GraphServiceClient _graphClient;
        private readonly IConfiguration _configuration;

        public ClientService(
            IClientRepository clientRepository,
            ILogger<ClientService> logger,
            ApplicationDbContext context,
            GraphServiceClient graphClient,
            IConfiguration configuration)
=======
        private readonly ApplicationDbContext _context; // Assuming this is injected

        public ClientService(IClientRepository clientRepository, ILogger<ClientService> logger, ApplicationDbContext context)
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
        {
            _clientRepository = clientRepository;
            _logger = logger;
            _context = context;
<<<<<<< HEAD
            _graphClient = graphClient;
            _configuration = configuration;
        }

=======
        }

        /// ✅ Get Clients Based on User Role (Filters Applied in Repository)
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
        public async Task<IEnumerable<ClientListDto>> GetClientsForUserAsync(string azureUserId, string role, int? supervisorId)
        {
            int employeeId = await MapAzureUserIdToEmployeeId(azureUserId);
            return await _clientRepository.GetAllClientsAsync(role, employeeId, supervisorId);
        }

<<<<<<< HEAD
=======
        /// ✅ Securely Fetch a Client Based on User Role (Filters Applied in Repository)
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
        public async Task<ClientDetailDto?> GetClientByIdForUserAsync(int clientId, string azureUserId, string role, int? supervisorId)
        {
            int employeeId = await MapAzureUserIdToEmployeeId(azureUserId);
            return await _clientRepository.GetClientByIdAsync(clientId, role, employeeId, supervisorId);
        }

<<<<<<< HEAD
        public async Task<bool> CreateClientAsync(ClientCreateDto clientDto, string azureUserId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var client = MapToClient(clientDto);
                client.CreatedTS = DateTime.UtcNow;
                client.CreatedBy = azureUserId;
                client.UpdatedTS = DateTime.UtcNow;
                client.UpdatedBy = azureUserId;

                // Handle Subscription Plan
                if (clientDto.SubscriptionPlan != null &&
                    (!string.IsNullOrEmpty(clientDto.SubscriptionPlan.PlanName) ||
                     clientDto.SubscriptionPlan.SubscriptionPlanPaymentStartDate.HasValue ||
                     clientDto.SubscriptionPlan.TotalSubscriptionAmount.HasValue))
                {
                    var subscriptionPlan = new SubscriptionPlan
                    {
                        PlanName = clientDto.SubscriptionPlan.PlanName,
                        ServiceAgreementURL = clientDto.SubscriptionPlan.ServiceAgreementUrl,
                        SubscriptionPlanPaymentStartDate = clientDto.SubscriptionPlan.SubscriptionPlanPaymentStartDate,
                        TotalSubscriptionAmount = (decimal?)clientDto.SubscriptionPlan.TotalSubscriptionAmount ?? 0,
                        CreatedTS = clientDto.SubscriptionPlan.CreatedTS ?? DateTime.UtcNow,
                        CreatedBy = clientDto.SubscriptionPlan.CreatedBy ?? azureUserId,
                        UpdatedTS = clientDto.SubscriptionPlan.UpdatedTS ?? DateTime.UtcNow,
                        UpdatedBy = clientDto.SubscriptionPlan.UpdatedBy ?? azureUserId
                    };
                    _context.SubscriptionPlan.Add(subscriptionPlan);
                    await _context.SaveChangesAsync();
                    client.SubscriptionPlanID = subscriptionPlan.SubscriptionPlanID;

                    if (clientDto.ServiceAgreement != null && clientDto.ServiceAgreement.Length > 0)
                    {
                        var fileName = $"{client.ClientName}_ServiceAgreement_Signed_{DateTime.UtcNow:yyyyMMddHHmmss}{Path.GetExtension(clientDto.ServiceAgreement.FileName)}";
                        subscriptionPlan.ServiceAgreementURL = await UploadFileToSharePoint(clientDto.ServiceAgreement, fileName, client.ClientName);
                        _context.Entry(subscriptionPlan).State = EntityState.Modified;
                    }
                }

                // Handle Post-Placement Plan
                if (clientDto.PostPlacementPlan != null &&
                    (!string.IsNullOrEmpty(clientDto.PostPlacementPlan.PlanName) ||
                     clientDto.PostPlacementPlan.PostPlacementPlanPaymentStartDate.HasValue ||
                     clientDto.PostPlacementPlan.TotalPostPlacementAmount.HasValue))
                {
                    var postPlacementPlan = new PostPlacementPlan
                    {
                        PlanName = clientDto.PostPlacementPlan.PlanName,
                        PromissoryNoteURL = clientDto.PostPlacementPlan.PromissoryNoteUrl,
                        PostPlacementPaymentStartDate = clientDto.PostPlacementPlan.PostPlacementPlanPaymentStartDate,
                        TotalPostPlacementAmount = (decimal?)clientDto.PostPlacementPlan.TotalPostPlacementAmount ?? 0,
                        CreatedTS = clientDto.PostPlacementPlan.CreatedTS ?? DateTime.UtcNow,
                        CreatedBy = clientDto.PostPlacementPlan.CreatedBy ?? azureUserId,
                        UpdatedTS = clientDto.PostPlacementPlan.UpdatedTS ?? DateTime.UtcNow,
                        UpdatedBy = clientDto.PostPlacementPlan.UpdatedBy ?? azureUserId
                    };
                    _context.PostPlacementPlan.Add(postPlacementPlan);
                    await _context.SaveChangesAsync();
                    client.PostPlacementPlanID = postPlacementPlan.PostPlacementPlanID;

                    if (clientDto.PromissoryNote != null && clientDto.PromissoryNote.Length > 0)
                    {
                        var fileName = $"{client.ClientName}_PromissoryNote_Signed_{DateTime.UtcNow:yyyyMMddHHmmss}{Path.GetExtension(clientDto.PromissoryNote.FileName)}";
                        postPlacementPlan.PromissoryNoteURL = await UploadFileToSharePoint(clientDto.PromissoryNote, fileName, client.ClientName);
                        _context.Entry(postPlacementPlan).State = EntityState.Modified;
                    }
                }

                // Add Client via Repository
                client = await _clientRepository.AddClientAsync(client);

                // Handle Payment Schedules
                if (clientDto.PaymentSchedules != null && clientDto.PaymentSchedules.Any(ps => ps.PaymentDate.HasValue && ps.Amount > 0))
                {
                    foreach (var psDto in clientDto.PaymentSchedules.Where(ps => ps.PaymentDate.HasValue && ps.Amount > 0))
                    {
                        var ps = new PaymentSchedule
                        {
                            ClientID = client.ClientID,
                            PaymentDate = psDto.PaymentDate.Value,
                            Amount = (decimal)psDto.Amount,
                            IsPaid = psDto.IsPaid,
                            PaymentType = psDto.PaymentType,
                            SubscriptionPlanID = psDto.PaymentType == "Subscription" ? client.SubscriptionPlanID : null,
                            PostPlacementPlanID = psDto.PaymentType == "PostPlacement" ? client.PostPlacementPlanID : null,
                            CreatedTS = psDto.CreatedTS ?? DateTime.UtcNow,
                            CreatedBy = psDto.CreatedBy ?? azureUserId,
                            UpdatedTS = psDto.UpdatedTS ?? DateTime.UtcNow,
                            UpdatedBy = psDto.UpdatedBy ?? azureUserId
                        };
                        _context.PaymentSchedules.Add(ps);
                    }
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();
                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Failed to create client for user {AzureUserId}", azureUserId);
                throw;
            }
        }

        public async Task EditClientAsync(int id, ClientUpdateDto clientDto, string azureUserId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var existingClient = await _context.Clients
                    .Include(c => c.SubscriptionPlan)
                    .Include(c => c.PostPlacementPlan)
                    .Include(c => c.PaymentSchedules)
                    .FirstOrDefaultAsync(c => c.ClientID == id);

                if (existingClient == null)
                {
                    throw new KeyNotFoundException("Client not found.");
                }

                // Capture original client name before mapping new data
                var originalClientName = existingClient.ClientName;

                // Update Client Details
                MapToClient(clientDto, existingClient);
                existingClient.UpdatedTS = DateTime.UtcNow;
                existingClient.UpdatedBy = azureUserId;

                // Handle Subscription Plan
                if (clientDto.SubscriptionPlan != null)
                {
                    if (existingClient.SubscriptionPlan != null)
                    {
                        var existingPlan = await _context.SubscriptionPlan.AsNoTracking().FirstOrDefaultAsync(p => p.SubscriptionPlanID == existingClient.SubscriptionPlanID);
                        existingClient.SubscriptionPlan.PlanName = clientDto.SubscriptionPlan.PlanName ?? existingPlan?.PlanName;
                        existingClient.SubscriptionPlan.ServiceAgreementURL = clientDto.SubscriptionPlan.ServiceAgreementUrl ?? existingPlan?.ServiceAgreementURL;
                        existingClient.SubscriptionPlan.SubscriptionPlanPaymentStartDate = clientDto.SubscriptionPlan.SubscriptionPlanPaymentStartDate ?? existingPlan?.SubscriptionPlanPaymentStartDate;
                        existingClient.SubscriptionPlan.TotalSubscriptionAmount = (decimal?)clientDto.SubscriptionPlan.TotalSubscriptionAmount ?? existingPlan?.TotalSubscriptionAmount;
                        existingClient.SubscriptionPlan.UpdatedTS = clientDto.SubscriptionPlan.UpdatedTS ?? DateTime.UtcNow;
                        existingClient.SubscriptionPlan.UpdatedBy = clientDto.SubscriptionPlan.UpdatedBy ?? azureUserId;
                        if (clientDto.ServiceAgreement != null && clientDto.ServiceAgreement.Length > 0)
                        {
                            var fileName = $"{existingClient.ClientName}_ServiceAgreement_Signed_{DateTime.UtcNow:yyyyMMddHHmmss}{Path.GetExtension(clientDto.ServiceAgreement.FileName)}";
                            existingClient.SubscriptionPlan.ServiceAgreementURL = await UploadFileToSharePoint(clientDto.ServiceAgreement, fileName, existingClient.ClientName);
                        }
                        _context.Entry(existingClient.SubscriptionPlan).State = EntityState.Modified;
                    }
                    else
                    {
                        var subscriptionPlan = new SubscriptionPlan
                        {
                            PlanName = clientDto.SubscriptionPlan.PlanName,
                            ServiceAgreementURL = clientDto.SubscriptionPlan.ServiceAgreementUrl,
                            SubscriptionPlanPaymentStartDate = clientDto.SubscriptionPlan.SubscriptionPlanPaymentStartDate,
                            TotalSubscriptionAmount = (decimal?)clientDto.SubscriptionPlan.TotalSubscriptionAmount ?? 0,
                            CreatedTS = clientDto.SubscriptionPlan.CreatedTS ?? DateTime.UtcNow,
                            CreatedBy = clientDto.SubscriptionPlan.CreatedBy ?? azureUserId,
                            UpdatedTS = clientDto.SubscriptionPlan.UpdatedTS ?? DateTime.UtcNow,
                            UpdatedBy = clientDto.SubscriptionPlan.UpdatedBy ?? azureUserId
                        };
                        if (clientDto.ServiceAgreement != null && clientDto.ServiceAgreement.Length > 0)
                        {
                            var fileName = $"{existingClient.ClientName}_ServiceAgreement_Signed_{DateTime.UtcNow:yyyyMMddHHmmss}{Path.GetExtension(clientDto.ServiceAgreement.FileName)}";
                            subscriptionPlan.ServiceAgreementURL = await UploadFileToSharePoint(clientDto.ServiceAgreement, fileName, existingClient.ClientName);
                        }
                        _context.SubscriptionPlan.Add(subscriptionPlan);
                        await _context.SaveChangesAsync();
                        existingClient.SubscriptionPlanID = subscriptionPlan.SubscriptionPlanID;
                    }
                }

                // Handle Post-Placement Plan
                if (clientDto.PostPlacementPlan != null)
                {
                    if (existingClient.PostPlacementPlan != null)
                    {
                        var existingPostPlan = await _context.PostPlacementPlan.AsNoTracking().FirstOrDefaultAsync(p => p.PostPlacementPlanID == existingClient.PostPlacementPlanID);
                        existingClient.PostPlacementPlan.PlanName = clientDto.PostPlacementPlan.PlanName ?? existingPostPlan?.PlanName;
                        existingClient.PostPlacementPlan.PromissoryNoteURL = clientDto.PostPlacementPlan.PromissoryNoteUrl ?? existingPostPlan?.PromissoryNoteURL;
                        existingClient.PostPlacementPlan.PostPlacementPaymentStartDate = clientDto.PostPlacementPlan.PostPlacementPlanPaymentStartDate ?? existingPostPlan?.PostPlacementPaymentStartDate;
                        existingClient.PostPlacementPlan.TotalPostPlacementAmount = (decimal?)clientDto.PostPlacementPlan.TotalPostPlacementAmount ?? existingPostPlan?.TotalPostPlacementAmount;
                        existingClient.PostPlacementPlan.UpdatedTS = clientDto.PostPlacementPlan.UpdatedTS ?? DateTime.UtcNow;
                        existingClient.PostPlacementPlan.UpdatedBy = clientDto.PostPlacementPlan.UpdatedBy ?? azureUserId;
                        if (clientDto.PromissoryNote != null && clientDto.PromissoryNote.Length > 0)
                        {
                            var fileName = $"{existingClient.ClientName}_PromissoryNote_Signed_{DateTime.UtcNow:yyyyMMddHHmmss}{Path.GetExtension(clientDto.PromissoryNote.FileName)}";
                            existingClient.PostPlacementPlan.PromissoryNoteURL = await UploadFileToSharePoint(clientDto.PromissoryNote, fileName, existingClient.ClientName);
                        }
                        _context.Entry(existingClient.PostPlacementPlan).State = EntityState.Modified;
                    }
                    else
                    {
                        var postPlacementPlan = new PostPlacementPlan
                        {
                            PlanName = clientDto.PostPlacementPlan.PlanName,
                            PromissoryNoteURL = clientDto.PostPlacementPlan.PromissoryNoteUrl,
                            PostPlacementPaymentStartDate = clientDto.PostPlacementPlan.PostPlacementPlanPaymentStartDate,
                            TotalPostPlacementAmount = (decimal?)clientDto.PostPlacementPlan.TotalPostPlacementAmount ?? 0,
                            CreatedTS = clientDto.PostPlacementPlan.CreatedTS ?? DateTime.UtcNow,
                            CreatedBy = clientDto.PostPlacementPlan.CreatedBy ?? azureUserId,
                            UpdatedTS = clientDto.PostPlacementPlan.UpdatedTS ?? DateTime.UtcNow,
                            UpdatedBy = clientDto.PostPlacementPlan.UpdatedBy ?? azureUserId
                        };
                        if (clientDto.PromissoryNote != null && clientDto.PromissoryNote.Length > 0)
                        {
                            var fileName = $"{existingClient.ClientName}_PromissoryNote_Signed_{DateTime.UtcNow:yyyyMMddHHmmss}{Path.GetExtension(clientDto.PromissoryNote.FileName)}";
                            postPlacementPlan.PromissoryNoteURL = await UploadFileToSharePoint(clientDto.PromissoryNote, fileName, existingClient.ClientName);
                        }
                        _context.PostPlacementPlan.Add(postPlacementPlan);
                        await _context.SaveChangesAsync();
                        existingClient.PostPlacementPlanID = postPlacementPlan.PostPlacementPlanID;
                    }
                }

                // Handle Payment Schedules
                if (clientDto.PaymentSchedules != null)
                {
                    var existingSchedules = existingClient.PaymentSchedules.ToList();
                    var newSchedules = clientDto.PaymentSchedules
                        .Where(ps => ps.PaymentDate.HasValue && ps.Amount > 0)
                        .ToList();

                    foreach (var psDto in newSchedules)
                    {
                        var existingSchedule = existingSchedules.FirstOrDefault(ps => ps.PaymentScheduleID == psDto.PaymentScheduleID);
                        if (existingSchedule != null)
                        {
                            existingSchedule.PaymentDate = psDto.PaymentDate.Value;
                            existingSchedule.Amount = (decimal)psDto.Amount;
                            existingSchedule.IsPaid = psDto.IsPaid;
                            existingSchedule.PaymentType = psDto.PaymentType;
                            existingSchedule.SubscriptionPlanID = psDto.PaymentType == "Subscription" ? existingClient.SubscriptionPlanID : null;
                            existingSchedule.PostPlacementPlanID = psDto.PaymentType == "PostPlacement" ? existingClient.PostPlacementPlanID : null;
                            existingSchedule.UpdatedTS = psDto.UpdatedTS ?? DateTime.UtcNow;
                            existingSchedule.UpdatedBy = psDto.UpdatedBy ?? azureUserId;
                            _context.Entry(existingSchedule).State = EntityState.Modified;
                        }
                        else
                        {
                            var newSchedule = new PaymentSchedule
                            {
                                ClientID = existingClient.ClientID,
                                PaymentDate = psDto.PaymentDate.Value,
                                Amount = (decimal)psDto.Amount,
                                IsPaid = psDto.IsPaid,
                                PaymentType = psDto.PaymentType,
                                SubscriptionPlanID = psDto.PaymentType == "Subscription" ? existingClient.SubscriptionPlanID : null,
                                PostPlacementPlanID = psDto.PaymentType == "PostPlacement" ? existingClient.PostPlacementPlanID : null,
                                CreatedTS = psDto.CreatedTS ?? DateTime.UtcNow,
                                CreatedBy = psDto.CreatedBy ?? azureUserId,
                                UpdatedTS = psDto.UpdatedTS ?? DateTime.UtcNow,
                                UpdatedBy = psDto.UpdatedBy ?? azureUserId
                            };
                            _context.PaymentSchedules.Add(newSchedule);
                        }
                    }

                    var schedulesToRemove = existingSchedules
                        .Where(es => !newSchedules.Any(ns => ns.PaymentScheduleID == es.PaymentScheduleID))
                        .ToList();
                    _context.PaymentSchedules.RemoveRange(schedulesToRemove);
                }

                // Save changes before renaming
                await _context.SaveChangesAsync();
                await _clientRepository.UpdateClientAsync(existingClient);

                // Handle folder renaming if ClientName changed
                if (originalClientName != existingClient.ClientName)
                {
                    var environment = _configuration["ASPNETCORE_ENVIRONMENT"];
                    string rootFolder = environment == "Development"
                        ? $"{_configuration["SharePoint:RootFolderName"]}/{_configuration["SharePoint:TestingFolder"]}"
                        : $"{_configuration["SharePoint:RootFolderName"]}/{_configuration["SharePoint:ProductionFolder"]}";
                    string oldFolderPath = $"{rootFolder}/{originalClientName}";
                    string newFolderPath = $"{rootFolder}/{existingClient.ClientName}";

                    await RenameFolderInSharePoint(oldFolderPath, existingClient.ClientName);
                    await RenameFilesRecursively(newFolderPath, originalClientName, existingClient.ClientName, _configuration["SharePoint:SiteId"], _configuration["SharePoint:DriveId"]);

                    // Update URLs in the database
                    if (existingClient.SubscriptionPlan != null && existingClient.SubscriptionPlan.ServiceAgreementURL != null)
                    {
                        existingClient.SubscriptionPlan.ServiceAgreementURL = existingClient.SubscriptionPlan.ServiceAgreementURL.Replace(originalClientName, existingClient.ClientName);
                        _context.Entry(existingClient.SubscriptionPlan).State = EntityState.Modified;
                    }
                    if (existingClient.PostPlacementPlan != null && existingClient.PostPlacementPlan.PromissoryNoteURL != null)
                    {
                        existingClient.PostPlacementPlan.PromissoryNoteURL = existingClient.PostPlacementPlan.PromissoryNoteURL.Replace(originalClientName, existingClient.ClientName);
                        _context.Entry(existingClient.PostPlacementPlan).State = EntityState.Modified;
                    }
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Failed to edit client for user {AzureUserId}", azureUserId);
                throw;
            }
=======
        public async Task UpdateClientAsync(Client client)
        {
            await _clientRepository.UpdateClientAsync(client);
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
        }

        public async Task<string?> GetClientFileUrlAsync(int clientId, string fileType)
        {
            return await _clientRepository.GetClientFileUrlAsync(clientId, fileType);
        }

        private async Task<int> MapAzureUserIdToEmployeeId(string azureUserId)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.EmployeeReferenceID == azureUserId);
            return employee?.EmployeeID ?? throw new InvalidOperationException("User not found in system.");
        }
<<<<<<< HEAD

        private Client MapToClient(ClientCreateDto dto)
        {
            return new Client
            {
                ClientName = dto.ClientName,
                EnrollmentDate = dto.EnrollmentDate,
                TechStack = dto.TechStack,
                PersonalPhoneNumber = dto.PersonalPhoneNumber,
                PersonalEmailAddress = dto.PersonalEmailAddress,
                AssignedRecruiterID = dto.AssignedRecruiterID,
                VisaStatus = dto.VisaStatus,
                LinkedInURL = dto.LinkedInURL,
                ClientStatus = dto.ClientStatus,
                MarketingStartDate = dto.MarketingStartDate,
                MarketingEndDate = dto.MarketingEndDate,
                MarketingEmailID = dto.MarketingEmailID,
                MarketingEmailPassword = dto.MarketingEmailPassword,
                PlacedDate = dto.PlacedDate,
                BackedOutDate = dto.BackedOutDate,
                BackedOutReason = dto.BackedOutReason,
                TotalDue = (decimal)dto.TotalDue,
                TotalPaid = (decimal)dto.TotalPaid
            };
        }

        private void MapToClient(ClientUpdateDto dto, Client client)
        {
            client.ClientID = dto.ClientID;
            client.ClientName = dto.ClientName;
            client.EnrollmentDate = dto.EnrollmentDate;
            client.TechStack = dto.TechStack;
            client.PersonalPhoneNumber = dto.PersonalPhoneNumber;
            client.PersonalEmailAddress = dto.PersonalEmailAddress;
            client.AssignedRecruiterID = dto.AssignedRecruiterID;
            client.VisaStatus = dto.VisaStatus;
            client.LinkedInURL = dto.LinkedInURL;
            client.ClientStatus = dto.ClientStatus;
            client.MarketingStartDate = dto.MarketingStartDate;
            client.MarketingEndDate = dto.MarketingEndDate;
            client.MarketingEmailID = dto.MarketingEmailID;
            client.MarketingEmailPassword = dto.MarketingEmailPassword;
            client.PlacedDate = dto.PlacedDate;
            client.BackedOutDate = dto.BackedOutDate;
            client.BackedOutReason = dto.BackedOutReason;
            client.TotalDue = (decimal)dto.TotalDue;
            client.TotalPaid = (decimal)dto.TotalPaid;
        }

        private async Task<string> UploadFileToSharePoint(IFormFile file, string fileName, string clientName)
        {
            _logger.LogInformation($"Starting file upload to SharePoint for client: {clientName}, file: {fileName}");

            var sharePointSiteId = _configuration["SharePoint:SiteId"];
            var sharePointDriveId = _configuration["SharePoint:DriveId"];
            var rootFolderName = _configuration["SharePoint:RootFolderName"];

            var environment = _configuration["ASPNETCORE_ENVIRONMENT"];
            string clientDocumentsFolderPath = environment == "Development"
                ? $"{rootFolderName}/{_configuration["SharePoint:TestingFolder"]}"
                : $"{rootFolderName}/{_configuration["SharePoint:ProductionFolder"]}";
            string clientFolderPath = $"{clientDocumentsFolderPath}/{clientName}";
            string subFolder = fileName.Contains("ServiceAgreement") ? "ServiceAgreements" : "PromissoryNotes";
            string targetFolderPath = $"{clientFolderPath}/{subFolder}";

            _logger.LogInformation($"Target folder path for upload: {targetFolderPath}");

            using var stream = file.OpenReadStream();
            try
            {
                await EnsureFolderExists(rootFolderName, sharePointSiteId, sharePointDriveId);
                await EnsureFolderExists(clientDocumentsFolderPath, sharePointSiteId, sharePointDriveId);
                await EnsureFolderExists(clientFolderPath, sharePointSiteId, sharePointDriveId);
                await EnsureFolderExists(targetFolderPath, sharePointSiteId, sharePointDriveId);

                string timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
                string versionedFileName = $"{Path.GetFileNameWithoutExtension(fileName)}_{timestamp}{Path.GetExtension(fileName)}";

                var uploadedFile = await _graphClient.Sites[sharePointSiteId].Drives[sharePointDriveId].Root
                    .ItemWithPath($"{targetFolderPath}/{versionedFileName}")
                    .Content
                    .Request()
                    .PutAsync<DriveItem>(stream);

                _logger.LogInformation($"File uploaded successfully. URL: {uploadedFile.WebUrl}");
                return uploadedFile.WebUrl;
            }
            catch (ServiceException ex)
            {
                _logger.LogError($"SharePoint API error during upload: {ex.Error.Code} - {ex.Error.Message}");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Unexpected error during file upload: {ex.Message}");
                throw;
            }
        }

        private async Task EnsureFolderExists(string folderPath, string siteId, string driveId)
        {
            try
            {
                await _graphClient.Sites[siteId].Drives[driveId].Root
                    .ItemWithPath(folderPath)
                    .Request()
                    .GetAsync();
                _logger.LogInformation($"Folder exists: {folderPath}");
            }
            catch (ServiceException)
            {
                _logger.LogInformation($"Folder does not exist, creating: {folderPath}");
                var folderItem = new DriveItem
                {
                    Name = folderPath.Split('/').Last(),
                    Folder = new Folder()
                };

                var parentFolderPath = string.Join("/", folderPath.Split('/').SkipLast(1));
                await _graphClient.Sites[siteId].Drives[driveId].Root
                    .ItemWithPath(parentFolderPath)
                    .Children
                    .Request()
                    .AddAsync(folderItem);

                _logger.LogInformation($"Folder created: {folderPath}");
            }
        }

        private async Task RenameFolderInSharePoint(string oldFolderPath, string newFolderName)
        {
            try
            {
                var siteId = _configuration["SharePoint:SiteId"];
                var driveId = _configuration["SharePoint:DriveId"];

                var folderItem = await _graphClient.Sites[siteId].Drives[driveId].Root
                    .ItemWithPath(oldFolderPath)
                    .Request()
                    .GetAsync();

                if (folderItem != null)
                {
                    var updatedFolder = new DriveItem
                    {
                        Name = newFolderName
                    };

                    await _graphClient.Sites[siteId].Drives[driveId].Items[folderItem.Id]
                        .Request()
                        .UpdateAsync(updatedFolder);

                    _logger.LogInformation($"Folder renamed from {oldFolderPath} to {newFolderName}");
                }
                else
                {
                    _logger.LogWarning($"Folder not found: {oldFolderPath}");
                }
            }
            catch (ServiceException ex)
            {
                _logger.LogError($"SharePoint API error while renaming folder: {ex.Error.Code} - {ex.Error.Message}");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Unexpected error during folder rename: {ex.Message}");
                throw;
            }
        }

        private async Task RenameFilesRecursively(string folderPath, string oldClientName, string newClientName, string siteId, string driveId)
        {
            try
            {
                var folderItems = await _graphClient.Sites[siteId].Drives[driveId].Root
                    .ItemWithPath(folderPath)
                    .Children
                    .Request()
                    .Top(200)
                    .GetAsync();

                foreach (var item in folderItems.CurrentPage)
                {
                    if (item.Folder != null)
                    {
                        await RenameFilesRecursively($"{folderPath}/{item.Name}", oldClientName, newClientName, siteId, driveId);
                    }
                    else if (item.File != null && item.Name.Contains(oldClientName))
                    {
                        var newFileName = item.Name.Replace(oldClientName, newClientName);
                        var updatedFile = new DriveItem { Name = newFileName };

                        await _graphClient.Sites[siteId].Drives[driveId].Items[item.Id]
                            .Request()
                            .UpdateAsync(updatedFile);

                        _logger.LogInformation($"File renamed from {item.Name} to {newFileName}");
                    }
                }

                while (folderItems.NextPageRequest != null)
                {
                    folderItems = await folderItems.NextPageRequest.GetAsync();

                    foreach (var item in folderItems.CurrentPage)
                    {
                        if (item.Folder != null)
                        {
                            await RenameFilesRecursively($"{folderPath}/{item.Name}", oldClientName, newClientName, siteId, driveId);
                        }
                        else if (item.File != null && item.Name.Contains(oldClientName))
                        {
                            var newFileName = item.Name.Replace(oldClientName, newClientName);
                            var updatedFile = new DriveItem { Name = newFileName };

                            await _graphClient.Sites[siteId].Drives[driveId].Items[item.Id]
                                .Request()
                                .UpdateAsync(updatedFile);

                            _logger.LogInformation($"File renamed from {item.Name} to {newFileName}");
                        }
                    }
                }
            }
            catch (ServiceException ex)
            {
                _logger.LogError($"Graph API error during recursive file rename: {ex.Error.Code} - {ex.Error.Message}");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Unexpected error during recursive file rename: {ex.Message}");
                throw;
            }
        }
=======
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
    }
}