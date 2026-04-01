FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat openssl

FROM base AS deps
WORKDIR /app/website

COPY website/package.json website/package-lock.json ./
COPY website/.npmrc* ./
COPY website/prisma ./prisma

RUN npm ci && npm cache clean --force

FROM base AS builder
WORKDIR /app/website

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

COPY --from=deps /app/website/node_modules ./node_modules
COPY website .

RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/website/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/website/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/website/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/website/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/website/generated ./generated
COPY --from=builder --chown=nextjs:nodejs /app/website/package.json ./package.json

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
