import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/ApiService';

const JobCreateForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', 
    company: '', 
    location: '',
    workRhythm: 'Présentiel', 
    contractType: 'CDI',
    salary: { mini: 0, maxi: 0, currency: 'EUR' },
    link: '', 
    publishedDate: '', 
    educationRequired: '',
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

  const isSimpleJob = () => {
    const hasAdvancedFields = 
      formData.educationRequired?.trim() !== '' ||
      (formData.skillsRequired?.trim() !== '' && formData.skillsRequired.split(',').filter(s => s.trim()).length > 0) ||
      (formData.author?.name?.trim() !== '') ||
      (formData.contacts?.length > 0);
    
    return !hasAdvancedFields;
  };

  const preparePayload = () => {
    const skillsArray = formData.skillsRequired 
      ? formData.skillsRequired.split(',').map(s => s.trim()).filter(s => s) 
      : [];
    
    const tagsArray = formData.tags 
      ? formData.tags.split(',').map(t => t.trim()).filter(t => t) 
      : [];
    const basePayload = {
      title: formData.title,
      company: formData.company,
      location: formData.location,
      workRhythm: formData.workRhythm,
      contractType: formData.contractType,
      salary: {
        mini: Number(formData.salary.mini) || 0,
        maxi: Number(formData.salary.maxi) || 0,
        currency: formData.salary.currency.toUpperCase() || 'EUR'
      },
      seniority: formData.seniority ? Number(formData.seniority) : -1,
    };
    if (formData.link) basePayload.link = formData.link;
    if (formData.publishedDate) basePayload.publishedDate = formData.publishedDate;
    if (tagsArray.length > 0) basePayload.tags = tagsArray;
    if (isSimpleJob()) {
      return basePayload;
    }
    return {
      ...basePayload,
      educationRequired: formData.educationRequired || '',
      skillsRequired: skillsArray,
      ...(formData.author?.name?.trim() && { author: formData.author }),
      ...(formData.contacts?.length > 0 && { contacts: formData.contacts })
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = preparePayload();
      const useSimple = isSimpleJob();
      
      console.log('Création de job:', { 
        type: useSimple ? 'simple' : 'complet', 
        payload 
      });

      let response;
      if (useSimple) {
        response = await apiService.createSimpleJob(payload);
      } else {
        response = await apiService.createJob(payload);
      }

      alert("Offre créée avec succès !");
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      alert("Erreur lors de la création : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="job-form">
      <h3>Créer une offre d'emploi</h3>
      
      <fieldset>
        <legend>Informations générales</legend>
        <input 
          placeholder="Titre du poste *" 
          value={formData.title} 
          onChange={e => setFormData({...formData, title: e.target.value})} 
          required 
        />
        <input 
          placeholder="Entreprise *" 
          value={formData.company} 
          onChange={e => setFormData({...formData, company: e.target.value})} 
          required 
        />
        <input 
          placeholder="Lieu *" 
          value={formData.location} 
          onChange={e => setFormData({...formData, location: e.target.value})} 
          required 
        />
      </fieldset>

      <fieldset>
        <legend>Contrat & Salaire</legend>
        <div className="form-row">
          <select 
            value={formData.contractType} 
            onChange={e => setFormData({...formData, contractType: e.target.value})}
          >
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Alternance">Alternance</option>
            <option value="Stage">Stage</option>
            <option value="Freelance">Freelance</option>
          </select>
          <select 
            value={formData.workRhythm} 
            onChange={e => setFormData({...formData, workRhythm: e.target.value})}
          >
            <option value="Présentiel">Présentiel</option>
            <option value="Hybride">Hybride</option>
            <option value="Télétravail total">Télétravail total</option>
          </select>
        </div>
        <div className="form-row">
          <label>Salaire</label>
          <input 
            type="number" 
            placeholder="Min" 
            value={formData.salary.mini} 
            onChange={e => setFormData({...formData, salary: {...formData.salary, mini: e.target.value}})} 
          />
          <input 
            type="number" 
            placeholder="Max" 
            value={formData.salary.maxi} 
            onChange={e => setFormData({...formData, salary: {...formData.salary, maxi: e.target.value}})} 
          />
          <input 
            type="text" 
            maxLength="3" 
            placeholder="Devise (EUR)" 
            value={formData.salary.currency} 
            onChange={e => setFormData({...formData, salary: {...formData.salary, currency: e.target.value.toUpperCase()}})} 
            style={{ width: '80px' }} 
          />
        </div>
      </fieldset>

      <fieldset>
        <legend>Profil recherché</legend>
        <div className="form-row">
          <input 
            placeholder="Études requises (ex: Bac+5)" 
            value={formData.educationRequired} 
            onChange={e => setFormData({...formData, educationRequired: e.target.value})} 
          />
          <input 
            type="number" 
            placeholder="Années d'exp. (Seniority)" 
            value={formData.seniority} 
            onChange={e => setFormData({...formData, seniority: e.target.value})} 
          />
        </div>
        <input 
          placeholder="Compétences (séparées par des virgules)" 
          value={formData.skillsRequired} 
          onChange={e => setFormData({...formData, skillsRequired: e.target.value})} 
        />
        <input 
          placeholder="Tags (séparés par des virgules)" 
          value={formData.tags} 
          onChange={e => setFormData({...formData, tags: e.target.value})} 
        />
        
        <label>Date de publication :</label>
        <input 
          type="date" 
          value={formData.publishedDate} 
          onChange={e => setFormData({...formData, publishedDate: e.target.value})} 
        />
        <input 
          type="url" 
          placeholder="Lien de l'offre" 
          value={formData.link} 
          onChange={e => setFormData({...formData, link: e.target.value})} 
        />
      </fieldset>

      <fieldset>
        <legend>Auteur de l'offre (Optionnel)</legend>
        <div className="form-row">
          <input 
            placeholder="Nom" 
            value={formData.author.name} 
            onChange={e => setFormData({...formData, author: {...formData.author, name: e.target.value}})} 
          />
          <input 
            placeholder="Email" 
            value={formData.author.email} 
            onChange={e => setFormData({...formData, author: {...formData.author, email: e.target.value}})} 
          />
        </div>
      </fieldset>

      <fieldset>
        <legend>Contacts supplémentaires</legend>
        {formData.contacts.map((c, index) => (
          <div key={index} className="contact-temp">
            <span>{c.name} - {c.email}</span>
            <button 
              type="button" 
              className="btn btn-danger btn-sm" 
              onClick={() => handleRemoveTempContact(index)}
            >
              X
            </button>
          </div>
        ))}
        <div className="form-row">
          <input 
            placeholder="Nom" 
            value={tempContact.name} 
            onChange={e => setTempContact({...tempContact, name: e.target.value})} 
          />
          <input 
            placeholder="Email" 
            value={tempContact.email} 
            onChange={e => setTempContact({...tempContact, email: e.target.value})} 
          />
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleAddTempContact}
          >
            Ajouter
          </button>
        </div>
      </fieldset>
      
      <div className="form-actions">
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
        >
          {loading ? 'Création en cours...' : 'Créer l\'offre'}
        </button>
      </div>
    </form>
  );
};

export default JobCreateForm;