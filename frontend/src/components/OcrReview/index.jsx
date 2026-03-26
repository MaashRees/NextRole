import { useState } from 'react';
import apiService from '../../services/ApiService';

const OcrReview = ({ job, onValidated }) => {
  const [fields, setFields] = useState({
    title: job.title || '',
    company: job.company || '',
    location: job.location || '',
    description: job.description || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleValidate = async () => {
    setLoading(true);
    setError('');
    try {
      const updated = await apiService.validateJobOffer(job._id, fields);
      onValidated && onValidated(updated.job);
    } catch (err) {
      setError('Erreur lors de la validation : ' + (err.message || 'Inconnue'));
    } finally {
      setLoading(false);
    }
  };

  const pdfFilename = job.fileUri?.replace('bronze/', '') || null;

  return (
    <div className="ocr-review-container">
      <h2>Vérification de l'offre extraite par IA</h2>
      <p>Corrigez les champs si nécessaire, puis validez pour enregistrer l'offre définitivement.</p>

      <div className="ocr-review-layout">
        {/* Panneau gauche : PDF original */}
        {pdfFilename && (
          <div className="ocr-pdf-panel">
            <h4>📄 Fichier original</h4>
            <iframe
              src={`${import.meta.env.VITE_BACKEND_URI}/jobs/document/${pdfFilename}`}
              title="Offre d'emploi originale"
              className="ocr-pdf-iframe"
            />
          </div>
        )}

        {/* Panneau droit : Champs extraits éditables */}
        <div className="ocr-fields-panel">
          <h4>✏️ Champs extraits</h4>

          <label>Titre du poste</label>
          <input name="title" value={fields.title} onChange={handleChange} />

          <label>Entreprise</label>
          <input name="company" value={fields.company} onChange={handleChange} />

          <label>Localisation</label>
          <input name="location" value={fields.location} onChange={handleChange} />

          <label>Description complète de l'offre</label>
          <textarea
            name="description"
            value={fields.description}
            onChange={handleChange}
            rows={14}
          />

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button
              className="btn btn-primary"
              onClick={handleValidate}
              disabled={loading}
            >
              {loading ? '⏳ Enregistrement...' : '✅ Valider et enregistrer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OcrReview;
