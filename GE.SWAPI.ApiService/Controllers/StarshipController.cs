using GE.SWAPI.Application.Services;
using GE.SWAPI.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GE.SWAPI.ApiService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StarshipController : Controller
    {
        private readonly IStarshipService _starshipService;
        private readonly ILogger<StarshipController> _logger;

        public StarshipController(IStarshipService starshipService, ILogger<StarshipController> logger)
        {
            _starshipService = starshipService;
            _logger = logger;
        }

        //[Authorize(Roles = "Admin, User")]
        [HttpGet]
        [ProducesResponseType(typeof(IReadOnlyList<Starship>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllStarships()
        {
            try
            {
                var starships = await _starshipService.GetAllStarshipsAsync();
                if (starships == null || !starships.Any())
                {
                    return NotFound();
                }
                return Ok(starships);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving starships: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        //[Authorize(Roles = "Admin, User")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStarshipById(int id)
        {
            try
            {
                var starship = await _starshipService.GetStarshipByIdAsync(id);
                if (starship == null)
                {
                    return NotFound();
                }
                return Ok(starship);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving starship with ID {id}: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        //[Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> AddStarship([FromBody] Starship starship)
        {
            try
            {
                if (starship == null)
                {
                    return BadRequest("Starship object is null");
                }
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid starship object");
                }
                var createdStarship = await _starshipService.AddStarshipAsync(starship);
                return CreatedAtAction(nameof(GetStarshipById), new { id = createdStarship.Id }, createdStarship);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error adding starship: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

       //[Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStarship(int id, [FromBody] Starship starship)
        {
            try
            {
                if (starship == null)
                {
                    return BadRequest("Starship object is null");
                }
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid starship object");
                }
                var updatedStarship = await _starshipService.UpdateStarshipAsync(id, starship);
                if (updatedStarship == null)
                {
                    return BadRequest("No existing starship to update");
                }
                await _starshipService.UpdateStarshipAsync(id, starship);
                return Ok(updatedStarship);
            }
            catch (Exception ex)
            {
                int statusCode = (ex.Data.Contains("errorCode") && ex.Data["errorCode"] is int errorCode) ? errorCode : 500;
                _logger.LogError($"Error updating starship: {ex.Message}");
                return StatusCode(statusCode, ex.Message);
            }
        }

        //[Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStarship(int id)
        {
            try
            {
                await _starshipService.DeleteStarshipAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                int statusCode = (ex.Data.Contains("errorCode") && ex.Data["errorCode"] is int errorCode) ? errorCode : 500;
                _logger.LogError($"Error deleting starship: {ex.Message}");
                return StatusCode(statusCode, ex.Message);
            }
        }
    }
}
