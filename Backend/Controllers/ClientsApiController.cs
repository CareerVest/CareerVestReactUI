using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Backend.Services;
using Backend.Dtos;
using Backend.Models;

namespace Backend.Controllers.Api
{
    [Route("api/v1/clients")]
    [ApiController]
    [Authorize] // ✅ Requires authentication for all endpoints
    public class ClientsController : ControllerBase
    {
        private readonly IClientService _clientService;
        private readonly ILogger<ClientsController> _logger;

        public ClientsController(IClientService clientService, ILogger<ClientsController> logger)
        {
            _clientService = clientService;
            _logger = logger;
        }

        /// ✅ Get Clients Based on User Role
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClientListDto>>> GetClients()
        {
            var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
            Console.WriteLine($"Extracted User ID (Object Identifier): {azureUserId}");
            var role = User.FindFirstValue(ClaimTypes.Role);
            var supervisorId = User.FindFirstValue("SupervisorID");

            if (string.IsNullOrEmpty(role))
            {
                _logger.LogWarning($"User {azureUserId} attempted to access clients without a valid role.");
                return Unauthorized("User role is required.");
            }

            var clients = await _clientService.GetClientsForUserAsync(azureUserId, role, 
                supervisorId != null ? int.Parse(supervisorId) : (int?)null);

            return Ok(clients);
        }

        /// ✅ Get a Single Client Securely Based on Role
        [HttpGet("{id}")]
        public async Task<IActionResult> GetClientById(int id)
        {
            var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
            var role = User.FindFirstValue(ClaimTypes.Role);
            var supervisorId = User.FindFirstValue("SupervisorID");

            if (string.IsNullOrEmpty(role))
            {
                _logger.LogWarning($"User {azureUserId} attempted to access a client without a valid role.");
                return Unauthorized("User role is required.");
            }

            var client = await _clientService.GetClientByIdForUserAsync(id, azureUserId, role, 
                supervisorId != null ? int.Parse(supervisorId) : (int?)null);

            if (client == null)
                return NotFound("Client not found or unauthorized.");

            return Ok(client);
        }

        /// ✅ Update Client Details (Admins Only)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Sales")]
        public async Task<IActionResult> UpdateClient(int id, [FromBody] Client client)
        {
            if (id != client.ClientID)
                return BadRequest("Client ID mismatch");

            await _clientService.UpdateClientAsync(client);
            return NoContent();
        }

        /// ✅ Open Service Agreement or Promissory Note
        [HttpGet("{clientId}/open-file/{fileType}")]
        public async Task<IActionResult> OpenFile(int clientId, string fileType)
        {
            try
            {
                var fileUrl = await _clientService.GetClientFileUrlAsync(clientId, fileType);

                if (string.IsNullOrEmpty(fileUrl))
                {
                    _logger.LogWarning($"No file found for ClientID: {clientId}, FileType: {fileType}");
                    return NotFound($"{fileType} file not found.");
                }

                return Redirect(fileUrl);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Unexpected error while fetching file: {ex.Message}");
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}