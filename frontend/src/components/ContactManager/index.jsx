import React, { useState } from 'react';
import apiService from '../../services/ApiService';

const ContactManager = ({ jobId, initialContacts }) => {
  const [contacts, setContacts] = useState(initialContacts || []);
  const [showForm, setShowForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', position: '', email: '', linkedin: '' });

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      await apiService.addContact(jobId, newContact);
      setContacts([...contacts, newContact]);
      setShowForm(false);
      setNewContact({ name: '', position: '', email: '', linkedin: '' });
    } catch (err) { alert(err.message); }
  };

  return (
    <div>
      <h4>Contacts</h4>
      <ul>
        {contacts.map((c, i) => (
          <li key={i}>{c.name} ({c.position}) - {c.email}</li>
        ))}
      </ul>
      
      {!showForm ? (
        <button onClick={() => setShowForm(true)}>Ajouter un contact</button>
      ) : (
        <form onSubmit={handleAddContact}>
          <input placeholder="Nom" onChange={e => setNewContact({...newContact, name: e.target.value})} required />
          <input placeholder="Poste" onChange={e => setNewContact({...newContact, position: e.target.value})} />
          <input placeholder="Email" onChange={e => setNewContact({...newContact, email: e.target.value})} />
          <button type="submit">Valider</button>
          <button type="button" onClick={() => setShowForm(false)}>Annuler</button>
        </form>
      )}
    </div>
  );
};

export default ContactManager;