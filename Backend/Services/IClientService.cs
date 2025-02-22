using Backend.Dtos;
using Backend.Models;

public interface IClientService
{
    Task<IEnumerable<ClientListDto>> GetClientsForUserAsync(string azureUserId, string role, int? supervisorId);
    Task<ClientDetailDto?> GetClientByIdForUserAsync(int clientId, string azureUserId, string role, int? supervisorId);
    Task UpdateClientAsync(Client client);
    Task<string?> GetClientFileUrlAsync(int clientId, string fileType);
}