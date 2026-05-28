# ===========================================
# ETAPA 1: Build del Angular
# ===========================================
FROM node:18-alpine AS builder

ARG BUILD_CONFIG=qa

WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts
COPY . .
RUN --mount=type=cache,target=/app/.angular \
    NODE_OPTIONS=--max_old_space_size=4096 npm run build -- --configuration $BUILD_CONFIG

# ===========================================
# ETAPA 2: Servir con Nginx
# ===========================================
FROM nginx:1.27-alpine AS runner
COPY --from=builder /app/dist/integra-v5-interfaz /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:80/ || exit 1
