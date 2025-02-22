using Backend.Dtos;
<<<<<<< HEAD
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IClientService
    {
        Task<IEnumerable<ClientListDto>> GetClientsForUserAsync(string azureUserId, string role, int? supervisorId);
        Task<ClientDetailDto?> GetClientByIdForUserAsync(int clientId, string azureUserId, string role, int? supervisorId);
        Task<bool> CreateClientAsync(ClientCreateDto clientDto, string azureUserId);
        Task EditClientAsync(int id, ClientUpdateDto clientDto, string azureUserId);
        Task<string?> GetClientFileUrlAsync(int clientId, string fileType);
    }
=======
using Backend.Models;

public interface IClientService
{
    Task<IEnumerable<ClientListDto>> GetClientsForUserAsync(string azureUserId, string role, int? supervisorId);
    Task<ClientDetailDto?> GetClientByIdForUserAsync(int clientId, string azureUserId, string role, int? supervisorId);
    Task UpdateClientAsync(Client client);
    Task<string?> GetClientFileUrlAsync(int clientId, string fileType);
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
}