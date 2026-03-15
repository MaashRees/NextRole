import React, { useState } from 'react';
import apiService from '../../services/ApiService';

const StatusManager = ({ appId, status, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const statusList = ['En attente', 'Postulé', 'Entretien', 'Test Technique', 'Offre', 'Refusé'];

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setIsUpdating(true);
    try {
      await apiService.updateApplicationStatus(appId, newStatus);
      onUpdate(newStatus);
    } catch (err) {
      alert("Erreur lors du changement de statut : " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="status-manager">
      <label>Statut :</label>
      <select 
        value={status} 
        onChange={handleChange}
        disabled={isUpdating}
      >
        {statusList.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
};

export default StatusManager;