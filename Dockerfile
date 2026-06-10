# syntax=docker/dockerfile:1

# ---- Build stage: full toolchain, produces dist/ (static client + server.cjs) ----
FROM node:22-alpine AS builder
WORKDIR /app

# Install all deps (incl. dev) using the lockfile for reproducible builds
COPY package.json package-lock.json ./
RUN npm ci

# Build the Vite client and bundle the Express server
COPY . .
RUN npm run build

# ---- Runtime stage: only production deps + built output ----
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# The server reads PORT from the environment; Cloud Run injects 8080 by default.
ENV PORT=8080
EXPOSE 8080

# Install production dependencies only (drops esbuild, tsx, typescript, tailwind, etc.)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy the build artifacts from the builder stage
COPY --from=builder /app/dist ./dist

# Run as the unprivileged user that ships with the node image
USER node

CMD ["node", "dist/server.cjs"]
