import React, { useState } from 'react';
import apiService from '../../services/ApiService';

const FollowUpManager = ({ appId, followUps, onUpdate }) => {
  const [note, setNote] = useState(followUps?.notes || '');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddFollowUp = async (e) => {
    e.preventDefault();
    try {
      const updatedApp = await apiService.addFollowUp(appId, {
        date: new Date(),
        note: note
      });
      onUpdate(updatedApp.followUps);
      setIsAdding(false);
      alert("Relance enregistrée !");
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  return (
    <div style={{ marginTop: '10px', padding: '10px', borderTop: '1px dashed #ccc' }}>
      <h4>Suivi & Relances</h4>
      
      {followUps?.dates?.length > 0 ? (
        <ul>
          {followUps.dates.map((d, i) => (
            <li key={i}>Relancé le : {new Date(d).toLocaleDateString()}</li>
          ))}
        </ul>
      ) : <p>Aucune relance effectuée.</p>}

      <p><strong>Notes de suivi :</strong> {followUps?.notes || "Aucune note"}</p>

      {!isAdding ? (
        <button onClick={() => setIsAdding(true)}>Ajouter une relance</button>
      ) : (
        <form onSubmit={handleAddFollowUp}>
          <textarea 
            placeholder="Note sur cette relance..." 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
          />
          <br />
          <button type="submit">Valider la relance</button>
          <button type="button" onClick={() => setIsAdding(false)}>Annuler</button>
        </form>
      )}
    </div>
  );
};

export default FollowUpManager;