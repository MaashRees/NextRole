# NextRole (anciennement JobBinder)

## Système de Suivi de Candidatures Multi-Utilisateur - Stack MERN

**Développé par :** Seer MENSAH-ASSIAKOLEY  
**Contexte :** Projet de validation du module MERN - IPSSI  
**Formateur :** Bastien Flanquart  
**Date :** Mars 2026

---

## 📖 Table des matières

1. [Présentation du projet](#-présentation-du-projet)
2. [Genèse et évolution du projet](#-genèse-et-évolution-du-projet)
3. [Fonctionnalités détaillées](#-fonctionnalités-détaillées)
4. [API Reference](#-api-reference)
5. [Sécurité](#-sécurité)
6. [Conclusion](#-en-résumé)

---

## 🎯 Présentation du projet

**NextRole** est une application web full-stack conçue pour centraliser et optimiser la gestion des recherches d'emploi. Dans un marché du travail où un candidat peut postuler à des dizaines d'offres simultanément, NextRole agit comme un **CRM personnel** dédié à la recherche professionnelle.

L'application permet de :
- Centraliser toutes les candidatures dispersées sur différentes plateformes (LinkedIn, Indeed, Welcome to the Jungle, etc.)
- Suivre l'évolution de chaque candidature avec un système de statuts personnalisables
- Gérer un réseau de contacts professionnels liés aux entreprises ciblées
- Organiser les offres par tags pour une recherche et un filtrage efficaces
- Maintenir un historique des relances pour optimiser le suivi

Ce projet répond aux exigences pédagogiques du module MERN tout en proposant une solution concrète à un problème réel : **la gestion chaotique des recherches d'emploi**.

---

## 🧠 Genèse et évolution du projet

### De JobBinder à NextRole : l'histoire d'un projet dormant

Ce projet a une histoire particulière. **JobBinder** était une idée que j'avais eue il y a environ 4 mois, bien avant ce cours MERN. J'avais commencé à réfléchir à une solution pour aider les chercheurs d'emploi à mieux s'organiser, mais le projet était resté dormant dans ma galerie, faute de temps et de structure méthodologique pour le concrétiser.

Le TP évalué demandait de concevoir une application sur un thème libre avec des contraintes techniques précises : CRUD, authentification JWT, validation des données, et architecture multi-utilisateur.

C'était le cadre parfait pour donner vie à JobBinder.

### Pourquoi "NextRole" ?

Le nom a évolué en cours de développement. **JobBinder** (l'idée originale) évoquait un classeur à offres d'emploi. **NextRole** (le nom final) porte une ambition plus grande : non plus seulement "lier" des jobs, mais accompagner l'utilisateur vers son "prochain rôle" professionnel. C'est un outil de progression, pas seulement d'archivage.

### Objectifs pédagogiques atteints

Ce projet m'a permis de mettre en pratique l'ensemble des concepts abordés en cours :

| Concept | Implémentation dans NextRole |
|---------|------------------------------|
| API REST | Routes CRUD complètes pour 3 entités |
| MongoDB | Modélisation flexible avec relations référencées |
| Authentification JWT | Sessions sans état avec tokens |
| Validation | Joi pour les schémas côté backend |
| Composants React | Architecture modulaire avec hooks |
| Gestion d'état | Context API pour l'utilisateur connecté |
| Persistance | localStorage pour le token JWT |

---

## 🏗️ Choix technologiques

### Stack MERN : pourquoi ce choix ?

La stack MERN (MongoDB, Express, React, Node.js) a été imposée par le cadre pédagogique, mais elle s'est révélée parfaitement adaptée au projet pour plusieurs raisons :

#### 1. **JavaScript de bout en bout**
L'utilisation d'un seul langage pour le frontend et le backend simplifie considérablement le développement et la maintenance. La courbe d'apprentissage est plus douce et les connaissances sont réutilisables.

#### 2. **MongoDB : la flexibilité du document**
Pour un suivi de candidatures, MongoDB est idéal car :
- Les offres d'emploi ont des structures variables (certaines incluent un salaire, d'autres non)
- L'ajout de nouveaux champs (comme des notes personnelles) ne nécessite pas de migration
- Les tableaux (tags, contacts, follow-ups) sont gérés nativement

#### 3. **React : réactivité et composants**
L'interface utilisateur devait être fluide, sans rechargement de page. Le Virtual DOM de React garantit des mises à jour rapides, essentielles lors du changement de statut d'une candidature.

#### 4. **Express : légèreté et middleware**
Express offre juste ce qu'il faut pour construire une API REST, avec un système de middleware puissant pour l'authentification et la validation.

### Bibliothèques complémentaires

| Bibliothèque | Rôle | Justification |
|--------------|------|---------------|
| **Mongoose** | ODM MongoDB | Schématisation et validation côté base |
| **Joi** | Validation des données | Plus flexible que la validation Mongoose seule |
| **Bcrypt** | Hachage des mots de passe | Standard de sécurité |
| **JSONWebToken** | Authentification | Solution stateless pour API REST |
| **Express Validator** | Validation complémentaire | Pour les validations spécifiques aux routes |
| **Axios** | Client HTTP | Plus simple que fetch pour les appels API |
| **React Router DOM** | Routage frontend | Navigation SPA sans rechargement |
| **Tailwind CSS** | Styling | Généré par IA pour un gain de temps |
| **Dotenv** | Variables d'environnement | Sécurité des secrets |

---

## 🏛️ Architecture du système

### Relations entre entités

```
┌──────────┐         ┌──────────┐
│   User   │         │   Job    │
│──────────│         │──────────│
│ _id      │◄────────┼ user_id  │
│ name     │         │ title    │
│ email    │         │ company  │
└──────────┘         │ tags[]   │
        │            │ contacts │
        │            └─────┬────┘
        │                  │
        │                  │ (job_id)
        │            ┌─────▼─────┐
        │            │Application│
        │    user_id │───────────│
        └───────────►│ status    │
                     │ followUps │
                     └───────────┘

```

---

## ✨ Fonctionnalités détaillées

### 1. **Authentification et gestion de compte**

#### Inscription

- Validation des champs (email valide, mot de passe 6+ caractères)
- Hachage du mot de passe avec bcrypt (10 rounds de salt)
- Vérification d'unicité de l'email
- Génération automatique d'un avatar via DiceBear API


#### Connexion

- Vérification des identifiants
- Comparaison sécurisée des mots de passe
- Génération d'un token JWT

#### Persistance de session (frontend)

- Stockage du token dans localStorage
- Restauration de l'état au rechargement

### 2. **Gestion des offres d'emploi (Jobs)**

#### CRUD complet

| Opération | Méthode | Route | Description |
|-----------|---------|-------|-------------|
| Create | POST | `/jobs` | Créer une nouvelle offre |
| Read (all) | GET | `/jobs` | Liste toutes les offres de l'utilisateur |
| Read (one) | GET | `/jobs/:id` | Détail d'une offre |
| Update | PUT/PATCH | `/jobs/:id` | Modifier une offre |
| Delete | DELETE | `/jobs/:id` | Supprimer une offre |

#### Fonctionnalités avancées
- **Système de tags** : Ajout/suppression de tags pour catégoriser les offres
- **Gestion des contacts** : Association de contacts RH à une offre
- **Filtrage** : Par entreprise, par tag, par date

### 3. **Suivi des candidatures**

#### Statuts évolutifs
Les candidatures suivent un workflow typique de recherche d'emploi :

```
┌─────────────┐
│ À postuler  │
└──────┬──────┘
       ▼
┌─────────────┐
│ Candidature │
│  envoyée    │
└──────┬──────┘
       ▼
┌─────────────┐     ┌─────────────┐
│  Relance    │────►│  Entretien  │
│  effectuée  │     │  planifié   │
└─────────────┘     └──────┬──────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │    Refus    │ │ Acceptation │ │  En cours   │
    └─────────────┘ └─────────────┘ └─────────────┘
```

#### Historique des relances (Follow-ups)
Chaque candidature peut avoir plusieurs relances, avec :
- Date de la relance
- Type (Email, Téléphone, LinkedIn, Autre)
- Notes personnelles

### 4. **Gestion des contacts RH**

Les contacts sont une entité à part entière, permettant :
- Stockage des informations de contact (email, téléphone, LinkedIn)
- Association à une ou plusieurs offres
- Notes sur les échanges précédents

### 5. **Interface utilisateur**

#### Pages principales (3+ exigées)

| Page | Route | Description |
|------|-------|-------------|
| Accueil | `/` | Présentation du service (page générée par IA) |
| Connexion | `/login` | Formulaire de connexion |
| Inscription | `/register` | Formulaire d'inscription |
| Tableau de bord | `/dashboard` | Vue d'ensemble des candidatures |
| Offres | `/jobs` | Liste des offres avec filtres |
| Nouvelle offre | `/jobs/new` | Formulaire de création d'offre |
| Détail offre | `/jobs/:id` | Détail avec candidatures associées |
| Profil | `/profile` | Modification du profil utilisateur |

#### Composants réutilisables
- **JobCard** : Affichage synthétique d'une offre
- **StatusBadge** : Badge coloré selon le statut
- **TagList** : Gestion des tags (affichage et édition)
- **ContactForm** : Formulaire réutilisable pour les contacts
- **PrivateRoute** : Composant de protection des routes


## 🔌 API Reference

### Routes publiques

#### `POST /api/users/register`
Crée un nouveau compte utilisateur.

**Body:**
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "password": "secure123"
}
```

**Réponse (201):**
```json
{
  "error": false,
  "message": "Utilisateur créé avec succès",
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "avatar": "https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=xyz123",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### `POST /api/users/login`
Authentifie un utilisateur.

**Body:**
```json
{
  "email": "jean@example.com",
  "password": "secure123"
}
```

**Réponse (200):**
```json
{
  "error": false,
  "message": "Connexion réussie",
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "avatar": "https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=xyz123",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Routes protégées (nécessitent JWT dans header `Authorization: Bearer <token>`)

#### `GET /api/users/profile`
Récupère le profil de l'utilisateur connecté.

**Réponse (200):**
```json
{
  "error": false,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "avatar": "https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=xyz123",
    "createdAt": "2025-03-01T10:00:00.000Z"
  }
}
```

#### `PATCH /api/users/profile`
Met à jour le profil.

**Body:**
```json
{
  "name": "Jean Nouveau",
  "currentPassword": "secure123",
  "newPassword": "nouveau123"
}
```

#### `GET /api/jobs`
Liste toutes les offres de l'utilisateur.

**Query params:** `?tag=dev&company=Google`

**Réponse (200):**
```json
{
  "error": false,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "title": "Développeur Full Stack",
      "company": "Google",
      "location": "Paris",
      "tags": ["dev", "javascript", "react"],
      "createdAt": "2025-03-01T10:00:00.000Z"
    }
  ]
}
```

#### `POST /api/jobs`
Crée une nouvelle offre.

**Body:**
```json
{
  "title": "Développeur Full Stack",
  "company": "Google",
  "location": "Paris",
  "description": "Description du poste...",
  "salary": {
    "min": 60000,
    "max": 80000,
    "currency": "EUR"
  },
  "link": "https://google.com/jobs/123",
  "tags": ["dev", "javascript", "react"]
}
```

#### `POST /api/applications`
Crée une candidature pour une offre.

**Body:**
```json
{
  "job_id": "65f1a2b3c4d5e6f7g8h9i0j2",
  "status": "Candidature envoyée",
  "notes": "Candidature envoyée via LinkedIn"
}
```

#### `PATCH /api/applications/:id/status`
Met à jour le statut d'une candidature.

**Body:**
```json
{
  "status": "Entretien planifié"
}
```

#### `POST /api/applications/:id/followup`
Ajoute une relance.

**Body:**
```json
{
  "type": "Email",
  "notes": "Relance effectuée, réponse positive"
}
```

---

## 🔒 Sécurité

### Authentification JWT

Le système utilise JSON Web Tokens pour une authentification stateless :

## 🎯 En résumé

**NextRole** est né d'une idée qui dormait dans ma galerie depuis 4 mois. Grâce au cadre structurant du module MERN, cette idée a pu devenir une application fonctionnelle, sécurisée et utile.

### Ce que j'ai appris

| Domaine | Compétences acquises |
|---------|----------------------|
| **Backend** | API REST, JWT, Bcrypt, validation Joi, MongoDB |
| **Frontend** | React, Context API, hooks, routage SPA |
| **Méthodologie** | Organisation du code, gestion de projet, utilisation stratégique de l'IA |

### Pourquoi ce projet compte

Au-delà de la note, NextRole représente ma capacité à :
- Transformer une idée en produit concret
- Structurer une application complexe
- Résoudre des problèmes réels avec la technologie
