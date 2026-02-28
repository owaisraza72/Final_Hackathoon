# ─────────────────────────────────────────
# Stage 1: Base — Install dependencies
# ─────────────────────────────────────────
FROM node:20-alpine AS base

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy package files first (better layer caching)
COPY package.json package-lock.json* ./

# ─────────────────────────────────────────
# Stage 2: Development
# ─────────────────────────────────────────
FROM base AS development

RUN npm install

COPY . .

# Don't run as root
USER appuser

EXPOSE 5000

CMD ["npm", "run", "dev"]

# ─────────────────────────────────────────
# Stage 3: Production dependencies only
# ─────────────────────────────────────────
FROM base AS prod-deps

RUN npm ci --only=production && npm cache clean --force

# ─────────────────────────────────────────
# Stage 4: Production
# ─────────────────────────────────────────
FROM node:20-alpine AS production

# Security hardening
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Disable npm update notifier & reduce noise
ENV NODE_ENV=production
ENV NPM_CONFIG_UPDATE_NOTIFIER=false

WORKDIR /app

# Copy production dependencies
COPY --from=prod-deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Remove unnecessary files
RUN rm -rf .env .env.* .git .gitignore tests coverage

# Own everything by appuser
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/v1/health || exit 1

CMD ["node", "src/server.js"]