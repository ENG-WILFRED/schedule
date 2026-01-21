# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Install dependencies
RUN npm ci --only=production && \
    npm ci --legacy-peer-deps || npm ci

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build Next.js
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Copy package files
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Install all dependencies (including prisma CLI)
RUN npm ci && npm ci --legacy-peer-deps || npm ci

# Copy prisma schema from builder
COPY --from=builder /app/prisma ./prisma/

# Copy .next from builder
COPY --from=builder /app/.next ./.next


# Copy node_modules from builder to ensure Prisma Client and all dependencies are available
COPY --from=builder /app/node_modules ./node_modules

# Copy entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Use dumb-init to handle signals
ENTRYPOINT ["dumb-init", "--"]
CMD ["/app/entrypoint.sh"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

