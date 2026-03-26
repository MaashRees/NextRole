import { useState, useRef } from 'react';
import apiService from '../../services/ApiService';

const JobUpload = ({ onSuccess }) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) validate(dropped);
  };

  const validate = (f) => {
    if (!['application/pdf', 'text/plain'].includes(f.type)) {
      setError('Format non supporté. Veuillez envoyer un PDF ou un fichier .txt.');
      setFile(null);
    } else {
      setError('');
      setFile(f);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const data = await apiService.uploadJobOffer(formData);
      onSuccess && onSuccess(data.job);
    } catch (err) {
      setError("Erreur lors de l'envoi : " + (err.message || 'Inconnue'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-upload-wrapper">
      <h3>Importer une offre d'emploi</h3>
      <p>Déposez un fichier PDF ou TXT et notre IA extraira automatiquement les informations.</p>

      <div
        className={`upload-drop-zone ${dragging ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt"
          style={{ display: 'none' }}
          onChange={(e) => validate(e.target.files[0])}
        />
        {file ? (
          <div className="upload-file-info">
            <span className="upload-icon">📄</span>
            <span>{file.name}</span>
            <small>{(file.size / 1024).toFixed(1)} Ko</small>
          </div>
        ) : (
          <div className="upload-placeholder">
            <span className="upload-icon">📂</span>
            <span>Glissez votre fichier ici</span>
            <small>ou cliquez pour parcourir</small>
          </div>
        )}
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!file || loading}
        >
          {loading ? '⏳ Analyse en cours...' : '🚀 Lancer l\'extraction IA'}
        </button>
      </div>
    </div>
  );
};

export default JobUpload;
