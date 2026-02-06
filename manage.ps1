
# Script: manage.ps1
# Description: PowerShell replacement for Makefile functionality.
# Usage: .\manage.ps1 [command]
# Example: .\manage.ps1 build

param (
    [string]$Command = "help"
)

$IMAGE_NAME = "blog-api"
$CONTAINER_NAME = "blog-api-container"

function Show-Help {
    Write-Host "Available commands:" -ForegroundColor Cyan
    Write-Host "  .\manage.ps1 build      - Build production image"
    Write-Host "  .\manage.ps1 build-dev  - Build development image"
    Write-Host "  .\manage.ps1 up         - Start all services (docker-compose)"
    Write-Host "  .\manage.ps1 down       - Stop all services"
    Write-Host "  .\manage.ps1 logs       - View logs"
    Write-Host "  .\manage.ps1 clean      - Clean all containers and images"
    Write-Host "  .\manage.ps1 rebuild    - Rebuild and restart"
    Write-Host "  .\manage.ps1 test       - Run tests"
    Write-Host "  .\manage.ps1 shell      - Enter container shell"
    Write-Host "  .\manage.ps1 migrate    - Run database migrations"
}

switch ($Command) {
    "build" {
        Write-Host "Building production image..." -ForegroundColor Green
        docker build -t "$IMAGE_NAME`:latest" .
    }
    "build-dev" {
        Write-Host "Building development image..." -ForegroundColor Green
        docker build -f Dockerfile.dev -t "$IMAGE_NAME`:dev" .
    }
    "up" {
        Write-Host "Starting services..." -ForegroundColor Green
        docker-compose up -d
    }
    "down" {
        Write-Host "Stopping services..." -ForegroundColor Green
        docker-compose down
    }
    "logs" {
        docker-compose logs -f
    }
    "clean" {
        Write-Host "Cleaning up..." -ForegroundColor Yellow
        docker-compose down -v
        docker rmi "$IMAGE_NAME`:latest" "$IMAGE_NAME`:dev" 2>$null
    }
    "rebuild" {
        Write-Host "Rebuilding and restarting..." -ForegroundColor Green
        docker-compose down
        docker-compose build --no-cache
        docker-compose up -d
    }
    "test" {
        docker-compose exec api npm test
    }
    "shell" {
        docker-compose exec api sh
    }
    "migrate" {
        docker-compose exec api npx prisma migrate deploy
    }
    Default {
        Show-Help
    }
}
