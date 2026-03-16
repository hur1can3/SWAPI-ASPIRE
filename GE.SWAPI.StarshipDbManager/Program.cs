using GE.SWAPI.Domain.Interfaces;
using GE.SWAPI.SharshipDbManager;
using GE.SWAPI.StarshipDb;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// builder.AddServiceDefaults();
builder.AddNpgsqlDbContext<StarshipDbContext>("starshipdb", null,
    optionsBuilder => optionsBuilder.UseNpgsql(npgsqlBuilder =>
        npgsqlBuilder.MigrationsAssembly(typeof(Program).Assembly.GetName().Name)));

builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing.AddSource(StarshipDbInitializer.ActivitySourceName));

builder.Services.AddScoped<ISwApiService, SwApiService>();
builder.Services.AddHttpClient<ISwApiService, SwApiService>();
builder.Services.AddSingleton<StarshipDbInitializer>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<StarshipDbInitializer>());
builder.Services.AddHealthChecks()
    .AddCheck<StarshipDbInitializerHealthCheck>("DbInitializer", null);

var app = builder.Build();


app.MapPost("/reset-db", async (StarshipDbContext dbContext, ISwApiService swApiService, StarshipDbInitializer dbInitializer, CancellationToken cancellationToken) =>
{
    // Delete and recreate the database. This is useful for development scenarios to reset the database to its initial state.
    await dbContext.Database.EnsureDeletedAsync(cancellationToken);
    await dbInitializer.InitializeDatabaseAsync(dbContext, swApiService, cancellationToken);
});


app.MapPost("/seed-db", async (StarshipDbContext dbContext, ISwApiService swApiService, StarshipDbInitializer dbInitializer, CancellationToken cancellationToken) =>
{
    await dbInitializer.ReSeedAsync(dbContext, swApiService, cancellationToken);
});

await app.RunAsync();