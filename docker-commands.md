# Docker Commands Cheatsheet

## Images
\`\`\`bash
docker images                    # List images
docker pull <image>              # Download image
docker build -t <name> .         # Build image
docker rmi <image-id>            # Remove image
docker image prune -a            # Remove unused images
\`\`\`

## Containers
\`\`\`bash
docker ps                        # Running containers
docker ps -a                     # All containers
docker run <image>               # Run container
docker run -d <image>            # Run detached
docker run -p 8080:80 <image>   # Port mapping
docker stop <container-id>       # Stop container
docker start <container-id>      # Start container
docker restart <container-id>    # Restart container
docker rm <container-id>         # Remove container
docker rm -f <container-id>      # Force remove
\`\`\`

## Logs & Debugging
\`\`\`bash
docker logs <container-id>               # View logs
docker logs -f <container-id>            # Follow logs
docker exec -it <container-id> sh        # Enter container
docker inspect <container-id>            # Container details
\`\`\`

## Networks
\`\`\`bash
docker network ls                        # List networks
docker network create <name>             # Create network
docker network connect <net> <container> # Connect to network
docker network inspect <name>            # Network details
\`\`\`

## Cleanup
\`\`\`bash
docker system prune              # Clean unused data
docker system prune -a           # Clean everything
docker container prune           # Remove stopped containers
docker volume prune              # Remove unused volumes
\`\`\`

## Our Project
\`\`\`bash
# Build API image
docker build -t blog-api .

# Run PostgreSQL
docker run --name blog-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=blog_dev \
  -p 5432:5432 \
  -d postgres:15-alpine

# Create network
docker network create blog-network
docker network connect blog-network blog-postgres

# Run API
docker run --name blog-api-container \
  --network blog-network \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://postgres:postgres@blog-postgres:5432/blog_dev" \
  -e JWT_SECRET="secret" \
  -d blog-api

# View logs
docker logs -f blog-api-container

# Stop all
docker stop blog-api-container blog-postgres

# Remove all
docker rm blog-api-container blog-postgres
docker network rm blog-network
\`\`\`