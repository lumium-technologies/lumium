# Install dependencies only when needed
FROM node:alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat bash alpine-sdk openssl-dev xz clang
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:alpine AS builder

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/lumium-space/node_modules ./lumium-space/node_modules
COPY --from=deps /app/lumium-renderer/target ./lumium-renderer/target
COPY --from=deps /app/lumium-renderer/pkg ./lumium-renderer/pkg
WORKDIR /app/lumium-space
RUN cd lumium-renderer/pkg && yarn link && cd ../../ && yarn link lumium-renderer
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:alpine AS runner

WORKDIR /app

RUN npm install --global pm2

ENV NODE_ENV production
ENV NEXT_PUBLIC_PRODUCTION true

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/lumium-space/next.config.js ./
COPY --from=builder /app/lumium-space/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/lumium-space/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/lumium-space/package.json ./package.json

USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

# Run npm start script with PM2 when container starts
CMD [ "pm2-runtime", "npm", "--", "start" ]

