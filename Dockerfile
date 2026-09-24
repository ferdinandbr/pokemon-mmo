# ==============================================================================
# PokeMMO - Unified Multi-Stage Dockerfile for Dokploy
# ==============================================================================

# ── Stage 1: Build Frontend (Vite + Phaser) ──
FROM node:20-alpine AS client-builder

WORKDIR /client

# Install dependencies
COPY client/package*.json ./
RUN npm install

# Build production bundle
COPY client/ ./
RUN npm run build

# ── Stage 2: Backend & Production Server ──
FROM node:20-alpine AS runner

WORKDIR /app

# Install native dependencies for Prisma and healthcheck
RUN apk add --no-cache openssl wget

# Install server dependencies
COPY server/package*.json ./
COPY server/prisma/ ./prisma/
RUN npm install

# Copy backend source code
COPY server/ ./

# Generate Prisma Client for PostgreSQL
RUN npx prisma generate

# Copy built frontend assets into server public directory
COPY --from=client-builder /client/dist /app/public

# Environment Configuration
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Healthcheck for Dokploy / Traefik
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
