using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GE.SWAPI.Domain.Models
{
    public class Starship
    {
        [Key]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("model")]
        [Required]
        [MaxLength(200)]
        public string Model { get; set; } = string.Empty;

        [JsonPropertyName("manufacturer")]
        [Required]
        [MaxLength(200)]
        public string Manufacturer { get; set; } = string.Empty;

        [JsonPropertyName("cost_in_credits")]
        [MaxLength(100)]
        public string CostInCredits { get; set; } = string.Empty;

        [JsonPropertyName("length")]
        [MaxLength(100)]
        public string Length { get; set; } = string.Empty;

        [JsonPropertyName("max_atmosphering_speed")]
        [MaxLength(100)]
        public string MaxAtmospheringSpeed { get; set; } = string.Empty;

        [JsonPropertyName("crew")]
        [MaxLength(100)]
        public string Crew { get; set; } = string.Empty;

        [JsonPropertyName("passengers")]
        [MaxLength(100)]
        public string Passengers { get; set; } = string.Empty;

        [JsonPropertyName("cargo_capacity")]
        [MaxLength(100)]
        public string CargoCapacity { get; set; } = string.Empty;

        [JsonPropertyName("consumables")]
        [MaxLength(100)]
        public string Consumables { get; set; } = string.Empty;

        [JsonPropertyName("hyperdrive_rating")]
        [MaxLength(100)]
        public string HyperdriveRating { get; set; } = string.Empty;

        [JsonPropertyName("MGLT")]
        [MaxLength(100)]
        public string MGLT { get; set; } = string.Empty;

        [JsonPropertyName("starship_class")]
        [MaxLength(100)]
        public string StarshipClass { get; set; } = string.Empty;

        [JsonPropertyName("pilots")]
        public List<Person> Pilots { get; set; } = new();

        [JsonPropertyName("films")]
        public List<Film> Films { get; set; } = new();

        [JsonPropertyName("created")]
        public DateTime Created { get; set; }

        [JsonPropertyName("edited")]
        public DateTime Edited { get; set; }

        [JsonPropertyName("url")]
        [MaxLength(100)]
        public string Url { get; set; } = string.Empty;
    }
}
