const { uploadAndTriggerOcr, getFileFromBronze, validateOcrJob } = require('../services/jobOcr.service');
const { logger } = require('../middlewares/logger.middleware');

/**
 * POST /jobs/upload
 * Reçoit un fichier (PDF ou TXT), l'envoie dans MinIO et déclenche le pipeline Airflow.
 */
const uploadJobOffer = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni. Envoyez un champ "file" de type multipart/form-data.' });
    }

    const allowedTypes = ['application/pdf', 'text/plain'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Format non supporté. Veuillez envoyer un PDF ou un fichier texte (.txt).' });
    }

    const job = await uploadAndTriggerOcr(req.file, req.user._id);
    logger.info(`[OCR] Fichier "${req.file.originalname}" uploadé et pipeline déclenché pour le job ${job._id}`);
    return res.status(202).json({ message: 'Fichier reçu et pipeline OCR déclenché.', job });
  } catch (err) {
    logger.error(`[OCR] Erreur lors du déclenchement du pipeline: ${err.message}`);
    return res.status(500).json({ error: 'Erreur lors du traitement du fichier.' });
  }
};

/**
 * GET /jobs/document/:filename
 * Renvoie le flux du fichier original depuis MinIO pour prévisualisation dans l'interface.
 */
const viewJobDocument = async (req, res) => {
  try {
    const stream = await getFileFromBronze(req.params.filename);
    res.setHeader('Content-Type', 'application/pdf');
    stream.pipe(res);
  } catch (err) {
    logger.error(`[OCR] Fichier introuvable dans MinIO: ${err.message}`);
    return res.status(404).json({ error: 'Document introuvable.' });
  }
};

/**
 * PUT /jobs/:id/validate
 * Valide et sauvegarde définitivement les champs corrigés par l'utilisateur après la revue OCR.
 */
const validateJobOffer = async (req, res) => {
  try {
    const job = await validateOcrJob(req.params.id, req.body);
    if (!job) return res.status(404).json({ error: 'Offre introuvable.' });
    logger.info(`[OCR] Job ${req.params.id} validé par l'utilisateur.`);
    return res.status(200).json({ message: 'Offre validée et enregistrée.', job });
  } catch (err) {
    logger.error(`[OCR] Erreur lors de la validation: ${err.message}`);
    return res.status(500).json({ error: 'Erreur lors de la validation.' });
  }
};

module.exports = { uploadJobOffer, viewJobDocument, validateJobOffer };
