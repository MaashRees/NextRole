# ======================================================================
# NextRole Frontend — Dockerfile multi-stage optimisé
#
# Étape 1 (builder) : build Vite dans node:20-alpine
# Étape 2 (runner)  : sert le build statique via nginx:alpine
#
# L'ARG VITE_BACKEND_URI est injecté au moment du build :
#   docker build --build-arg VITE_BACKEND_URI=https://... ./frontend
# ======================================================================

# ---- Étape 1 : Build ----
FROM node:20-alpine AS builder

LABEL stage="builder"

WORKDIR /app

# Copier les manifestes pour maximiser le cache Docker
COPY package*.json ./

# Installer TOUTES les dépendances (devDependencies incluses pour Vite/Tailwind)
RUN npm ci && npm cache clean --force

# Copier le code source
COPY . .

# Build de production Vite
RUN npm run build

# ---- Étape 2 : Serveur nginx ----
FROM nginx:1.27-alpine AS runner

LABEL maintainer="NextRole"
LABEL description="Frontend React — NextRole (nginx)"

# Supprimer la config nginx par défaut et injecter la nôtre
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier uniquement le dossier dist depuis l'étape builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Assigner les droits en lecture seule au user nginx
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Healthcheck nginx
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
CMD ["/entrypoint.sh"]