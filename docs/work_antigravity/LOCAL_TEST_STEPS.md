# Déroulement du Test Local (Docker)

Voici les étapes que je suis en train d'exécuter pour valider la dockerisation en local sur votre machine, sans perturber vos serveurs de dev actuels.

## Étape 1 : Préparation des ports et correction de bug
Étant donné que vous avez déjà des processus `npm run dev` qui tournent sur les ports `3000` (Backend) et `5173` (Frontend), j'ai temporairement modifié le fichier local `docker-compose.yml` pour publier les conteneurs sur des ports alternatifs :
- **Backend Docker :** exposé sur le port `3005` (redirection vers le port interne 3000 du conteneur).
- **Frontend Docker :** exposé sur le port `5174` (redirection vers le port interne 80 de NGINX).
- J'ai configuré `FRONTEND_URL=http://localhost:5174` pour le CORS.

*Note de débogage : Lors du premier build Docker, une erreur de casse (*case sensitivity*) a été détectée sur Linux (`Navbar` vs `NavBar`). J'ai corrigé l'importation dans `Layout/index.jsx` pour que le build puisse passer avec succès dans le conteneur.*

## Étape 2 : Construction et lancement (Docker Compose)
J'exécute la commande suivante pour forcer le build des images à partir de zéro et lancer les conteneurs en tâche de fond :
```bash
docker compose up --build -d
```
Cette commande va :
1. Construire l'image du **Backend** (Node.js Alpine).
2. Construire l'image du **Frontend** (Vite build + Nginx Alpine).
3. Démarrer les deux conteneurs sur le réseau docker partagé.

## Étape 3 : Vérification du statut des conteneurs
Je vérifierai que la commande `docker compose ps` montre bien nos deux conteneurs (`nextrole_backend` et `nextrole_frontend`) avec le statut **Up**.

## Étape 4 : Tests applicatifs
Une fois lancés :
- L'application web dockerisée est accessible sur **http://localhost:5174**
- L'API backend dockerisée est accessible via **http://localhost:3005** (ex: `http://localhost:3005/` affiche le message de bienvenue).

## Étape 5 : Analyse des logs de démarrage
Je vais lire les journaux du backend (`docker logs nextrole_backend`) pour m'assurer que :
1. La connexion à MongoDB `host.docker.internal:27017` s'effectue correctement.
2. Le logging via Winston est bien actif.
