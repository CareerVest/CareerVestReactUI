using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Dtos;
using Backend.Services;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/v1/interviewchains")]
    [ApiController]
    [Authorize]
    public class InterviewChainController : ControllerBase
    {
        private readonly IInterviewChainService _interviewChainService;

        public InterviewChainController(IInterviewChainService interviewChainService)
        {
            _interviewChainService = interviewChainService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<InterviewChainListDto>>> GetInterviewChains()
        {
            var azureUserId = User.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value;
            var role = User.FindFirstValue(ClaimTypes.Role);
            var supervisorId = User.FindFirst("supervisorId")?.Value is string supId ? int.Parse(supId) : (int?)null;

            var chains = await _interviewChainService.GetInterviewChainsForUserAsync(azureUserId, role, supervisorId);
            return Ok(chains);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InterviewChainDetailDto>> GetInterviewChain(int id)
        {
            var azureUserId = User.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value;
            var role = User.FindFirst("role")?.Value;
            var supervisorId = User.FindFirst("supervisorId")?.Value is string supId ? int.Parse(supId) : (int?)null;

            var chain = await _interviewChainService.GetInterviewChainByIdForUserAsync(id, azureUserId, role, supervisorId);
            if (chain == null) return NotFound();
            return Ok(chain);
        }

        [HttpPost]
        public async Task<ActionResult> CreateInterviewChain([FromBody] InterviewChainCreateDto dto)
        {
            var azureUserId = User.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value;
            var createdId = await _interviewChainService.CreateInterviewChainAsync(dto, azureUserId);
            return CreatedAtAction(nameof(GetInterviewChain), new { id = createdId }, new { InterviewChainID = createdId });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateInterviewChain(int id, [FromBody] InterviewChainUpdateDto dto)
        {
            if (id != dto.InterviewChainID) return BadRequest("ID mismatch.");
            var azureUserId = User.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value;
            await _interviewChainService.UpdateInterviewChainAsync(id, dto, azureUserId);
            return NoContent();
        }

        [HttpPost("{id}/interviews")]
        public async Task<ActionResult> AddInterviewToChain(int id, [FromBody] InterviewChainAddDto dto)
        {
            if (id != dto.InterviewChainID) return BadRequest("ID mismatch.");
            var azureUserId = User.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value;
            var success = await _interviewChainService.AddInterviewToChainAsync(dto, azureUserId);
            if (!success) return BadRequest("Failed to add interview to chain.");
            return CreatedAtAction(nameof(GetInterviewChain), new { id }, dto);
        }

        [HttpPut("{id}/end")]
        public async Task<ActionResult> EndInterview(int id, [FromBody] InterviewChainEndDto dto)
        {
            if (id != dto.InterviewChainID) return BadRequest("ID mismatch.");
            var azureUserId = User.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value;
            await _interviewChainService.EndInterviewAsync(id, dto, azureUserId);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteInterviewChain(int id)
        {
            var azureUserId = User.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value;
            var success = await _interviewChainService.DeleteInterviewChainAsync(id, azureUserId);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}