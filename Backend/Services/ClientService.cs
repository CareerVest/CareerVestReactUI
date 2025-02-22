using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Backend.Data;

namespace Backend.Services
{
    public class ClientService : IClientService
    {
        private readonly IClientRepository _clientRepository;
        private readonly ILogger<ClientService> _logger;
        private readonly ApplicationDbContext _context; // Assuming this is injected

        public ClientService(IClientRepository clientRepository, ILogger<ClientService> logger, ApplicationDbContext context)
        {
            _clientRepository = clientRepository;
            _logger = logger;
            _context = context;
        }

        /// ✅ Get Clients Based on User Role (Filters Applied in Repository)
        public async Task<IEnumerable<ClientListDto>> GetClientsForUserAsync(string azureUserId, string role, int? supervisorId)
        {
            int employeeId = await MapAzureUserIdToEmployeeId(azureUserId);
            return await _clientRepository.GetAllClientsAsync(role, employeeId, supervisorId);
        }

        /// ✅ Securely Fetch a Client Based on User Role (Filters Applied in Repository)
        public async Task<ClientDetailDto?> GetClientByIdForUserAsync(int clientId, string azureUserId, string role, int? supervisorId)
        {
            int employeeId = await MapAzureUserIdToEmployeeId(azureUserId);
            return await _clientRepository.GetClientByIdAsync(clientId, role, employeeId, supervisorId);
        }

        public async Task UpdateClientAsync(Client client)
        {
            await _clientRepository.UpdateClientAsync(client);
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
    }
}