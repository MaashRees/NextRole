# Sécurisation, Dockerisation et Déploiement de NextRole

Cet Implementation Plan détaille les étapes pour passer de l'environnement de développement local à un environnement de production sécurisé, sous forme de microservices avec une traçabilité complète.

## Proposed Changes

### 1. Audit de sécurité et Vérification du Code
Avant de dockeriser, nous allons examiner le code et les dépendances.
- **Backend (Express) :** 
  - Exécuter `npm audit` / `npm outdated`.
  - Vérifier la configuration CORS (restreindre l'origine en production à `https://nextrole.maashrees.fr`).
  - Ajouter des middlewares de sécurité (`helmet`, `express-rate-limit`).
- **Frontend (React/Vite) :**
  - Exécuter `npm audit`.
  - Vérifier qu'aucun secret (keys, tokens) n'est exposé.

---
### 2. Traçabilité (Logging) & Documentation
1. **Logs applicatifs :** Mise en place de `winston` et `morgan` sur le backend pour avoir des logs de chaque requête et des erreurs, qui seront collectés par Docker.
2. **Dossier de suivi Antigravity :** Tous nos plans d'actions (`task.md`, `implementation_plan.md`) seront copiés de manière synchrone dans `docs/work_antigravity/` pour garantir une traçabilité totale sur les futures requêtes IA.

---
### 3. Microservices, Dockerisation et `.env`
Création des conteneurs pour le Frontend et le Backend.
#### Gestion du Backend :
- Création du `Dockerfile` (image node:alpine) et `.dockerignore`.
- **Variables d'environnement :** Le Backend s'attendra à des variables (`DB_HOST`, `DB_PORT`, `FRONTEND_HOST`, `JWT_SECRET`). Celles-ci seront redéfinies au niveau du `docker-compose.yml` en production pour pointer vers la base existante du VPS.
#### Gestion du Frontend :
- Création du `Dockerfile` (build multi-stage avec node puis nginx) et `.dockerignore`.
- **Variables d'environnement :** Le build du Frontend (Vite) nécessite `VITE_BACKEND_URI` au moment du build. Nous passerons un `--build-arg VITE_BACKEND_URI=https://nextrole.maashrees.fr/api` pour pointer vers le serveur de production.
#### Publication sur Docker Hub :
- Je vous fournirai la liste exacte des commandes `docker build`, `docker tag`, et `docker push` afin que vous puissiez envoyer vous-même les images depuis votre machine sans me donner vos accès.

---
### 4. Déploiement VPS et Connexion MongoDB
Le processus de mise en route sur le serveur VPS consistera à cloner le dépôt complet, puis à exploiter le `docker-compose.prod.yml` que nous allons construire.
- **Connexion MongoDB :** Nous utiliserons le réseau Docker existant sur votre VPS ou un passage via localhost/réseau sur le `27017/tcp` pour connecter le container Backend au container MongoDB. Il vous suffira de définir les secrets MongoDB dans le `.env` de production sur le VPS.

---
### 5. NGINX & Nom de Domaine (nextrole.maashrees.fr)
Configuration d'un Reverse Proxy sur le VPS.
- Création du fichier `nginx.conf` (conçu pour le VPS) :
  - Bloc `server` écoutant sur le port 80/443 pour le domaine `nextrole.maashrees.fr` (domaine Hostinger).
  - Redirection `/api/*` vers le conteneur Backend.
  - Redirection par défaut `/` vers le conteneur Frontend.
- Je vous donnerai la marche à suivre pour configurer le pointage DNS chez Hostinger et valider un certificat `certbot`.

## Verification Plan
1. Audit des dépendances et code applicatif validé localement.
2. Construction réussie des images Docker avec la bonne assimilation des variables `.env` via un test local `docker-compose up`.
3. Validations des configurations prêtes à être transférées par vos soins (git clone) sur le VPS.
