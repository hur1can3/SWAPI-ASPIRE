using GE.SWAPI.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GE.SWAPI.StarshipDb.Repositories
{
    public class StarshipRepository : IStarshipRepository
    {
        private readonly StarshipDbContext _context;

        public StarshipRepository(StarshipDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Starship>> GetAllStarshipsAsync()
        {
            var starships = await _context.Starships.ToListAsync();
            return starships;
        }

        public async Task<Starship?> GetStarshipByIdAsync(int id)
        {
            var starship = await _context.Starships.FindAsync(id);
            return starship;
        }

        public async Task<Starship> AddStarshipAsync(Starship starship)
        {
            _context.Starships.Add(starship);
            await _context.SaveChangesAsync();
            return starship;
        }

        public async Task<Starship> UpdateStarshipAsync(Starship starship)
        {
            _context.Entry(starship).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return starship;
        }

        public async Task DeleteStarshipAsync(int id)
        {
            var starship = await _context.Starships.FindAsync(id);
            if (starship != null)
            {
                _context.Starships.Remove(starship);
                await _context.SaveChangesAsync();
            }
        }
    }
}
