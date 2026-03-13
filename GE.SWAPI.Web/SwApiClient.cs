using GE.SWAPI.Domain.Models;
using System.Net;

namespace GE.SWAPI.Web;

public class SwApiClient(HttpClient httpClient)
{
    public async Task<Starship[]> GetStarships(int maxItems = 50, CancellationToken cancellationToken = default)
    {
        try
        {
            List<Starship>? starships = null;

            await foreach (var starship in httpClient.GetFromJsonAsAsyncEnumerable<Starship>("/starship", cancellationToken))
            {
                if (starships?.Count >= maxItems)
                {
                    break;
                }
                if (starship is not null)
                {
                    starships ??= [];
                    starships.Add(starship);
                }
            }

            return starships?.ToArray() ?? [];
        }
        catch (HttpRequestException ex)
        {
            throw new HttpRequestException($"Failed to retrieve starships from the API: {ex.Message}", ex);
        }
        catch (Exception ex)
        {
            throw new Exception($"An unexpected error occurred while fetching starships: {ex.Message}", ex);
        }
    }

    public async Task<Starship?> GetStarshipById(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var starship = await httpClient.GetFromJsonAsync<Starship>($"/starship/{id}", cancellationToken);

            if (starship == null)
            {
                throw new KeyNotFoundException($"Starship with ID {id} not found.");
            }

            return starship;
        }
        catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            throw new KeyNotFoundException($"Starship with ID {id} not found.", ex);
        }
        catch (HttpRequestException ex)
        {
            throw new HttpRequestException($"Failed to retrieve starship {id} from the API: {ex.Message}", ex);
        }
        catch (KeyNotFoundException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new Exception($"An unexpected error occurred while fetching starship {id}: {ex.Message}", ex);
        }
    }

    public async Task<Starship?> CreateStarship(Starship starship, CancellationToken cancellationToken = default)
    {
        if (starship == null)
        {
            throw new ArgumentNullException(nameof(starship), "Starship cannot be null.");
        }

        if (string.IsNullOrWhiteSpace(starship.Name))
        {
            throw new ArgumentException("Starship name is required.", nameof(starship));
        }

        try
        {
            var response = await httpClient.PostAsJsonAsync("/starship", starship, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
                throw new HttpRequestException($"Failed to create starship. Status: {response.StatusCode}. Error: {errorContent}");
            }

            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<Starship>(cancellationToken);
        }
        catch (HttpRequestException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new Exception($"An unexpected error occurred while creating starship: {ex.Message}", ex);
        }
    }

    public async Task<Starship?> UpdateStarship(int id, Starship starship, CancellationToken cancellationToken = default)
    {
        if (starship == null)
        {
            throw new ArgumentNullException(nameof(starship), "Starship cannot be null.");
        }

        if (string.IsNullOrWhiteSpace(starship.Name))
        {
            throw new ArgumentException("Starship name is required.", nameof(starship));
        }

        if (id <= 0)
        {
            throw new ArgumentException("Invalid starship ID.", nameof(id));
        }

        try
        {
            var response = await httpClient.PutAsJsonAsync($"/starship/{id}", starship, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);

                if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    throw new KeyNotFoundException($"Starship with ID {id} not found.");
                }

                throw new HttpRequestException($"Failed to update starship. Status: {response.StatusCode}. Error: {errorContent}");
            }

            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<Starship>(cancellationToken);
        }
        catch (HttpRequestException)
        {
            throw;
        }
        catch (KeyNotFoundException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new Exception($"An unexpected error occurred while updating starship {id}: {ex.Message}", ex);
        }
    }

    public async Task<bool> DeleteStarship(int id, CancellationToken cancellationToken = default)
    {
        if (id <= 0)
        {
            throw new ArgumentException("Invalid starship ID.", nameof(id));
        }

        try
        {
            var response = await httpClient.DeleteAsync($"/starship/{id}", cancellationToken);

            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                throw new KeyNotFoundException($"Starship with ID {id} not found.");
            }

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
                throw new HttpRequestException($"Failed to delete starship. Status: {response.StatusCode}. Error: {errorContent}");
            }

            return response.IsSuccessStatusCode;
        }
        catch (HttpRequestException)
        {
            throw;
        }
        catch (KeyNotFoundException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new Exception($"An unexpected error occurred while deleting starship {id}: {ex.Message}", ex);
        }
    }
}
