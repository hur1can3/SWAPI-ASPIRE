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

            // Configure many-to-many relationship between Starship and Person (Pilots)
            modelBuilder.Entity<Starship>()
                .HasMany(s => s.Pilots)
                .WithMany(p => p.Starships)
                .UsingEntity(j => j.ToTable("StarshipPilots"));

            // Configure many-to-many relationship between Starship and Film
            modelBuilder.Entity<Starship>()
                .HasMany(s => s.Films)
                .WithMany(f => f.Starships)
                .UsingEntity(j => j.ToTable("StarshipFilms"));

            // Add Indexes for Person
            modelBuilder.Entity<Person>().HasIndex(x => x.Name);

            // Add Indexes for Film
            modelBuilder.Entity<Film>().HasIndex(x => x.Title);

            // Add Indexes for Starship
            modelBuilder.Entity<Starship>()
                .HasIndex(s => s.Name);

            modelBuilder.Entity<Starship>()
                .HasIndex(s => s.Manufacturer);

            modelBuilder.Entity<Starship>()
                .HasIndex(s => s.StarshipClass);
        }
    }
}
