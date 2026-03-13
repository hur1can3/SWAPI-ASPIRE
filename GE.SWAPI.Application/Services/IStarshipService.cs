using GE.SWAPI.Domain.Models;

namespace GE.SWAPI.Application.Services
{
    public interface IStarshipService
    {
        Task<Starship> AddStarshipAsync(Starship starship);
        Task DeleteStarshipAsync(int id);
        Task<IEnumerable<Starship>> GetAllStarshipsAsync();
        Task<Starship?> GetStarshipByIdAsync(int id);
        Task<Starship> UpdateStarshipAsync(int id, Starship starship);
    }
}