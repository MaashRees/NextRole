# Tâches - Intégration OCR pour les Offres d'Emplois

## Phase 1 : Configuration et Infrastructure (Docker & Env)
- [x] Vérifier/Ajouter MinIO et Airflow au `docker-compose.yml` si absents.
- [x] Mettre à jour le fichier `.env` global avec : `MINIO_ENDPOINT`, `AIRFLOW_API`, `AZURE_OCR_KEY`, `AZURE_OCR_ENDPOINT`.

## Phase 2 : Couche API Backend (MinIO & Transfert)
- [x] Installer les librairies backend requises : `minio`, `multer`, `axios`.
- [x] Configurer `config/minio.js` pour la connexion client backend vers MinIO.
- [x] Créer `services/jobOcrService.js` (Upload dans `bronze` + Déclenchement DAG Airflow).
- [x] Mettre à jour `models/Job.js` avec la grande aire de texte `description`, `fileUri`, `parsingStatus` (pending_ocr, needs_review, validated, failed).
- [x] Exposer les routes `POST /jobs/upload` pour le front, et `GET /jobs/document/:filename` pour visualiser le PDF plus tard.
- [x] Exposer la route `PUT /jobs/:id/validate` pour que l'utilisateur confirme les changements corrigés post-IA.

## Phase 3 : Création du Pipeline Airflow (Python)
- [x] Configurer l'environnement Python côté Airflow (si nécessaire, installer `azure-ai-documentintelligence`, `minio`, `pymongo`).
- [x] Créer le DAG `job_offer_pipeline.py`.
- [x] Créer la tâche Python `Task 1` : Azure OCR (lecture de `bronze` -> traitement Azure -> stockage `silver`).
- [x] Créer la tâche Python `Task 2` : Parsing & Nettoyage (extraction de la `description` complète, titre, etc. -> formatage JSON -> stockage `gold`).
- [x] Créer la tâche Python `Task 3` : Sauvegarde Mongo (mise à jour directe du status MongoDB à `needs_review` + champs extraits).

## Phase 4 : Interface Frontend (Upload & Review)
- [x] Créer un composant d'upload (Drag & Drop) pour soumettre des offres au format PDF/TXT.
- [x] Ajouter une gestion d'état UI pendant l'attente du traitement asynchrone (Spinner "Analyse de l'offre par IA").
- [x] Créer l'interface de **Validation (Confirmation)** dès que le statut passe à `needs_review` :
  - Affichage conditionnel (PDF original à gauche, Champs pré-remplis éditables incluant `description` à droite).
  - Bouton "Valider et Sauvegarder" pour confirmer définitivement en appelant l'API backend.
