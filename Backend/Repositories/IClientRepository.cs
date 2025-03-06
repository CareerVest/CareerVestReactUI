using Backend.Dtos;
using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Repositories
{
    public interface IClientRepository
    {
        /// <summary>
        /// Retrieves all clients based on user role and permissions.
        /// </summary>
        Task<IEnumerable<ClientListDto>> GetAllClientsAsync(string role, int employeeId, int? supervisorId);

        /// <summary>
        /// Retrieves a specific client by ID based on user role and permissions.
        /// </summary>
        Task<ClientDetailDto?> GetClientByIdAsync(int clientId, string role, int employeeId, int? supervisorId);

        /// <summary>
        /// Retrieves all clients assigned to a specific recruiter, applying role-based filters.
        /// </summary>
        Task<List<Client>> GetClientsByRecruiterIdAsync(int recruiterId, string role, int employeeId, int? supervisorId);

        /// <summary>
        /// Adds a new client entity to the database, including related entities.
        /// </summary>
        Task<Client> AddClientAsync(Client client);

        /// <summary>
        /// Updates an existing client entity in the database.
        /// </summary>
        Task UpdateClientAsync(Client client);

        /// <summary>
        /// Retrieves the URL of a client file (Service Agreement or Promissory Note).
        /// </summary>
        Task<string?> GetClientFileUrlAsync(int clientId, string fileType);

        Task<List<ClientListDto>> GetClientsForUserWithFiltersAsync(string role, int employeeId, int? supervisorId, FilterStateDto filters);
    }
}