var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
    .WithPgAdmin()
    .WithLifetime(ContainerLifetime.Persistent);

if (builder.ExecutionContext.IsRunMode)
{
    // Data volumes don't work on ACA for Postgres so only add when running
    postgres.WithDataVolume();
}

var starshipDb = postgres.AddDatabase("starshipdb");

var catalogDbManager = builder.AddProject<Projects.GE_SWAPI_StarshipDbManager>("starshipdbmanager")
    .WithReference(starshipDb)
    .WaitFor(starshipDb)
    .WithHttpHealthCheck("/health")
    .WithHttpCommand("/reset-db", "Reset Database", commandOptions: new() { IconName = "DatabaseLightning" });

var apiService = builder.AddProject<Projects.GE_SWAPI_ApiService>("apiservice");

builder.AddProject<Projects.GE_SWAPI_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithHttpHealthCheck("/health")
    .WithReference(apiService)
    .WaitFor(apiService);

builder.Build().Run();
