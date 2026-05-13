# ============================================================================
# Multi-stage build for Risk Service
# ============================================================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy workspace files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy service files
COPY services/risk-service ./services/risk-service
COPY packages/database ./packages/database

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build
RUN cd services/risk-service && pnpm build

# Generate Prisma client
RUN cd packages/database && pnpm generate

# ============================================================================
# Stage 2: Runtime
# ============================================================================

FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy package files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy built application
COPY --from=builder /app/services/risk-service/dist ./services/risk-service/dist
COPY --from=builder /app/services/risk-service/package.json ./services/risk-service/
COPY --from=builder /app/packages/database ./packages/database

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

USER nestjs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Expose port
EXPOSE 3001

# Start application
CMD ["node", "services/risk-service/dist/main.js"]
