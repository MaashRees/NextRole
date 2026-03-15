import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/ApiService';

const JobCreateForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', company: '', location: '',
    workRhythm: 'Présentiel', contractType: 'CDI',
    salary: { mini: 0, maxi: 0, currency: 'EUR' },
    link: '', publishedDate: '', educationRequired: '',
    seniority: '',
    skillsRequired: '', 
    tags: '', 
    author: { name: '', position: '', email: '', linkedin: '' },
    contacts: [] 
  });

  const [tempContact, setTempContact] = useState({ name: '', position: '', email: '', linkedin: '' });

  const handleAddTempContact = () => {
    if (!tempContact.name) return alert("Le nom du contact est requis");
    setFormData({ ...formData, contacts: [...formData.contacts, tempContact] });
    setTempContact({ name: '', position: '', email: '', linkedin: '' }); 
  };

  const handleRemoveTempContact = (index) => {
    const newContacts = formData.contacts.filter((_, i) => i !== index);
    setFormData({ ...formData, contacts: newContacts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      salary: {
        mini: Number(formData.salary.mini),
        maxi: Number(formData.salary.maxi),
        currency: formData.salary.currency.toUpperCase()
      },
      seniority: Number(formData.seniority),
      skillsRequired: formData.skillsRequired ? formData.skillsRequired.split(',').map(s => s.trim()).filter(s => s) : [],
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
    };

    if (!payload.publishedDate) delete payload.publishedDate;
    if (!payload.author.name) delete payload.author;

    try {
      await apiService.createSimpleJob(payload); 
      alert("Offre créée avec succès !");
      if (onSuccess) onSuccess();
      else navigate('/jobs');
    } catch (err) {
      alert("Erreur lors de la création : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="job-form" style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <h3>Créer une offre d'emploi</h3>
      
      <fieldset style={{ padding: '10px', borderRadius: '5px' }}>
        <legend>Informations générales</legend>
        <input placeholder="Titre du poste *" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required style={{ width: '100%', marginBottom: '10px' }} />
        <input placeholder="Entreprise *" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required style={{ width: '100%', marginBottom: '10px' }} />
        <input placeholder="Lieu *" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required style={{ width: '100%' }} />
      </fieldset>

      <fieldset style={{ padding: '10px', borderRadius: '5px' }}>
        <legend>Contrat & Salaire</legend>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <select value={formData.contractType} onChange={e => setFormData({...formData, contractType: e.target.value})} style={{ flex: 1 }}>
            <option value="CDI">CDI</option><option value="CDD">CDD</option>
            <option value="Alternance">Alternance</option><option value="Stage">Stage</option><option value="Freelance">Freelance</option>
          </select>
          <select value={formData.workRhythm} onChange={e => setFormData({...formData, workRhythm: e.target.value})} style={{ flex: 1 }}>
            <option value="Présentiel">Présentiel</option><option value="Hybride">Hybride</option><option value="Télétravail total">Télétravail total</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="number" placeholder="Min" value={formData.salary.mini} onChange={e => setFormData({...formData, salary: {...formData.salary, mini: e.target.value}})} style={{ flex: 1 }} />
          <input type="number" placeholder="Max" value={formData.salary.maxi} onChange={e => setFormData({...formData, salary: {...formData.salary, maxi: e.target.value}})} style={{ flex: 1 }} />
          <input type="text" maxLength="3" placeholder="Devise (EUR)" value={formData.salary.currency} onChange={e => setFormData({...formData, salary: {...formData.salary, currency: e.target.value.toUpperCase()}})} style={{ width: '80px' }} />
        </div>
      </fieldset>

      <fieldset style={{ padding: '10px', borderRadius: '5px' }}>
        <legend>Profil recherché</legend>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input placeholder="Études requises (ex: Bac+5)" value={formData.educationRequired} onChange={e => setFormData({...formData, educationRequired: e.target.value})} style={{ flex: 1 }} />
          <input type="number" placeholder="Années d'exp. (Seniority)" value={formData.seniority} onChange={e => setFormData({...formData, seniority: e.target.value})} style={{ flex: 1 }} />
        </div>
        <input placeholder="Compétences (séparées par des virgules)" value={formData.skillsRequired} onChange={e => setFormData({...formData, skillsRequired: e.target.value})} style={{ width: '100%', marginBottom: '10px' }} />
        <input placeholder="Tags (séparés par des virgules)" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} style={{ width: '100%', marginBottom: '10px' }} />
        
        <label>Date de publication :</label>
        <input type="date" value={formData.publishedDate} onChange={e => setFormData({...formData, publishedDate: e.target.value})} style={{ width: '100%', marginBottom: '10px' }} />
        <input type="url" placeholder="Lien de l'offre" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} style={{ width: '100%' }} />
      </fieldset>

      <fieldset style={{ padding: '10px', borderRadius: '5px' }}>
        <legend>Auteur de l'offre (Optionnel)</legend>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input placeholder="Nom" value={formData.author.name} onChange={e => setFormData({...formData, author: {...formData.author, name: e.target.value}})} style={{ flex: 1 }} />
          <input placeholder="Email" value={formData.author.email} onChange={e => setFormData({...formData, author: {...formData.author, email: e.target.value}})} style={{ flex: 1 }} />
        </div>
      </fieldset>

      <fieldset style={{ padding: '10px', borderRadius: '5px' }}>
        <legend>Contacts supplémentaires</legend>
        {formData.contacts.map((c, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', backgroundColor: '#f0f0f0', padding: '5px' }}>
            <span>{c.name} - {c.email}</span>
            <button type="button" onClick={() => handleRemoveTempContact(index)} style={{ color: 'red', border: 'none', background: 'none' }}>X</button>
          </div>
        ))}
        <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
          <input placeholder="Nom" value={tempContact.name} onChange={e => setTempContact({...tempContact, name: e.target.value})} style={{ flex: 1 }} />
          <input placeholder="Email" value={tempContact.email} onChange={e => setTempContact({...tempContact, email: e.target.value})} style={{ flex: 1 }} />
          <button type="button" onClick={handleAddTempContact}>Ajouter</button>
        </div>
      </fieldset>
      
      <button type="submit" disabled={loading} style={{ backgroundColor: '#38bdf8', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
        {loading ? 'Création en cours...' : 'Créer l\'offre'}
      </button>
    </form>
  );
};

export default JobCreateForm;