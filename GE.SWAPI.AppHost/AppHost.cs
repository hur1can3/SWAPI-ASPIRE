using Google.Protobuf.WellKnownTypes;

var builder = DistributedApplication.CreateBuilder(args);

builder.AddAzureAppServiceEnvironment("app-service-env");

var postgres = builder.AddPostgres("postgres")
    .WithPgAdmin()
    .WithLifetime(ContainerLifetime.Persistent);

if (builder.ExecutionContext.IsRunMode)
{
    // Data volumes don't work on ACA for Postgres so only add when running
    postgres.WithDataVolume();
}

var starshipDb = postgres.AddDatabase("starshipdb");

var starshipDbManager = builder.AddProject<Projects.GE_SWAPI_StarshipDbManager>("starshipdbmanager")
    .WithReference(starshipDb)
    .WaitFor(starshipDb)
    .WithHttpHealthCheck("/health")
    .WithHttpCommand("/reset-db", "Reset Database", commandOptions: new() { IconName = "DatabaseLightning" });

var apiService = builder.AddProject<Projects.GE_SWAPI_ApiService>("apiservice")
    .WithReference(starshipDb)
    .WaitFor(starshipDb)
    .WithExternalHttpEndpoints()
    .WithHttpsEndpoint(name: "api")
    .WithUrlForEndpoint("api", url => url.Url = "/api"); 

builder.AddProject<Projects.GE_SWAPI_Web>("webfrontend-blazor")
    .WithExternalHttpEndpoints()
    .WithHttpHealthCheck("/health")
    .WithReference(apiService)
    .WaitFor(apiService);

var webfrontend = builder.AddViteApp("webfrontend-react", "../GE.SWAPI.Frontend")
    .WithReference(apiService)
    .WaitFor(apiService)
    // Use ReferenceExpression to combine the Endpoint and the path string
    .WithEnvironment("VITE_API_URL", ReferenceExpression.Create($"{apiService.GetEndpoint("api")}/api"))
    .WithEnvironment("BROWSER", "none");



apiService.PublishWithContainerFiles(webfrontend, "wwwroot");


builder.Build().Run();
