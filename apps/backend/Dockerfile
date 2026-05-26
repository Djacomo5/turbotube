# Use a lightweight node image
FROM node:20-slim

# Install system dependencies: ffmpeg, python3 (required for yt-dlp) and curl
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp binary from official source
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

# Set working directory to the monorepo root
WORKDIR /app

# Copy root workspaces configurations
COPY package*.json tsconfig.json ./

# Copy package structures
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

# Install dependencies (ignoring peer conflicts for Next/React 19)
RUN npm install --legacy-peer-deps

# Build the shared packages and the Fastify backend app
RUN npm run build:shared
RUN npm run build:backend

# Set production configurations
ENV NODE_ENV=production
ENV PORT=4000
ENV HOST=0.0.0.0

# Expose the server port
EXPOSE 4000

# Start command
CMD ["npm", "start", "-w", "apps/backend"]
