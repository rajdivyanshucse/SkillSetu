# ==========================================
# SkillSetu Core Backend Dockerfile
# Multi-stage production container for Node.js Express API & Prisma ORM
# ==========================================

FROM node:20-alpine AS base

# Install OpenSSL for Prisma engine compatibility on Alpine Linux
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy dependency manifests & Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (including Prisma CLI for migrations)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy application source code
COPY src ./src

# Create non-root user permissions
RUN chown -R node:node /app

USER node

EXPOSE 5000

ENV PORT=5000 \
    NODE_ENV=production

HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 5000) + '/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1));"

CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
