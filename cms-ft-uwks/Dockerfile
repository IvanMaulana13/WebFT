# =========================
# Stage 1: Dependencies
# =========================
FROM oven/bun:1 AS deps

WORKDIR /app

COPY package.json bun.lock* ./

RUN bun install --frozen-lockfile


# =========================
# Stage 2: Build
# =========================
FROM oven/bun:1 AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN bun run build


# =========================
# Stage 3: Production Runner (Node 22 Bookworm Slim)
# =========================
FROM node:22-bookworm-slim AS runner

WORKDIR /app

# Install curl for HEALTHCHECK and runtime health probes
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Fix symlink bun-node-fallback-bin/node -> /usr/local/bin/bun
# Ensures any script, tool, or fallback looking for bun or node shim resolves to Node 22
RUN mkdir -p /usr/local/bun-node-fallback-bin && \
    ln -sf /usr/local/bin/node /usr/local/bun-node-fallback-bin/node && \
    ln -sf /usr/local/bin/node /usr/local/bin/bun

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV AUTH_SECRET=2057f5a082839c05c12c2fe14aa487ff553144dc7c49d41fd107336f6c182bec
ENV NEXTAUTH_SECRET=2057f5a082839c05c12c2fe14aa487ff553144dc7c49d41fd107336f6c182bec
ENV AUTH_TRUST_HOST=true

# Copy standalone build output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy .env file directly into application directory
COPY .env .env

# Ensure complete next package in node_modules (server.js requires 'next', never trim partially)
COPY --from=builder /app/node_modules/next ./node_modules/next

# Ensure public uploads directory exists for persistent upload storage
RUN mkdir -p ./public/uploads

# Fix any dangling symlinks in /app pointing to bun
RUN find /app -lname "*bun*" -exec ln -sf /usr/local/bin/node {} + 2>/dev/null || true

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://127.0.0.1:${PORT:-3000}/api/auth/session || exit 1

CMD ["node", "server.js"]