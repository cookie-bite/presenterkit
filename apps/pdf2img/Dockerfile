FROM mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim AS build
WORKDIR /src

COPY ["pdf2img.csproj", "./"]
RUN dotnet restore "pdf2img.csproj"

COPY . .
RUN dotnet publish "pdf2img.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim AS final
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl libfontconfig1 \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "pdf2img.dll"]
