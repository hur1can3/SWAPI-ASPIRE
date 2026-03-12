using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace GE.SWAPI.StarshipDbManager.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Films",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Url = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Films", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "People",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Url = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_People", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Starships",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Model = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Manufacturer = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CostInCredits = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Length = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    MaxAtmospheringSpeed = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Crew = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Passengers = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CargoCapacity = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Consumables = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    HyperdriveRating = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    MGLT = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    StarshipClass = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Created = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Edited = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Url = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Starships", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StarshipFilms",
                columns: table => new
                {
                    FilmsId = table.Column<int>(type: "integer", nullable: false),
                    StarshipsId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StarshipFilms", x => new { x.FilmsId, x.StarshipsId });
                    table.ForeignKey(
                        name: "FK_StarshipFilms_Films_FilmsId",
                        column: x => x.FilmsId,
                        principalTable: "Films",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StarshipFilms_Starships_StarshipsId",
                        column: x => x.StarshipsId,
                        principalTable: "Starships",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StarshipPilots",
                columns: table => new
                {
                    PilotsId = table.Column<int>(type: "integer", nullable: false),
                    StarshipsId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StarshipPilots", x => new { x.PilotsId, x.StarshipsId });
                    table.ForeignKey(
                        name: "FK_StarshipPilots_People_PilotsId",
                        column: x => x.PilotsId,
                        principalTable: "People",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StarshipPilots_Starships_StarshipsId",
                        column: x => x.StarshipsId,
                        principalTable: "Starships",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Films_Title",
                table: "Films",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_People_Name",
                table: "People",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_StarshipFilms_StarshipsId",
                table: "StarshipFilms",
                column: "StarshipsId");

            migrationBuilder.CreateIndex(
                name: "IX_StarshipPilots_StarshipsId",
                table: "StarshipPilots",
                column: "StarshipsId");

            migrationBuilder.CreateIndex(
                name: "IX_Starships_Manufacturer",
                table: "Starships",
                column: "Manufacturer");

            migrationBuilder.CreateIndex(
                name: "IX_Starships_Name",
                table: "Starships",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Starships_StarshipClass",
                table: "Starships",
                column: "StarshipClass");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StarshipFilms");

            migrationBuilder.DropTable(
                name: "StarshipPilots");

            migrationBuilder.DropTable(
                name: "Films");

            migrationBuilder.DropTable(
                name: "People");

            migrationBuilder.DropTable(
                name: "Starships");
        }
    }
}
