# Multi-stage Dockerfile converted from Earthfile

# Build stage
FROM node:alpine AS builder

WORKDIR /app

ARG NODE_ENV="production"
ENV NODE_ENV=${NODE_ENV}

# Copy package files first for better layer caching
COPY package-lock.json package.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --include=dev

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies to reduce size
RUN npm prune --omit=dev

# Runtime stage
FROM node:alpine AS runtime

WORKDIR /app

ENV NODE_ENV="production"

# Copy built application from builder stage
COPY --from=builder /app/.next/standalone /app
COPY --from=builder /app/.next/static /app/.next/static
COPY --from=builder /app/public /app/public

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]