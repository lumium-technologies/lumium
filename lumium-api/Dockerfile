# Install dependencies only when needed
FROM node:alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat bash alpine-sdk xz clang
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:alpine AS builder

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/lumium-api/node_modules ./lumium-api/node_modules
COPY --from=deps /app/lumium-api/routes ./lumium-api/routes
COPY --from=deps /app/lumium-api/types ./lumium-api/types
WORKDIR /app/lumium-api
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:alpine AS runner

WORKDIR /app

RUN npm install --global pm2

ENV NODE_ENV production
ENV PRODUCTION true

RUN addgroup -g 1001 -S nodejs
RUN adduser -S expressjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder --chown=expressjs:nodejs /app/lumium-api ./
COPY --from=builder /app/node_modules ./node_modules

USER expressjs

EXPOSE 5000

# Run npm start script with PM2 when container starts
CMD [ "pm2-runtime", "npm", "--", "start" ]

