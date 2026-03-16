using GE.SWAPI.ApiService.Models;
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
        [HttpGet("paged")]
        [ProducesResponseType(typeof(PagedResult<Starship>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetStarshipsPaged(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10,
            [FromQuery] string? sortColumn = null,
            [FromQuery] string? sortDirection = "asc",
            [FromQuery] string? searchTerm = null)
        {
            try
            {
                if (page < 1) page = 1;
                if (pageSize < 1) pageSize = 10;
                if (pageSize > 100) pageSize = 100; // Limit max page size

                var allStarships = await _starshipService.GetAllStarshipsAsync();
                if (allStarships == null)
                {
                    return Ok(new PagedResult<Starship>
                    {
                        Data = new List<Starship>(),
                        TotalRecords = 0,
                        Page = page,
                        PageSize = pageSize
                    });
                }

                // Apply filtering if search term is provided
                if (!string.IsNullOrWhiteSpace(searchTerm))
                {
                    allStarships = ApplyFiltering(allStarships, searchTerm);
                }

                // Apply sorting if specified
                if (!string.IsNullOrEmpty(sortColumn))
                {
                    allStarships = ApplySorting(allStarships, sortColumn, sortDirection);
                }

                var totalRecords = allStarships.Count();
                var pagedData = allStarships
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var result = new PagedResult<Starship>
                {
                    Data = pagedData,
                    TotalRecords = totalRecords,
                    Page = page,
                    PageSize = pageSize
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving paged starships: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        private IReadOnlyList<Starship> ApplyFiltering(IEnumerable<Starship> starships, string searchTerm)
        {
            var lowerSearchTerm = searchTerm.ToLower();

            return starships.Where(s =>
                (s.Name?.ToLower().Contains(lowerSearchTerm) ?? false) ||
                (s.Model?.ToLower().Contains(lowerSearchTerm) ?? false) ||
                (s.Manufacturer?.ToLower().Contains(lowerSearchTerm) ?? false) ||
                (s.CostInCredits?.ToLower().Contains(lowerSearchTerm) ?? false) ||
                (s.Length?.ToLower().Contains(lowerSearchTerm) ?? false) ||
                (s.MaxAtmospheringSpeed?.ToLower().Contains(lowerSearchTerm) ?? false) ||
                (s.Crew?.ToLower().Contains(lowerSearchTerm) ?? false) ||
                (s.Passengers?.ToLower().Contains(lowerSearchTerm) ?? false) ||
                (s.CargoCapacity?.ToLower().Contains(lowerSearchTerm) ?? false) ||
                (s.Consumables?.ToLower().Contains(lowerSearchTerm) ?? false) ||
                (s.HyperdriveRating?.ToLower().Contains(lowerSearchTerm) ?? false) ||
                (s.MGLT?.ToLower().Contains(lowerSearchTerm) ?? false) ||
                (s.StarshipClass?.ToLower().Contains(lowerSearchTerm) ?? false)
            ).ToList();
        }

        private IEnumerable<Starship> ApplySorting(IEnumerable<Starship> starships, string sortColumn, string? sortDirection)
        {
            var isDescending = sortDirection?.ToLower() == "desc";

            return sortColumn.ToLower() switch
            {
                "name" => isDescending 
                    ? starships.OrderByDescending(s => s.Name).ToList()
                    : starships.OrderBy(s => s.Name).ToList(),
                "model" => isDescending 
                    ? starships.OrderByDescending(s => s.Model).ToList()
                    : starships.OrderBy(s => s.Model).ToList(),
                "manufacturer" => isDescending 
                    ? starships.OrderByDescending(s => s.Manufacturer).ToList()
                    : starships.OrderBy(s => s.Manufacturer).ToList(),
                "starship_class" => isDescending 
                    ? starships.OrderByDescending(s => s.StarshipClass).ToList()
                    : starships.OrderBy(s => s.StarshipClass).ToList(),
                "cost_in_credits" => isDescending 
                    ? starships.OrderByDescending(s => s.CostInCredits).ToList()
                    : starships.OrderBy(s => s.CostInCredits).ToList(),
                "length" => isDescending 
                    ? starships.OrderByDescending(s => s.Length).ToList()
                    : starships.OrderBy(s => s.Length).ToList(),
                "crew" => isDescending 
                    ? starships.OrderByDescending(s => s.Crew).ToList()
                    : starships.OrderBy(s => s.Crew).ToList(),
                "passengers" => isDescending 
                    ? starships.OrderByDescending(s => s.Passengers).ToList()
                    : starships.OrderBy(s => s.Passengers).ToList(),
                "max_atmosphering_speed" => isDescending 
                    ? starships.OrderByDescending(s => s.MaxAtmospheringSpeed).ToList()
                    : starships.OrderBy(s => s.MaxAtmospheringSpeed).ToList(),
                "cargo_capacity" => isDescending 
                    ? starships.OrderByDescending(s => s.CargoCapacity).ToList()
                    : starships.OrderBy(s => s.CargoCapacity).ToList(),
                "consumables" => isDescending 
                    ? starships.OrderByDescending(s => s.Consumables).ToList()
                    : starships.OrderBy(s => s.Consumables).ToList(),
                "hyperdrive_rating" => isDescending 
                    ? starships.OrderByDescending(s => s.HyperdriveRating).ToList()
                    : starships.OrderBy(s => s.HyperdriveRating).ToList(),
                "mglt" => isDescending 
                    ? starships.OrderByDescending(s => s.MGLT).ToList()
                    : starships.OrderBy(s => s.MGLT).ToList(),
                _ => starships // Default: no sorting
            };
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
                    return BadRequest(ModelState);
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
                    return BadRequest(ModelState);
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
