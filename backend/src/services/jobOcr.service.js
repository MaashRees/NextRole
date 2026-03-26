const minioClient = require('../config/minio');
const axios = require('axios');
const Job = require('../models/job.model');

const AIRFLOW_API_URL = process.env.AIRFLOW_API_URL || 'http://airflow-webserver:8080';
const AIRFLOW_USER = process.env.AIRFLOW_USER || 'admin';
const AIRFLOW_PASSWORD = process.env.AIRFLOW_PASSWORD || 'admin';

/**
 * Déclenche un DAG run Airflow via Basic Auth (compatible Airflow 3 api-server).
 * Non-bloquant : si Airflow n'est pas disponible, le job est quand-même créé en base.
 */
const triggerAirflowDag = async (docName, jobId) => {
  try {
    await axios({
      method: 'post',
      url: `${AIRFLOW_API_URL}/api/v2/dags/job_offer_pipeline/dagRuns`,
      auth: { username: AIRFLOW_USER, password: AIRFLOW_PASSWORD },
      data: {
        conf: { doc_name: docName, job_id: jobId },
        logical_date: new Date().toISOString(),
      },
    });
    console.log(`[OCR] DAG Airflow déclenché pour le job ${jobId}`);
  } catch (err) {
    // Non-bloquant : on log l'erreur mais on ne fait pas échouer la requête
    console.warn(`[OCR] Impossible de déclencher le DAG Airflow (${err.response?.status || err.message}). Le job ${jobId} reste en statut pending_ocr.`);
  }
};

/**
 * Upload un fichier PDF/TXT dans le bucket MinIO 'bronze',
 * crée un Job MongoDB en statut 'pending_ocr', puis déclenche le DAG Airflow.
 */
const uploadAndTriggerOcr = async (file, userId) => {
  // 1. Sauvegarder le fichier original dans le bucket 'bronze'
  await minioClient.putObject('bronze', file.originalname, file.buffer, file.size, {
    'Content-Type': file.mimetype,
  });

  // 2. Créer le Job dans MongoDB en statut "pending_ocr"
  const job = await Job.create({
    title: 'En cours d\'extraction...',
    company: 'En cours d\'extraction...',
    location: 'Non défini',
    createdBy: userId,
    fileUri: `bronze/${file.originalname}`,
    parsingStatus: 'pending_ocr',
  });

  // 3. Déclencher le pipeline Airflow (non-bloquant)
  triggerAirflowDag(file.originalname, job._id.toString());

  return job;
};

/**
 * Récupère un fichier depuis le bucket 'bronze' de MinIO en stream.
 */
const getFileFromBronze = async (filename) => {
  return minioClient.getObject('bronze', filename);
};

/**
 * Valide les champs d'un job extrait par l'OCR.
 * Met à jour les données corrigées par l'utilisateur et passe le statut à 'validated'.
 */
const validateOcrJob = async (jobId, validatedFields) => {
  const updated = await Job.findByIdAndUpdate(
    jobId,
    { ...validatedFields, parsingStatus: 'validated' },
    { new: true, runValidators: true }
  );
  return updated;
};

module.exports = { uploadAndTriggerOcr, getFileFromBronze, validateOcrJob };
