# Multi-stage Dockerfile converted from Earthfile

# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

ARG NODE_ENV="production"
ENV NODE_ENV=${NODE_ENV}

# Copy package files first for better layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install all dependencies (including dev dependencies for build)
RUN npm install --global pnpm@11.22.0 \
    && pnpm install --frozen-lockfile --prod=false

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Runtime stage
FROM node:24-alpine AS runtime

WORKDIR /app

ENV NODE_ENV="production"
ENV HOSTNAME="0.0.0.0"
ENV PORT="3000"

# Copy built application from builder stage
COPY --from=builder /app/.next/standalone /app
COPY --from=builder /app/.next/static /app/.next/static
COPY --from=builder /app/public /app/public
# Content is read from disk at runtime; do not rely on output file tracing
# to have picked up every markdown file.
COPY --from=builder /app/content /app/content

# Keep the route cache writable and local to each container.
RUN mkdir -p /app/.next/server/route-cache \
    && chmod 1777 /app/.next/server/route-cache

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
