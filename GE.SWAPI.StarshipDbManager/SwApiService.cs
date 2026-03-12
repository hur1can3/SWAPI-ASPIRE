using System.Text.Json;
using GE.SWAPI.Domain.Interfaces;
using GE.SWAPI.Domain.Models;

namespace GE.SWAPI.SharshipDbManager
{
    // This service is responsible for fetching data from the SWAPI and deserializing it into our domain models.
    public class SwApiService : ISwApiService
    {
        private readonly HttpClient _httpClient;
        private const string BaseUrl = "https://swapi.info/api";

        public SwApiService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<Starship>> GetAllStarshipsAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{BaseUrl}/starships");
                var responseContent = await response.Content.ReadAsStringAsync();
                var starships = JsonSerializer.Deserialize<List<Starship>>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                return starships ?? new List<Starship>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching starships: {ex.Message}");
                return new List<Starship>();
            }
        }

        public async Task<Starship> GetStarshipByIdAsync(int id)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{BaseUrl}/starships/{id}");
                var responseContent = await response.Content.ReadAsStringAsync();
                var starship = JsonSerializer.Deserialize<Starship>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                return starship;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching starship with ID {id}: {ex.Message}");
                return null!;
            }
        }

       
        public async Task<List<Film>> GetAllFilmsAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{BaseUrl}/films");
                response.EnsureSuccessStatusCode();

                var responseContent = await response.Content.ReadAsStringAsync();
                var films = JsonSerializer.Deserialize<List<Film>>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return films ?? new List<Film>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching films: {ex.Message}");
                return new List<Film>();
            }
        }

        public async Task<List<Person>> GetAllPeopleAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{BaseUrl}/people");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var people = JsonSerializer.Deserialize<List<Person>>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return people ?? new List<Person>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching people: {ex.Message}");
                return new List<Person>();
            }
        }
    }
}
