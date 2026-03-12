using GE.SWAPI.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GE.SWAPI.Domain.Interfaces
{
    public interface ISwApiService
    {
        Task<List<Starship>> GetAllStarshipsAsync();
        Task<Starship> GetStarshipByIdAsync(int id);
        Task<List<Film>> GetAllFilmsAsync();
        Task<List<Person>> GetAllPeopleAsync();
    }
}
