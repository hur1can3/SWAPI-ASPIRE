using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace GE.SWAPI.Domain.Models
{
    public class Film
    {
        [Key]
        public int Id { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [JsonPropertyName("url")]
        [MaxLength(100)]
        public string Url { get; set; } = string.Empty;

        [JsonIgnore]
        public List<Starship> Starships { get; set; } = new();
    }
}
