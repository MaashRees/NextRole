# Guide de Déploiement NextRole sur VPS

Ce guide retrace toutes les commandes nécessaires pour finaliser la mise en production de votre application.

## 1. Construire et Pousser sur Docker Hub (Depuis votre PC)
Remplacez `VOTRE_USER` par votre vrai nom d'utilisateur Docker Hub.

**Connectez-vous à Docker Hub :**
```bash
docker login
```

**Construire les images :**
```bash
docker build -t VOTRE_USER/nextrole-backend:latest ./backend
docker build -t VOTRE_USER/nextrole-frontend:latest --build-arg VITE_BACKEND_URI=https://nextrole.maashrees.fr/api ./frontend
```

**Pousser les images :**
```bash
docker push VOTRE_USER/nextrole-backend:latest
docker push VOTRE_USER/nextrole-frontend:latest
```

---

## 2. Déploiement sur le VPS distant
Connectez-vous en SSH à votre VPS.

**Cloner le dépôt :**
```bash
git clone https://github.com/votre_repo/NextRole.git
cd NextRole
```

**Lancer les conteneurs de production :**
*(Assurez-vous que le conteneur MongoDB tourne déjà et est accessible sur 172.17.0.1:27017, ou modifiez DB_HOST dans `docker-compose.prod.yml` avant de lancer).*
```bash
docker compose -f docker-compose.prod.yml up -d
```

---

## 3. Configuration NGINX & Nom de Domaine (Hostinger)
Assurez-vous que chez Hostinger, un enregistrement DNS de type **A** pour `nextrole.maashrees.fr` pointe vers l'adresse IP publique de votre VPS.

**Sur le VPS, installez NGINX et Certbot :**
```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx
```

**Copier la configuration NGINX :**
```bash
sudo cp nginx-vps.conf /etc/nginx/sites-available/nextrole.maashrees.fr
sudo ln -s /etc/nginx/sites-available/nextrole.maashrees.fr /etc/nginx/sites-enabled/
```

**Vérifier et redémarrer NGINX :**
```bash
sudo nginx -t
sudo systemctl restart nginx
```

**Obtenir le certificat SSL Let's Encrypt (HTTPS) :**
```bash
sudo certbot --nginx -d nextrole.maashrees.fr
```
Certbot va configurer automatiquement votre fichier NGINX pour écouter sur le port 443 sécurisé.

---
## 4. Traçabilité des logs
Pour voir ce qui se passe sur les microservices depuis le VPS :
```bash
docker logs -f nextrole_backend_prod
docker logs -f nextrole_frontend_prod
```
Les logs applicatifs Node.js sont également générés dans `/backend/logs/` au sein du conteneur grâce à Winston et Morgan.
