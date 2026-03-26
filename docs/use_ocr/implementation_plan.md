# Plan d'Intégration OCR, MinIO et Airflow pour les Offres d'Emplois (NextRole)

Ce plan décrit l'intégration d'un pipeline d'extraction de données de documents (PDF/TXT) via Microsoft Azure Document Intelligence, orchesté par Apache Airflow, avec un stockage sur MinIO. L'objectif est de permettre aux utilisateurs (ou recruteurs) d'uploader une offre d'emploi, d'extraire automatiquement ses champs clés (Titre, Entreprise, Description, Compétences), et de conserver le fichier original.

## User Review Required
> [!IMPORTANT]
> **Pré-requis d'infrastructure :**
> - Avez-vous déjà un conteneur Airflow et un conteneur MinIO de déployés sur votre serveur/projet actuel (comme dans le hackathon), ou dois-je les ajouter au `docker-compose.yml` ?
> - Avez-vous déjà les identifiants (Endpoint et Clé API) pour **Microsoft Azure Document Intelligence** ? (Ils devront être ajoutés au fichier `.env`).

## Proposed Changes

### 1. Stockage Datalake (MinIO)
Configuration du stockage S3 pour conserver les documents.
#### [NEW] backend/src/config/minio.js
- Instanciation du client MinIO utilisant les variables d'environnement (`MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`).
- Script ou code d'amorçage backend pour s'assurer que les buckets suivants existent à la racine de MinIO :
  - `bronze` : Fichiers PDF/TXT bruts uploadés par l'utilisateur.
  - `silver` : Fichiers JSON contenant la sortie brute de l'OCR Azure.
  - `gold`  : Fichiers JSON nettoyés et validés, prêts à être insérés/lus depuis MongoDB.

### 2. Couche API Backend (Node.js/Express)
Modification du backend pour gérer l'upload de fichier et la communication avec Airflow.
#### [MODIFY] backend/src/routes/job.route.js
- Ajout d'une nouvelle route `POST /jobs/upload` utilisant le middleware `multer` (en mémoire `multer.memoryStorage()`) pour réceptionner le fichier.

#### [NEW] backend/src/services/jobOcrService.js
*Inspiré du `documentService.js` du hackathon :*
1. Réceptionne le fichier (`file.buffer`).
2. Pousse le fichier original dans le bucket `bronze` de MinIO (ex: `offres_12345.pdf`).
3. Crée un nouveau `Job` dans MongoDB avec le statut `pending_ocr` et le chemin vers le fichier MinIO.
   *(Note: Le modèle `Job` sera mis à jour avec un champ `description` pour stocker le texte intégral de l'annonce).*
4. Appelle l'API REST d'Airflow (`POST /api/v2/dags/job_offer_pipeline/dagRuns`) pour déclencher le pipeline d'extraction asynchrone, en lui envoyant l'ID du job et le nom du fichier.

### 3. Orchestration (Apache Airflow)
Création des workflows asynchrones de traitement.
#### [NEW] datalake/airflow/dags/job_offer_pipeline.py
Création d'un DAG Airflow dédié à l'extraction des offres :
- **Task 1 (azure_ocr)** : Lit le PDF depuis le bucket `bronze`, appelle l'API *Azure Document Intelligence* via Python et sauvegarde le résultat brut dans `silver`.
- **Task 2 (clean_format)** : Transforme le JSON complexe en informations structurées (Titre, Entreprise, Salaire, et la **Description globale de l'offre**).
- **Task 3 (update_mongodb)** : Met à jour l'offre dans MongoDB avec les champs extraits et passe le statut de `pending_ocr` à `needs_review` (En attente de l'approbation de l'utilisateur).

### 4. Interface Frontend (React)
Adaptation de l'interface graphique pour le dépôt et la prévisualisation.
#### [MODIFY] frontend/src/components/JobCreateForm/index.jsx (ou création nouvelle vue)
- Ajout d'une zone de "Drag & Drop" (glisser-déposer) pour uploader un PDF ou TXT.
- Ajout d'indicateurs visuels de statut ("Analyse en cours via IA...").
- **Phase de Validation :** Une fois le statut passé à `needs_review`, l'interface affiche un formulaire de confirmation. L'utilisateur verra le PDF d'un côté et les champs pré-remplis (dont la grosse Description) de l'autre.
- Si l'utilisateur ajuste et valide, l'offre passe au statut `validated` et devient officielle en base de données.

## Verification Plan

### Automated Tests
1. Test unitaire (Backend) : Validations du format MIME du fichier reçu via Multer.
2. Test d'intégration (Dag Airflow) : Exécution d'un DAG de test avec un PDF factice posté dans MinIO et simulation de l'appel au service OCR.

### Manual Verification
- Uploader manuellement un faux fichier PDF d'offre de stage sur l'interface (Frontend).
- Vérifier que le fichier est apparu dans l'interface de MinIO (`bronze`).
- Valider que le DAG Airflow s'est bien lancé et a terminé toutes ses tâches avec succès (visuel sur Airflow UI).
- Vérifier la mise à jour des champs sur l'interface Frontend une fois l'extraction terminée pour que l'utilisateur puisse modifier les champs s'il y a des erreurs de l'Intelligence Artificielle.
