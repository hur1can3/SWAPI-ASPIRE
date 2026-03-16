using System.Net;
using System.Net.Http.Json;
using GE.SWAPI.ApiService.Models;
using GE.SWAPI.Domain.Models;
using Microsoft.Extensions.Logging;

namespace GE.SWAPI.Tests;

public class StarshipControllerTests : IClassFixture<StarshipControllerTestFixture>
{
    private readonly StarshipControllerTestFixture _fixture;

    public StarshipControllerTests(StarshipControllerTestFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task GetAllStarships_ReturnsOkStatusCode()
    {
        // Arrange
        var httpClient = _fixture.HttpClient;

        // Act
        var response = await httpClient.GetAsync("/api/starship");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var starships = await response.Content.ReadFromJsonAsync<List<Starship>>();
        Assert.NotNull(starships);
        Assert.NotEmpty(starships);
    }

    [Fact]
    public async Task GetStarshipsPaged_ReturnsPagedResults()
    {
        // Arrange
        var httpClient = _fixture.HttpClient;

        // Act
        var response = await httpClient.GetAsync("/api/starship/paged?page=1&pageSize=5");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var pagedResult = await response.Content.ReadFromJsonAsync<PagedResult<Starship>>();
        Assert.NotNull(pagedResult);
        Assert.NotNull(pagedResult.Data);
        Assert.True(pagedResult.Data.Count <= 5);
        Assert.Equal(1, pagedResult.Page);
        Assert.Equal(5, pagedResult.PageSize);
        Assert.True(pagedResult.TotalRecords > 0);
    }

    [Fact]
    public async Task GetStarshipsPaged_WithSearchTerm_ReturnsFilteredResults()
    {
        // Arrange
        var httpClient = _fixture.HttpClient;

        // Act
        var response = await httpClient.GetAsync("/api/starship/paged?page=1&pageSize=10&searchTerm=star");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var pagedResult = await response.Content.ReadFromJsonAsync<PagedResult<Starship>>();
        Assert.NotNull(pagedResult);
        Assert.NotNull(pagedResult.Data);
        
        // Verify that all results contain "star" somewhere
        foreach (var starship in pagedResult.Data)
        {
            var containsSearchTerm = 
                starship.Name?.Contains("star", StringComparison.OrdinalIgnoreCase) == true ||
                starship.Model?.Contains("star", StringComparison.OrdinalIgnoreCase) == true ||
                starship.Manufacturer?.Contains("star", StringComparison.OrdinalIgnoreCase) == true ||
                starship.StarshipClass?.Contains("star", StringComparison.OrdinalIgnoreCase) == true;
            
            Assert.True(containsSearchTerm);
        }
    }

    [Fact]
    public async Task GetStarshipsPaged_WithSorting_ReturnsSortedResults()
    {
        // Arrange
        var httpClient = _fixture.HttpClient;

        // Act
        var response = await httpClient.GetAsync("/api/starship/paged?page=1&pageSize=10&sortColumn=name&sortDirection=asc");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var pagedResult = await response.Content.ReadFromJsonAsync<PagedResult<Starship>>();
        Assert.NotNull(pagedResult);
        Assert.NotNull(pagedResult.Data);
        
        // Verify that results are sorted by name
        var names = pagedResult.Data.Select(s => s.Name).ToList();
        var sortedNames = names.OrderBy(n => n).ToList();
        Assert.Equal(sortedNames, names);
    }

    [Fact]
    public async Task GetStarshipById_WithValidId_ReturnsStarship()
    {
        // Arrange
        var httpClient = _fixture.HttpClient;

        // First get all starships to get a valid ID
        var allResponse = await httpClient.GetAsync("/api/starship");
        var starships = await allResponse.Content.ReadFromJsonAsync<List<Starship>>();
        Assert.NotNull(starships);
        Assert.NotEmpty(starships);
        
        var firstStarshipId = starships[0].Id;

        // Act
        var response = await httpClient.GetAsync($"/api/starship/{firstStarshipId}");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var starship = await response.Content.ReadFromJsonAsync<Starship>();
        Assert.NotNull(starship);
        Assert.Equal(firstStarshipId, starship.Id);
    }

    [Fact]
    public async Task GetStarshipById_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var httpClient = _fixture.HttpClient;

        // Act
        var response = await httpClient.GetAsync("/api/starship/99999");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task AddStarship_WithValidStarship_ReturnsCreated()
    {
        // Arrange
        var httpClient = _fixture.HttpClient;

        var newStarship = new Starship
        {
            Name = "Test Starship",
            Model = "Test Model X-1",
            Manufacturer = "Test Industries",
            CostInCredits = "1000000",
            Length = "100",
            MaxAtmospheringSpeed = "1000",
            Crew = "5",
            Passengers = "10",
            CargoCapacity = "50000",
            Consumables = "1 month",
            HyperdriveRating = "2.0",
            MGLT = "80",
            StarshipClass = "Test Class",
            Created = DateTime.UtcNow,
            Edited = DateTime.UtcNow,
            Url = "https://swapi.dev/api/starships/test/"
        };

        // Act
        var response = await httpClient.PostAsJsonAsync("/api/starship", newStarship);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var createdStarship = await response.Content.ReadFromJsonAsync<Starship>();
        Assert.NotNull(createdStarship);
        Assert.True(createdStarship.Id > 0);
        Assert.Equal(newStarship.Name, createdStarship.Name);
        Assert.Equal(newStarship.Model, createdStarship.Model);
    }

    [Fact]
    public async Task AddStarship_WithInvalidStarship_ReturnsBadRequest()
    {
        // Arrange
        var httpClient = _fixture.HttpClient;

        // Missing required fields (Name, Model, Manufacturer)
        var invalidStarship = new Starship
        {
            CostInCredits = "1000000"
        };

        // Act
        var response = await httpClient.PostAsJsonAsync("/api/starship", invalidStarship);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task UpdateStarship_WithValidData_ReturnsOk()
    {
        // Arrange
        var httpClient = _fixture.HttpClient;

        // First create a starship
        var newStarship = new Starship
        {
            Name = "Update Test Starship",
            Model = "Update Model X-1",
            Manufacturer = "Update Industries",
            CostInCredits = "1000000",
            Length = "100",
            MaxAtmospheringSpeed = "1000",
            Crew = "5",
            Passengers = "10",
            CargoCapacity = "50000",
            Consumables = "1 month",
            HyperdriveRating = "2.0",
            MGLT = "80",
            StarshipClass = "Test Class",
            Created = DateTime.UtcNow,
            Edited = DateTime.UtcNow,
            Url = "https://swapi.dev/api/starships/test/"
        };

        var createResponse = await httpClient.PostAsJsonAsync("/api/starship", newStarship);
        var createdStarship = await createResponse.Content.ReadFromJsonAsync<Starship>();
        Assert.NotNull(createdStarship);

        // Update the starship
        createdStarship.Name = "Updated Starship Name";
        createdStarship.Model = "Updated Model X-2";

        // Act
        var response = await httpClient.PutAsJsonAsync($"/api/starship/{createdStarship.Id}", createdStarship);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var updatedStarship = await response.Content.ReadFromJsonAsync<Starship>();
        Assert.NotNull(updatedStarship);
        Assert.Equal("Updated Starship Name", updatedStarship.Name);
        Assert.Equal("Updated Model X-2", updatedStarship.Model);
    }

    [Fact]
    public async Task DeleteStarship_WithValidId_ReturnsNoContent()
    {
        // Arrange
        var httpClient = _fixture.HttpClient;

        // First create a starship
        var newStarship = new Starship
        {
            Name = "Delete Test Starship",
            Model = "Delete Model X-1",
            Manufacturer = "Delete Industries",
            CostInCredits = "1000000",
            Length = "100",
            MaxAtmospheringSpeed = "1000",
            Crew = "5",
            Passengers = "10",
            CargoCapacity = "50000",
            Consumables = "1 month",
            HyperdriveRating = "2.0",
            MGLT = "80",
            StarshipClass = "Test Class",
            Created = DateTime.UtcNow,
            Edited = DateTime.UtcNow,
            Url = "https://swapi.dev/api/starships/test/"
        };

        var createResponse = await httpClient.PostAsJsonAsync("/api/starship", newStarship);
        var createdStarship = await createResponse.Content.ReadFromJsonAsync<Starship>();
        Assert.NotNull(createdStarship);

        // Act
        var response = await httpClient.DeleteAsync($"/api/starship/{createdStarship.Id}");

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        // Verify it's deleted
        var getResponse = await httpClient.GetAsync($"/api/starship/{createdStarship.Id}");
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }
}

public class StarshipControllerTestFixture : IAsyncLifetime
{
    private Aspire.Hosting.DistributedApplication? _app;
    private static readonly TimeSpan DefaultTimeout = TimeSpan.FromMinutes(5);

    public HttpClient HttpClient { get; private set; } = null!;

    public async ValueTask InitializeAsync()
    {
        var cancellationToken = TestContext.Current.CancellationToken;

        var appHost = await DistributedApplicationTestingBuilder.CreateAsync<Projects.GE_SWAPI_AppHost>(cancellationToken);
        appHost.Services.ConfigureHttpClientDefaults(clientBuilder =>
        {
            clientBuilder.AddStandardResilienceHandler();
        });

        _app = await appHost.BuildAsync(cancellationToken).WaitAsync(DefaultTimeout, cancellationToken);
        await _app.StartAsync(cancellationToken).WaitAsync(DefaultTimeout, cancellationToken);

        HttpClient = _app.CreateHttpClient("apiservice");
        await _app.ResourceNotifications.WaitForResourceHealthyAsync("apiservice", cancellationToken).WaitAsync(DefaultTimeout, cancellationToken);
    }

    public async ValueTask DisposeAsync()
    {
        if (_app is not null)
        {
            await _app.DisposeAsync();
        }
        HttpClient?.Dispose();
    }
}
