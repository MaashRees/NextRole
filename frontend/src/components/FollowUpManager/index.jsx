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
      console.error("Erreur lors de l'ajout de la relance : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="followup-manager">
      <h4>Historique des relances</h4>
      
      {followUps?.dates?.length > 0 ? (
        <ul className="followup-list">
          {followUps.dates.map((d, i) => (
            <li key={i} className="followup-item">
              Relancé le : <strong>{new Date(d).toLocaleDateString()}</strong>
            </li>
          ))}
        </ul>
      ) : <p>Aucune relance effectuée.</p>}

      <p><strong>Notes de suivi :</strong> {followUps?.notes || "Aucune note globale"}</p>

      {!isAdding ? (
        <button 
          className="btn btn-outline"
          onClick={() => setIsAdding(true)}
        >
          + Ajouter une relance
        </button>
      ) : (
        <form onSubmit={handleAddFollowUp} className="followup-form">
          <textarea 
            placeholder="Note concernant cette relance..." 
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Enregistrement..." : "Valider"}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setIsAdding(false)}>
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FollowUpManager;