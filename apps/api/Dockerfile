FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and workspace manifests
COPY package.json ./
COPY packages/database ./packages/database
COPY apps/api ./apps/api

# Install dependencies and build
RUN npm install
RUN npm --workspace=@abrospot/database run generate
RUN npm --workspace=@abrospot/database run build
RUN npm --workspace=@abrospot/api run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/database ./packages/database
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist

EXPOSE 4000

CMD ["node", "apps/api/dist/index.js"]
