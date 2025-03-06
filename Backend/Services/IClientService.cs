using Backend.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IClientService
    {
        Task<IEnumerable<ClientListDto>> GetClientsForUserAsync(string azureUserId, string role, int? supervisorId);
        Task<ClientDetailDto?> GetClientByIdForUserAsync(int clientId, string azureUserId, string role, int? supervisorId);
        Task<IEnumerable<ClientListDto>> GetClientsByRecruiterIdAsync(int recruiterId, string azureUserId, string role, int? supervisorId);
        Task<bool> CreateClientAsync(ClientCreateDto clientDto, string azureUserId);
        Task EditClientAsync(int id, ClientUpdateDto clientDto, string azureUserId);
        Task<string?> GetClientFileUrlAsync(int clientId, string fileType);
        Task<bool> DeleteClientAsync(int clientId, string azureUserId);

        // Updated method for Marketing Activity with search and quick filters
        Task<List<ClientListDto>> GetClientsForUserWithFiltersAsync(string azureUserId, string role, int? supervisorId, FilterStateDto filters);
    }
}