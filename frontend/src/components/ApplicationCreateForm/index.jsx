import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/ApiService';

const ApplicationCreateForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    jobId: '',
    status: 'Postulé',
    notes: ''
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await apiService.getJobs();
        const jobsData = response.data ? response.data : response;
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      } catch (err) {
        console.error("Erreur chargement jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.jobId) return alert("Veuillez sélectionner une offre d'emploi.");
    
    setLoading(true);
    try {
      await apiService.createApplication(formData);
      alert("Candidature enregistrée avec succès !");
      if (onSuccess) onSuccess();
      else navigate('/applications');
    } catch (err) {
      alert("Erreur : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
        <form onSubmit={handleSubmit} className="app-form">
      <h3>Nouvelle candidature</h3>
      
      <div>
        <label><strong>Associer à une offre * :</strong></label>
        <select 
          value={formData.jobId}
          onChange={e => setFormData({...formData, jobId: e.target.value})} 
          required
        >
          <option value="">-- Choisir une offre --</option>
          {jobs.map(j => <option key={j._id} value={j._id}>{j.title} - {j.company}</option>)}
        </select>
      </div>

      <div>
        <label><strong>Statut actuel :</strong></label>
        <select 
          value={formData.status} 
          onChange={e => setFormData({...formData, status: e.target.value})}
        >
          <option value="En attente">En attente</option>
          <option value="Postulé">Postulé</option>
          <option value="Entretien">Entretien</option>
          <option value="Test Technique">Test Technique</option>
          <option value="Offre">Offre acceptée</option>
          <option value="Refusé">Refusé</option>
        </select>
      </div>

      <div>
        <label><strong>Notes / Remarques :</strong></label>
        <textarea 
          placeholder="Ex: Contact RH, lien du test technique..." 
          value={formData.notes}
          onChange={e => setFormData({...formData, notes: e.target.value})} 
        />
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer la candidature"}
        </button>
      </div>
    </form>
  );
};

export default ApplicationCreateForm;