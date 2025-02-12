using Microsoft.AspNetCore.Authorization;  // ✅ Required for [Authorize]
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers.Api
{
    [Route("api/v1/clients")]
    [ApiController]
    [Authorize] // ✅ Secures all endpoints in this controller
    public class ClientsApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientsApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/v1/clients
        [HttpGet]
        public async Task<IActionResult> GetAllClients()
        {
            try
            {
                var clients = await _context.Clients.ToListAsync();
                return Ok(clients);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}