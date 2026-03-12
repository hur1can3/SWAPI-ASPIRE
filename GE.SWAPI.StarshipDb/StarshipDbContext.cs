using GE.SWAPI.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace GE.SWAPI.StarshipDb
{
    public class StarshipDbContext(DbContextOptions<StarshipDbContext> options) : DbContext(options)
    {
        public DbSet<Starship> Starships { get; set;  }
        public DbSet<Film> Films { get; set; }
        public DbSet<Person> People { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var jsonOptions = new JsonSerializerOptions();

            modelBuilder.Entity<Starship>()
                .HasMany(x => x.Pilots);

            modelBuilder.Entity<Starship>().HasMany(x => x.Films);
            modelBuilder.Entity<Person>().HasIndex(x => x.Name);
            modelBuilder.Entity<Film>().HasIndex(x => x.Title);

            // Add Indexes
            modelBuilder.Entity<Starship>()
                .HasIndex(s => s.Name);

            modelBuilder.Entity<Starship>()
                .HasIndex(s => s.Manufacturer);

            modelBuilder.Entity<Starship>()
                .HasIndex(s => s.StarshipClass);
        }
    }
}
