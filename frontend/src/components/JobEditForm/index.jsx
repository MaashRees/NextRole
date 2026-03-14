import React, { useState } from 'react';
import apiService from '../../services/ApiService';

const JobEditForm = ({ job, onCancel, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: job.title,
    company: job.company,
    location: job.location,
    link: job.link || '',
    workRhythm: job.workRhythm || 'Présentiel',
    contractType: job.contractType || 'CDI',
    salary: {
      mini: job.salary?.mini || '',
      maxi: job.salary?.maxi || '',
      currency: job.salary?.currency || 'EUR'
    },
    educationRequired: job.educationRequired || '',
    seniority: job.seniority || -1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {};

    const fields = ['title', 'company', 'location', 'link', 'workRhythm', 'contractType', 'educationRequired', 'seniority'];
    fields.forEach(field => {
      if (formData[field] !== job[field]) {
        payload[field] = formData[field];
      }
    });

    const salaryPayload = {};
    if (Number(formData.salary.mini) !== job.salary?.mini) salaryPayload.mini = Number(formData.salary.mini);
    if (Number(formData.salary.maxi) !== job.salary?.maxi) salaryPayload.maxi = Number(formData.salary.maxi);
    if (formData.salary.currency !== job.salary?.currency) salaryPayload.currency = formData.salary.currency;

    if (Object.keys(salaryPayload).length > 0) {
      payload.salary = salaryPayload;
    }

    if (Object.keys(payload).length === 0) {
      alert("Aucune modification détectée.");
      onCancel();
      return;
    }

    try {
      const updated = await apiService.updateJob(job._id, payload);
      onUpdate(updated);
      alert("Informations mises à jour !");
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Modifier les informations générales</h3>
      
      <label>Titre :</label>
      <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />

      <label>Entreprise :</label>
      <input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required />

      <label>Lieu :</label>
      <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />

      <label>Salaire (Min/Max/Devise) :</label>
      <input type="number" value={formData.salary.mini} onChange={e => setFormData({...formData, salary: {...formData.salary, mini: e.target.value}})} />
      <input type="number" value={formData.salary.maxi} onChange={e => setFormData({...formData, salary: {...formData.salary, maxi: e.target.value}})} />
      <input value={formData.salary.currency} onChange={e => setFormData({...formData, salary: {...formData.salary, currency: e.target.value.toUpperCase()}})} />

      <label>Rythme :</label>
      <select value={formData.workRhythm} onChange={e => setFormData({...formData, workRhythm: e.target.value})}>
        <option value="Présentiel">Présentiel</option>
        <option value="Hybride">Hybride</option>
        <option value="Télétravail total">Télétravail total</option>
      </select>

      <label>Contrat :</label>
      <select value={formData.contractType} onChange={e => setFormData({...formData, contractType: e.target.value})}>
        <option value="CDI">CDI</option>
        <option value="CDD">CDD</option>
        <option value="Alternance">Alternance</option>
        <option value="Stage">Stage</option>
        <option value="Freelance">Freelance</option>
      </select>

      <label>Lien de l'offre :</label>
      <input type="url" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />

      <br />
      <button type="submit">Enregistrer les modifications</button>
      <button type="button" onClick={onCancel}>Annuler</button>
    </form>
  );
};

export default JobEditForm;