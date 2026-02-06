# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:18-slim AS dependencies

# Install OpenSSL (required for Prisma in slim images)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install ALL dependencies (dev + production)
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate


# ============================================
# Stage 2: Builder
# ============================================
FROM node:18-slim AS builder

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Copy Prisma
COPY prisma ./prisma/

# Copy source code
COPY src ./src/


# Build the application
RUN npm run build

# Remove dev dependencies
RUN npm prune --production



# ============================================
# Stage 3: Production
# ============================================
FROM node:18-slim AS production

# Install OpenSSL (required for Prisma in slim images)
RUN apt-get update -y && apt-get install -y openssl

# Set NODE_ENV
ENV NODE_ENV=production

# Create non-root user



WORKDIR /app

# Copy only production dependencies
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

# Copy Prisma
COPY --from=builder --chown=node:node /app/prisma ./prisma/

# Copy source code
# Copy built application
COPY --from=builder --chown=node:node /app/dist ./dist/

# Copy package.json (for version info)
COPY --from=builder --chown=node:node /app/package*.json ./

# Switch to non-root user
USER node

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start command
CMD ["node", "dist/src/server.js"]

# ============================================
# Stage 4: Development
# ============================================
FROM dependencies AS development

ENV NODE_ENV=development

WORKDIR /app

# Copy source
COPY src ./src/

# Expose port
EXPOSE 3000

# Development command
CMD ["npm", "run", "dev"]