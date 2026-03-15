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
    <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
      <h4 style={{ margin: '0 0 10px 0' }}>Historique des relances</h4>
      
      {followUps?.dates?.length > 0 ? (
        <ul style={{ paddingLeft: '20px', fontSize: '0.9rem' }}>
          {followUps.dates.map((d, i) => (
            <li key={i}>Relancé le : <strong>{new Date(d).toLocaleDateString()}</strong></li>
          ))}
        </ul>
      ) : <p style={{ fontSize: '0.9rem', color: 'gray' }}>Aucune relance effectuée.</p>}

      <p style={{ fontSize: '0.9rem' }}><strong>Notes de suivi :</strong> {followUps?.notes || "Aucune note globale"}</p>

      {!isAdding ? (
        <button 
          onClick={() => setIsAdding(true)}
          style={{ marginTop: '10px', padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer' }}
        >
          + Ajouter une relance
        </button>
      ) : (
        <form onSubmit={handleAddFollowUp} style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <textarea 
            placeholder="Note concernant cette relance..." 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ width: '100%', padding: '8px', minHeight: '60px' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" disabled={loading} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px' }}>
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