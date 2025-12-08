# Backend Dockerfile - Build from source
FROM node:20-alpine

WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install ALL dependencies (including dev for build)
RUN npm install

# Copy source code and data
COPY src/ ./src/
COPY data/ ./data/
COPY tsconfig.json ./

# Build TypeScript
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "dist/index.js"]
