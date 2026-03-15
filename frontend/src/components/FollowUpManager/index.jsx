import React, { useState } from 'react';
import apiService from '../../services/ApiService';

const FollowUpManager = ({ appId, followUps, onUpdate }) => {
  const [note, setNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddFollowUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiService.addFollowUp(appId, {
        date: new Date().toISOString(),
        note: note
      });
      
      const updatedApp = response.data ? response.data : response;
      onUpdate(updatedApp.followUps); 
      
      setNote(''); 
      setIsAdding(false);
    } catch (err) {
      alert("Erreur lors de l'ajout de la relance : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div >
      <h4>Historique des relances</h4>
      
      {followUps?.dates?.length > 0 ? (
        <ul >
          {followUps.dates.map((d, i) => (
            <li key={i}>Relancé le : <strong>{new Date(d).toLocaleDateString()}</strong></li>
          ))}
        </ul>
      ) : <p >Aucune relance effectuée.</p>}

      <p ><strong>Notes de suivi :</strong> {followUps?.notes || "Aucune note globale"}</p>

      {!isAdding ? (
        <button 
          onClick={() => setIsAdding(true)}
        >
          + Ajouter une relance
        </button>
      ) : (
        <form onSubmit={handleAddFollowUp} >
          <textarea 
            placeholder="Note concernant cette relance..." 
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div >
            <button type="submit" disabled={loading} >
              {loading ? "Enregistrement..." : "Valider"}
            </button>
            <button type="button" onClick={() => setIsAdding(false)} style={{ padding: '6px 12px' }}>
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FollowUpManager;