# Stage 1: Build the React Application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with Node.js Server & Cloudflare D1
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=80

COPY package*.json ./
RUN npm ci --omit=dev

# Copy built frontend static assets
COPY --from=builder /app/dist ./dist

# Copy server code and types
COPY server ./server
COPY src/types.ts ./src/types.ts

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:80/api/health || exit 1

CMD ["npx", "tsx", "server/apiServer.ts"]
