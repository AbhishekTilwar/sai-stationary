# --- Sai Stationary API ---
FROM node:20-alpine

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy source
COPY src ./src

ENV NODE_ENV=production
EXPOSE 4000

# Drop to non-root user
USER node

CMD ["node", "src/index.js"]
