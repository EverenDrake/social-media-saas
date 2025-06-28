# Multi-stage build for production
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production && npm cache clean --force

# Install client dependencies
COPY client/package*.json ./client/
RUN cd client && npm ci --only=production && npm cache clean --force

# Build the client
FROM base AS client-builder
WORKDIR /app
COPY client/ ./client/
COPY --from=deps /app/client/node_modules ./client/node_modules
RUN cd client && npm run build

# Production server image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy server files and dependencies
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY server/ ./server/
COPY --from=client-builder /app/client/build ./client/build

# Create uploads directory
RUN mkdir -p /app/server/uploads && chown nodejs:nodejs /app/server/uploads

# Serve static files from client build
RUN mkdir -p /app/server/public && cp -r ./client/build/* ./server/public/

USER nodejs

EXPOSE 5000

ENV PORT 5000

# Start the server
CMD ["node", "server/index.js"]
