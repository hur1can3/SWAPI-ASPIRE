using GE.SWAPI.Application.Services;
using GE.SWAPI.Domain.Interfaces;
using GE.SWAPI.StarshipDb;
using GE.SWAPI.StarshipDb.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


//builder.Services.AddDbContext<StarshipDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("SWAPI_db")));

//builder.AddAzureNpgsqlDbContext<StarshipDbContext>(connectionName: "postgresdb");

builder.AddNpgsqlDbContext<StarshipDbContext>("starshipdb", null,
    optionsBuilder => optionsBuilder.UseNpgsql());
// Add CORS policy
var specificAllowSpecificOrigins = "_specificAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: specificAllowSpecificOrigins,
        policy =>
        {
            policy.AllowAnyOrigin() // React app host will be different from the API host, so allow any origin for simplicity. In production, consider restricting this to specific origins.
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddScoped<IStarshipRepository, StarshipRepository>();
builder.Services.AddScoped<IStarshipService, StarshipService>();


var app = builder.Build();

app.MapDefaultEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(specificAllowSpecificOrigins);

// app.UseAuthorization(); // Commented out - no authentication configured
app.UseFileServer(); // needed to host javascript wwwroot for the web frontend
app.MapControllers();

app.Run();
