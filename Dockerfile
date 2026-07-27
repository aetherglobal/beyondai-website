# Requires `output: 'standalone'` in next.config.ts, which is NOT currently set.
FROM node:22.17.0-alpine AS base

FROM base AS deps
# libc6-compat: https://github.com/nodejs/docker-node/tree/main#nodealpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json bun.lock* yarn.lock* package-lock.json* ./
RUN \
  if [ -f bun.lock ]; then npm i -g bun && bun install --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN \
  if [ -f bun.lock ]; then npm i -g bun && bun run build; \
  elif [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# server.js comes from next build's standalone output, not from this repo.
CMD HOSTNAME="0.0.0.0" node server.js
