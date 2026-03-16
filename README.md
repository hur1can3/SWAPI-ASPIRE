# SWAPI-ASPIRE 

SWAPI-ASPIRE is a sample app that demonstrates how to build a microservices-based application using the Aspire framework. 
The app is a simple catalog of starships from the Star Wars universe, allowing users to view, add, edit, and delete starships.

The app consists of these .NET services:

- **GE.SWAPI.Frontend**: This is an react.js app that displays a paginated table of starships and allows users to add/delete/edit starships.
- **GE.SWAPI.ApiService**: This is an HTTP API server that provides access to the catalog of starships stored in a PostgreSQL database.
- **GE.SWAPI.Application**: This is an Business Application Service Layer that provides access to the starships stored in a PostgreSQL database.
- **GE.SWAPI.Domain**: This is an Business Application Service Layer that provides access to the starships stored in a PostgreSQL database.
- **GE.SWAPI.StarshipDbManager**: This is an HTTP API that manages the initialization and updating of the starship database.
- **GE.SWAPI.StarshipDb**: This is an Entity Framework Core project managing the dbcontext with relationships/confiugration for the starship database.
- **GE.SWAPI.Web**: This is an ASP.NET Core Blazor app that displays a paginated table of starships and allows users to add/delete/edit starships.

The app also includes a .NET class library project, **GE.SWAPI.ServiceDefaults**, that contains the code-based defaults used by the .NET service projects.

## Prerequisites

- [Aspire development environment](https://aspire.dev/get-started/prerequisites/)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8)

## Running the app

If using the Aspire CLI, run `aspire run` from this directory.

If using VS Code, open this directory as a workspace and launch the `GE.SWAPI.AppHost` project using either the Aspire or C# debuggers.

If using Visual Studio, open the solution file `GE.SWAPI.slnx` and launch/debug the `GE.SWAPI.AppHost` project.

If using the .NET CLI, run `dotnet run` from the `GE.SWAPI.AppHost` directory.