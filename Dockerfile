# Production-optimized Dockerfile for Bun + Express + TypeScript
# Multi-stage build for smaller image size

# Stage 1: Dependencies
FROM oven/bun:1.1-alpine AS dependencies

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install production dependencies only
RUN bun install --production --frozen-lockfile

# Stage 2: Build
FROM oven/bun:1.1-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install all dependencies (including dev dependencies)
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build application (if you have a build step)
# RUN bun run build

# Stage 3: Production
FROM oven/bun:1.1-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Set production environment
ENV NODE_ENV=production \
    PORT=3000

# Copy production dependencies from dependencies stage
COPY --from=dependencies --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application files
COPY --chown=nodejs:nodejs package.json ./
COPY --chown=nodejs:nodejs src ./src
COPY --chown=nodejs:nodejs tsconfig.json ./

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD bun run -e 'await fetch("http://localhost:3000/health").then(r => r.ok || process.exit(1))'

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["bun", "run", "start"]

