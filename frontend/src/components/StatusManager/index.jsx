import React from 'react';
import apiService from '../../services/ApiService';

const StatusManager = ({ appId, status, onUpdate }) => {
  const statusList = ['En attente', 'Postulé', 'Entretien', 'Test Technique', 'Offre', 'Refusé'];

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await apiService.updateApplicationStatus(appId, newStatus);
      onUpdate(newStatus);
    } catch (err) {
      alert("Erreur lors du changement de statut : " + err.message);
    }
  };

  return (
    <div>
      <label>Statut : </label>
      <select value={status} onChange={handleChange}>
        {statusList.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
};

export default StatusManager;