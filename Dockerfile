# Base image
FROM node:22.17.0-alpine AS base
WORKDIR /app

# Install libc6-compat for Alpine compatibility
RUN apk add --no-cache libc6-compat

# Dependencies stage
FROM base AS deps
COPY package.json pnpm-lock.yaml* yarn.lock* package-lock.json* ./
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Builder stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

# Build Payload first, then Next.js
RUN \
  if [ -f yarn.lock ]; then yarn run payload build && yarn run build; \
  elif [ -f package-lock.json ]; then npm run payload build && npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run payload build && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Runner stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

# Start server
CMD ["node", "server.js"]
