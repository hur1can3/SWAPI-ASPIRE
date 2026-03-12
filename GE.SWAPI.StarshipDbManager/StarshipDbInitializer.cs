using GE.SWAPI.Domain.Interfaces;
using GE.SWAPI.Domain.Models;
using GE.SWAPI.StarshipDb;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using static System.Formats.Asn1.AsnWriter;

namespace GE.SWAPI.SharshipDbManager
{
    internal class StarshipDbInitializer(IServiceProvider serviceProvider, ILogger<StarshipDbInitializer> logger)
      : BackgroundService
    {
        public const string ActivitySourceName = "Migrations";

        private readonly ActivitySource _activitySource = new(ActivitySourceName);

        protected override async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            using var scope = serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<StarshipDbContext>();
            var swapiService = scope.ServiceProvider.GetRequiredService<ISwApiService>();

            using var activity = _activitySource.StartActivity("Initializing starship database", ActivityKind.Client);
            await InitializeDatabaseAsync(dbContext, swapiService, cancellationToken);
        }

        public async Task InitializeDatabaseAsync(StarshipDbContext dbContext, ISwApiService swApiService, CancellationToken cancellationToken = default)
        {
            var sw = Stopwatch.StartNew();

            await dbContext.Database.MigrateAsync(cancellationToken);

            await SeedAsync(dbContext, swApiService, cancellationToken);

            logger.LogInformation("Database initialization completed after {ElapsedMilliseconds}ms", sw.ElapsedMilliseconds);
        }
            
        public async Task ReSeedAsync(StarshipDbContext dbContext, ISwApiService swApiService, CancellationToken cancellationToken = default)
        {
            var sw = Stopwatch.StartNew();

            await SeedAsync(dbContext, swApiService, cancellationToken);
            logger.LogInformation("Database reseeding completed after {ElapsedMilliseconds}ms", sw.ElapsedMilliseconds);
        }

        private async Task SeedAsync(StarshipDbContext dbContext, ISwApiService swApiService, CancellationToken cancellationToken)
        {
            logger.LogInformation("Seeding database");

            if (!dbContext.Starships.Any())
            {
                // Use execution strategy to handle transactions with retry logic
                var strategy = dbContext.Database.CreateExecutionStrategy();
                await strategy.ExecuteAsync(async () =>
                {
                    using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);

                    try
                    {
                        // Remove existing starships and reseed.
                        dbContext.Starships.RemoveRange(dbContext.Starships);
                        await dbContext.SaveChangesAsync(cancellationToken);

                        Console.WriteLine("Seeding starships from SWAPI...");
                        List<Starship> starships = new List<Starship>();
                        // Fetch all starships from SWAPI
                        var starshipDtos = await swApiService.GetAllStarshipsAsync();
                        // Fetch all films from SWAPI
                        var allFilms = await swApiService.GetAllFilmsAsync();
                        // Fetch all pilots from SWAPI
                        var allPilots = await swApiService.GetAllPeopleAsync();

                        foreach (var starship in starshipDtos)
                        {
                            var entity = new Starship() { };
                            entity.Id = 0; // Reset ID to let the database assign a new one
                            entity.CargoCapacity = starship.CargoCapacity;
                            entity.Consumables = starship.Consumables;
                            entity.CostInCredits = starship.CostInCredits;
                            entity.Created = starship.Created;
                            entity.Crew = starship.Crew;
                            entity.Edited = starship.Edited;
                            entity.HyperdriveRating = starship.HyperdriveRating;
                            entity.Length   = starship.Length;
                            entity.Manufacturer = starship.Manufacturer;
                            entity.MaxAtmospheringSpeed = starship.MaxAtmospheringSpeed;
                            entity.MGLT = starship.MGLT;
                            entity.Model = starship.Model;
                            entity.Name = starship.Name;
                            entity.Passengers = starship.Passengers;
                            entity.StarshipClass = starship.StarshipClass;
                            entity.Url = starship.Url;

                            // Map film URLs to names
                            entity.Films = allFilms.Where(x => starship.Films.Contains(x.Url))
                                .ToList();

                            // Map pilot URLs to names
                            entity.Pilots = allPilots.Where(x => starship.Pilots.Contains(x.Url))
                                .ToList();

                            starships.Add(entity);
                        }
                        dbContext.Starships.AddRange(starships);
                        await dbContext.SaveChangesAsync(cancellationToken);
                        await transaction.CommitAsync(cancellationToken);
                        Console.WriteLine($"Seeded {starships.Count} starships.");
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync(cancellationToken);
                        Console.WriteLine($"Error seeding starships: {ex.Message}");
                        throw;
                    }
                });
            }
        }
    }
}
