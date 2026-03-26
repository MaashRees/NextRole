# NextRole - Système de Suivi de Candidatures

**NextRole** est une application web full-stack (MERN) permettant aux utilisateurs de gérer leurs recherches d'emploi, de suivre leurs candidatures et d'organiser leurs contacts de recrutement.

## 🚀 Fonctionnalités

* **Gestion Utilisateur** : Inscription, connexion, et gestion du profil (avatar, mot de passe).
* **Gestion des Jobs** : Création d'offres, ajout de tags, et gestion des contacts RH.
* **Suivi des Candidatures** : Historique des relances (follow-up) et mise à jour du statut en temps réel.
* **Sécurité** : Authentification par JWT et hachage des mots de passe avec Bcrypt.

## 🛠️ Stack Technique

* **Frontend** : React 19, Vite, TailwindCSS, React Router.
* **Backend** : Node.js, Express 5.
* **Base de données** : MongoDB avec Mongoose.
* **Validation** : Joi (validation des schémas de données).

## 📦 Installation et Lancement

### Prérequis

* Node.js installé
* MongoDB lancé localement

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd NextRole-styleandfinal

```

### 2. Configuration du Backend

```bash
cd backend
npm install
# Créez votre fichier .env (voir section Configuration ci-dessous)
npm run dev

```

Le serveur démarrera sur `http://localhost:3000`.

### 3. Configuration du Frontend

```bash
cd ../frontend
npm install
# Créez votre fichier .env
npm run dev

```

L'application sera accessible sur `http://localhost:5173`.

## 🔐 Sécurité

Pour générer une nouvelle clé secrète JWT en production, utilisez la commande suivante :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

```

### Configuration des variables d'environnement (.env)

Il est crucial de ne jamais versionner tes fichiers `.env`. Tu dois créer deux fichiers distincts à la racine de leurs dossiers respectifs.

#### Pour le backend

```sh
# Configuration du Serveur
APP_PORT=3000
APP_HOST=localhost

# Configuration du Frontend (pour CORS)
FRONTEND_PORT=5173
FRONTEND_HOST=localhost

# Configuration Base de données
DB_HOST=localhost
DB_PORT=27017
DB_NAME=nextrole

# Sécurité
JWT_SECRET=
SALT_ROUNDS=10

# Divers
BASE_AVATAR_URL=https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=
```

### Pour le frontend

```sh
VITE_BACKEND_URI=http://localhost:3000 
VITE_BASE_AVATAR_URL=https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=
```

## 📂 Structure des API (Points d'entrée)

| Méthode | Route | Description |
| --- | --- | --- |
| POST | `/users/register` | Créer un compte |
| POST | `/users/login` | Se connecter |
| GET | `/jobs` | Liste des offres de l'utilisateur |
| POST | `/applications` | Créer une candidature |
| PATCH | `/applications/:id/status` | Changer le statut d'une candidature |

---

### Prochaines étapes suggérées

1. **Vérification** : Est-ce que les noms des variables dans ton fichier `backend/config/database.js` correspondent bien à ton `.env` ? Ton code utilise `DB_HOST`, `DB_PORT` et `DB_NAME`, ce qui est correct avec le `.env` proposé.
2. **Test** : As-tu essayé de lancer une requête de login pour vérifier que le `JWT_SECRET` est bien pris en compte ?

---

- Documentation généré par Gemini
