using GE.SWAPI.Domain.Models;

namespace GE.SWAPI.StarshipDb.Repositories
{
    public interface IStarshipRepository
    {
        Task<Starship> AddStarshipAsync(Starship starship);
        Task DeleteStarshipAsync(int id);
        Task<IEnumerable<Starship>> GetAllStarshipsAsync();
        Task<Starship?> GetStarshipByIdAsync(int id);
        Task<Starship> UpdateStarshipAsync(Starship starship);
    }
}