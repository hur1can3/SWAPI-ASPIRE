using GE.SWAPI.Domain.Models;
using GE.SWAPI.StarshipDb.Repositories;

namespace GE.SWAPI.Application.Services
{
    public class StarshipService : IStarshipService
    {
        private readonly IStarshipRepository _starshipRepo;

        public StarshipService(IStarshipRepository starshipRepository)
        {
            _starshipRepo = starshipRepository;
        }

        public async Task<IEnumerable<Starship>> GetAllStarshipsAsync()
        {
            var starships = await _starshipRepo.GetAllStarshipsAsync();
            return starships;
        }

        public async Task<Starship?> GetStarshipByIdAsync(int id)
        {
            var starship = await _starshipRepo.GetStarshipByIdAsync(id);
            return starship;
        }

        public async Task<Starship> AddStarshipAsync(Starship starship)
        {
            var createdStarship = await _starshipRepo.AddStarshipAsync(starship);
            return createdStarship;
        }

        public async Task<Starship> UpdateStarshipAsync(int id, Starship starship)
        {
            var existing = await _starshipRepo.GetStarshipByIdAsync(id);
            if (existing == null)
            {
                return null!;
            }

            existing.Name = starship.Name;
            existing.Model = starship.Model;
            existing.Manufacturer = starship.Manufacturer;
            existing.CostInCredits = starship.CostInCredits;
            existing.Length = starship.Length;
            existing.MaxAtmospheringSpeed = starship.MaxAtmospheringSpeed;
            existing.Crew = starship.Crew;
            existing.Passengers = starship.Passengers;
            existing.CargoCapacity = starship.CargoCapacity;
            existing.Consumables = starship.Consumables;
            existing.HyperdriveRating = starship.HyperdriveRating;
            existing.MGLT = starship.MGLT;
            existing.StarshipClass = starship.StarshipClass;
            existing.Pilots = starship.Pilots;
            existing.Films = starship.Films;
            existing.Edited = DateTime.UtcNow;

            var updatedStarship = await _starshipRepo.UpdateStarshipAsync(existing);
            return updatedStarship;
        }

        public async Task DeleteStarshipAsync(int id)
        {
            await _starshipRepo.DeleteStarshipAsync(id);
        }
    }
}
