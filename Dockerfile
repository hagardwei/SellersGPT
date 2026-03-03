# ---------------------------
# Base image
# ---------------------------
FROM node:22.17.0-alpine AS base
WORKDIR /app

# Install libc6-compat for Alpine compatibility
RUN apk add --no-cache libc6-compat

# ---------------------------
# Dependencies stage
# ---------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml* yarn.lock* package-lock.json* ./

RUN \
if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
elif [ -f package-lock.json ]; then npm ci --legacy-peer-deps; \
elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
else echo "Lockfile not found." && exit 1; \
fi

# ---------------------------
# Builder stage
# ---------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

# Run Payload type generation, then Next.js build
RUN \
if [ -f yarn.lock ]; then yarn run generate:types && yarn run build; \
elif [ -f package-lock.json ]; then npm run generate:types && npm run build; \
elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run generate:types && pnpm run build; \
else echo "Lockfile not found." && exit 1; \
fi

# ---------------------------
# Runner stage
# ---------------------------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
&& adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

# Start Next.js server
CMD ["node", "server.js"]