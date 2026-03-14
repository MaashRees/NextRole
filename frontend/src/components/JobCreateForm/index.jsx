import React, { useState } from 'react';
import apiService from '../../services/ApiService';

const JobCreateForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    workRhythm: 'Présentiel',
    contractType: 'CDI',
    salary: { mini: 0, maxi: 0, currency: 'EUR' },
    link: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.createSimpleJob(formData);
      alert("Offre créée avec succès !");
      if (onSuccess) onSuccess();
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Détails de l'offre</h3>
      <input placeholder="Titre du poste" onChange={e => setFormData({...formData, title: e.target.value})} required />
      <input placeholder="Entreprise" onChange={e => setFormData({...formData, company: e.target.value})} required />
      <input placeholder="Lieu" onChange={e => setFormData({...formData, location: e.target.value})} required />
      
      <select onChange={e => setFormData({...formData, workRhythm: e.target.value})}>
        <option value="Présentiel">Présentiel</option>
        <option value="Hybride">Hybride</option>
        <option value="Télétravail total">Télétravail total</option>
      </select>

      <select onChange={e => setFormData({...formData, contractType: e.target.value})}>
        <option value="CDI">CDI</option>
        <option value="CDD">CDD</option>
        <option value="Alternance">Alternance</option>
        <option value="Stage">Stage</option>
        <option value="Freelance">Freelance</option>
      </select>

      <input type="url" placeholder="Lien de l'offre (https://...)" onChange={e => setFormData({...formData, link: e.target.value})} />
      
      <button type="submit">Créer l'offre</button>
    </form>
  );
};

export default JobCreateForm;