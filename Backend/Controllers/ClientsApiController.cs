using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Backend.Services;
using Backend.Dtos;
<<<<<<< HEAD
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Text.Json;
=======
using Backend.Models;
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)

namespace Backend.Controllers.Api
{
    [Route("api/v1/clients")]
    [ApiController]
<<<<<<< HEAD
    [Authorize]
=======
    [Authorize] // ✅ Requires authentication for all endpoints
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
    public class ClientsController : ControllerBase
    {
        private readonly IClientService _clientService;
        private readonly ILogger<ClientsController> _logger;

        public ClientsController(IClientService clientService, ILogger<ClientsController> logger)
        {
            _clientService = clientService;
            _logger = logger;
        }

<<<<<<< HEAD
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClientListDto>>> GetClients()
=======
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
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
        {
            var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
            var role = User.FindFirstValue(ClaimTypes.Role);
            var supervisorId = User.FindFirstValue("SupervisorID");

            if (string.IsNullOrEmpty(role))
            {
                _logger.LogWarning($"User {azureUserId} attempted to access clients without a valid role.");
                return Unauthorized("User role is required.");
            }

            var clients = await _clientService.GetClientsForUserAsync(azureUserId, role, supervisorId != null ? int.Parse(supervisorId) : (int?)null);
            return Ok(clients);
        }

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

            var client = await _clientService.GetClientByIdForUserAsync(id, azureUserId, role, supervisorId != null ? int.Parse(supervisorId) : (int?)null);
            if (client == null)
                return NotFound("Client not found or unauthorized.");

            return Ok(client);
        }

        /// <summary>
        /// Creates a new client with associated files and plans.
        /// </summary>
        /// <param name="clientCreateDto">Client data including nested plans and schedules</param>
        /// <returns>Success indicator</returns>
        [HttpPost]
        public async Task<IActionResult> CreateClient([ModelBinder(BinderType = typeof(ClientCreateDtoBinder))] ClientCreateDto clientCreateDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for client creation.");
                return BadRequest(ModelState);
            }

            var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
            try
            {
<<<<<<< HEAD
                var success = await _clientService.CreateClientAsync(clientCreateDto, azureUserId);
                return Ok(new { success });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating client for user {AzureUserId}", azureUserId);
                return StatusCode(500, "An error occurred while creating the client.");
            }
        }

        /// <summary>
        /// Edits an existing client with associated files and plans.
        /// </summary>
        /// <param name="id">Client ID</param>
        /// <param name="clientUpdateDto">Updated client data including nested plans and schedules</param>
        /// <returns>No content if successful</returns>
        [HttpPut("{id}/edit")]
        public async Task<IActionResult> EditClient(int id, [ModelBinder(BinderType = typeof(ClientUpdateDtoBinder))] ClientUpdateDto clientUpdateDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for client update.");
                return BadRequest(ModelState);
            }

            var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
            try
            {
                await _clientService.EditClientAsync(id, clientUpdateDto, azureUserId);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Client not found.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error editing client {ClientId} for user {AzureUserId}", id, azureUserId);
                return StatusCode(500, "An error occurred while editing the client.");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClient(int id, [ModelBinder(BinderType = typeof(ClientUpdateDtoBinder))] ClientUpdateDto clientUpdateDto)
        {
            return await EditClient(id, clientUpdateDto); // Reuse EditClient logic
        }

        [HttpGet("{clientId}/open-file/{fileType}")]
        public async Task<IActionResult> OpenFile(int clientId, string fileType)
        {
            var azureUserId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
            try
            {
                var fileUrl = await _clientService.GetClientFileUrlAsync(clientId, fileType);
                if (string.IsNullOrEmpty(fileUrl))
                {
                    _logger.LogWarning($"No file found for ClientID: {clientId}, FileType: {fileType} for user {azureUserId}");
                    return NotFound($"{fileType} file not found.");
                }
                return Redirect(fileUrl);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Unexpected error while fetching file for ClientID: {clientId}, FileType: {fileType} for user {azureUserId}");
=======
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
>>>>>>> 3e9296e (working model fo cliets view, edit, list.)
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }

    // Custom Model Binder for ClientCreateDto
    public class ClientCreateDtoBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            if (bindingContext == null)
            {
                throw new ArgumentNullException(nameof(bindingContext));
            }

            var valueProviderResult = bindingContext.ValueProvider.GetValue("clientDto");
            if (valueProviderResult == ValueProviderResult.None)
            {
                bindingContext.ModelState.AddModelError("clientDto", "clientDto is required.");
                return Task.CompletedTask;
            }

            var clientDtoJson = valueProviderResult.FirstValue;
            if (string.IsNullOrEmpty(clientDtoJson))
            {
                bindingContext.ModelState.AddModelError("clientDto", "clientDto cannot be empty.");
                return Task.CompletedTask;
            }

            try
            {
                var clientCreateDto = JsonSerializer.Deserialize<ClientCreateDto>(clientDtoJson, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (clientCreateDto == null)
                {
                    bindingContext.ModelState.AddModelError("clientDto", "Invalid clientDto format.");
                    return Task.CompletedTask;
                }

                // Bind files separately
                var serviceAgreementFile = bindingContext.HttpContext.Request.Form.Files["ServiceAgreement"];
                var promissoryNoteFile = bindingContext.HttpContext.Request.Form.Files["PromissoryNote"];
                clientCreateDto.ServiceAgreement = serviceAgreementFile != null ? serviceAgreementFile : null;
                clientCreateDto.PromissoryNote = promissoryNoteFile != null ? promissoryNoteFile : null;

                bindingContext.Result = ModelBindingResult.Success(clientCreateDto);
            }
            catch (JsonException ex)
            {
                bindingContext.ModelState.AddModelError("clientDto", $"Error deserializing clientDto: {ex.Message}");
            }

            return Task.CompletedTask;
        }
    }

    // Custom Model Binder for ClientUpdateDto
    public class ClientUpdateDtoBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            if (bindingContext == null)
            {
                throw new ArgumentNullException(nameof(bindingContext));
            }

            var valueProviderResult = bindingContext.ValueProvider.GetValue("clientDto");
            if (valueProviderResult == ValueProviderResult.None)
            {
                bindingContext.ModelState.AddModelError("clientDto", "clientDto is required.");
                return Task.CompletedTask;
            }

            var clientDtoJson = valueProviderResult.FirstValue;
            if (string.IsNullOrEmpty(clientDtoJson))
            {
                bindingContext.ModelState.AddModelError("clientDto", "clientDto cannot be empty.");
                return Task.CompletedTask;
            }

            try
            {
                var clientUpdateDto = JsonSerializer.Deserialize<ClientUpdateDto>(clientDtoJson, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (clientUpdateDto == null)
                {
                    bindingContext.ModelState.AddModelError("clientDto", "Invalid clientDto format.");
                    return Task.CompletedTask;
                }

                // Bind files separately
                var serviceAgreementFile = bindingContext.HttpContext.Request.Form.Files["ServiceAgreement"];
                var promissoryNoteFile = bindingContext.HttpContext.Request.Form.Files["PromissoryNote"];
                clientUpdateDto.ServiceAgreement = serviceAgreementFile != null ? serviceAgreementFile : null;
                clientUpdateDto.PromissoryNote = promissoryNoteFile != null ? promissoryNoteFile : null;

                bindingContext.Result = ModelBindingResult.Success(clientUpdateDto);
            }
            catch (JsonException ex)
            {
                bindingContext.ModelState.AddModelError("clientDto", $"Error deserializing clientDto: {ex.Message}");
            }

            return Task.CompletedTask;
        }
    }
}