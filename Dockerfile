# ---------------------------
# Base & Deps
# ---------------------------
FROM node:22.17.0-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# ---------------------------
# Builder stage
# ---------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG PAYLOAD_SECRET
ARG DATABASE_URL

ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV DATABASE_URL=$DATABASE_URL
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# COMPILE ONLY: This creates the server files without connecting to the DB
RUN corepack enable pnpm && pnpm next build --experimental-build-mode compile

# ---------------------------
# Runner stage
# ---------------------------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copy the build outputs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Copy package.json to access scripts for the 'generate' step
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# RUNTIME COMMAND: 
# 1. Generate static pages (DB is now accessible)
# 2. Start the server
CMD ["sh", "-c", "node server.js --experimental-build-mode generate && node server.js"]
