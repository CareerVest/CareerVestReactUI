using Backend.Dtos;
using Backend.Models;

public interface IClientRepository
{
    Task<IEnumerable<ClientListDto>> GetAllClientsAsync(string role, int employeeId, int? supervisorId);
    Task<ClientDetailDto?> GetClientByIdAsync(int clientId, string role, int employeeId, int? supervisorId);
    Task UpdateClientAsync(Client client);
    Task<string?> GetClientFileUrlAsync(int clientId, string fileType);
}