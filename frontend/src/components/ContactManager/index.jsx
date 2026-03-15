import React, { useState } from 'react';
import apiService from '../../services/ApiService';

const ContactManager = ({ jobId, initialContacts }) => {
  const [contacts, setContacts] = useState(initialContacts || []);
  const [showForm, setShowForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', position: '', email: '', linkedin: '' });

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.addContact(jobId, newContact);
      const addedData = response.data ? response.data : newContact; 
      
      setContacts([...contacts, addedData]);
      setShowForm(false);
      setNewContact({ name: '', position: '', email: '', linkedin: '' });
    } catch (err) { alert(err.message); }
  };

  const handleRemoveContact = async (contactId) => {
    if (!contactId) return alert("Veuillez rafraîchir la page pour supprimer ce contact récemment ajouté.");
    
    try {
      await apiService.removeContact(jobId, contactId);
      const updatedContacts = contacts.filter(c => c._id !== contactId);
      setContacts(updatedContacts);
    } catch (err) { 
      alert("Erreur lors de la suppression : " + err.message); 
    }
  };

  return (
        <div className="contact-manager">
      <h4>Contacts</h4>
      {contacts.length > 0 ? (
        <ul className="contact-list">
          {contacts.map((c, i) => (
            <li key={c._id || i} className="contact-item">
              <div>
                <strong>{c.name}</strong> {c.position && `(${c.position})`} <br />
                <small>{c.email}</small>
              </div>
              <button 
                className="btn btn-danger btn-sm"
                onClick={() => handleRemoveContact(c._id)} 
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun contact enregistré.</p>
      )}
      
      {!showForm ? (
        <button className="btn btn-outline" onClick={() => setShowForm(true)}>+ Ajouter un contact</button>
      ) : (
        <form onSubmit={handleAddContact} className="contact-form">
          <input placeholder="Nom" value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} required />
          <input placeholder="Poste" value={newContact.position} onChange={e => setNewContact({...newContact, position: e.target.value})} />
          <input placeholder="Email" value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})} />
          <input placeholder="LinkedIn" value={newContact.linkedin} onChange={e => setNewContact({...newContact, linkedin: e.target.value})} />
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Valider</button>
            <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Annuler</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactManager;