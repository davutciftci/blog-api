.PHONY: build run stop clean logs help

# Variables
IMAGE_NAME=blog-api
CONTAINER_NAME=blog-api-container

# Build optimized image
build:
	docker build -t $(IMAGE_NAME):latest .

# Build development image
build-dev:
	docker build -f Dockerfile.dev -t $(IMAGE_NAME):dev .

# Run with docker-compose
up:
	docker-compose up -d

# Stop docker-compose
down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# Clean everything
clean:
	docker-compose down -v
	docker rmi $(IMAGE_NAME):latest $(IMAGE_NAME):dev || true

# Rebuild and restart
rebuild:
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

# Run tests in container
test:
	docker-compose exec api npm test

# Enter container shell
shell:
	docker-compose exec api sh

# Database migrations
migrate:
	docker-compose exec api npx prisma migrate deploy

# Show help
help:
	@echo "Available commands:"
	@echo "  make build      - Build production image"
	@echo "  make build-dev  - Build development image"
	@echo "  make up         - Start all services"
	@echo "  make down       - Stop all services"
	@echo "  make logs       - View logs"
	@echo "  make clean      - Clean all containers and images"
	@echo "  make rebuild    - Rebuild and restart"
	@echo "  make test       - Run tests"
	@echo "  make shell      - Enter container shell"
	@echo "  make migrate    - Run database migrations"