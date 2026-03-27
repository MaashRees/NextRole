# ======================================================================
# NextRole Backend — Dockerfile optimisé
# Image légère node:20-alpine, utilisateur non-root
# ======================================================================

FROM node:20-alpine

# Métadonnées
LABEL maintainer="NextRole"
LABEL description="Backend Express — NextRole"

# Dépendances système minimales pour bcrypt (compilation native)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copier les manifestes en premier pour profiter du cache Docker
# (les dépendances ne se réinstallent que si package*.json change)
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm ci --omit=dev && npm cache clean --force

# Copier le reste du code source
COPY . .

# Créer un utilisateur non-root pour éviter d'exécuter le serveur en root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Créer le dossier de logs avec les bons droits
RUN mkdir -p logs && chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

# Healthcheck natif Docker (utilisé par depends_on condition: service_healthy)
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "server.js"]