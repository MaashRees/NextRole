import React, { useState, useEffect } from 'react';
import apiService from '../../services/ApiService';

const ApplicationCreateForm = () => {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    jobId: '',
    status: 'Postulé',
    notes: ''
  });

  useEffect(() => {
    const fetchJobs = async () => {
      const data = await apiService.getJobs();
      setJobs(data);
    };
    fetchJobs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.jobId) return alert("Sélectionnez un job");
    
    try {
      await apiService.createApplication(formData);
      alert("Candidature enregistrée !");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Détails de la candidature</h3>
      <label>Associer à une offre :</label>
      <select onChange={e => setFormData({...formData, jobId: e.target.value})} required>
        <option value="">-- Choisir un job --</option>
        {jobs.map(j => <option key={j._id} value={j._id}>{j.title} - {j.company}</option>)}
      </select>

      <label>Statut actuel :</label>
      <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
        <option value="En attente">En attente</option>
        <option value="Postulé">Postulé</option>
        <option value="Entretien">Entretien</option>
        <option value="Test Technique">Test Technique</option>
        <option value="Offre">Offre</option>
      </select>

      <textarea placeholder="Notes (ex: contact RH, plateforme...)" onChange={e => setFormData({...formData, notes: e.target.value})} />
      
      <button type="submit">Enregistrer la candidature</button>
    </form>
  );
};

export default ApplicationCreateForm;