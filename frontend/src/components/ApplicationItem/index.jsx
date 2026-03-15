import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/ApiService';
import StatusManager from '../StatusManager';
import FollowUpManager from '../FollowUpManager';

const ApplicationItem = ({ app, onDelete }) => {
  const navigate = useNavigate();
  const [currentApp, setCurrentApp] = useState(app);

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette candidature ?")) {
      try {
        await apiService.deleteApplication(currentApp._id); 
        onDelete(currentApp._id);
      } catch (err) { alert("Erreur lors de la suppression : " + err.message); }
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', margin: '15px 0', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: '0 0 10px 0' }}>{currentApp.job?.title || "Offre sans titre"}</h3>
          <p style={{ margin: '0 0 15px 0', color: 'gray' }}>{currentApp.job?.company || "Entreprise inconnue"}</p>
        </div>
        
        <StatusManager 
          appId={currentApp._id} 
          status={currentApp.status} 
          onUpdate={(newStatus) => setCurrentApp({...currentApp, status: newStatus})} 
        />
      </div>

      <p style={{ fontSize: '0.9rem' }}>Postulé le : {new Date(currentApp.appliedDate).toLocaleDateString()}</p>
      {currentApp.notes && <p style={{ fontSize: '0.9rem' }}><strong>Notes :</strong> {currentApp.notes}</p>}

      <FollowUpManager 
        appId={currentApp._id}
        followUps={currentApp.followUps}
        onUpdate={(newFollowUps) => setCurrentApp({...currentApp, followUps: newFollowUps})}
      />

      <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
        <button 
          onClick={() => navigate(`/jobs/${currentApp.job?._id}`)}
          style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', background: 'white' }}
        >
          Voir l'offre associée
        </button>
        <button 
          onClick={handleDelete} 
          style={{ color: '#ef4444', border: '1px solid #ef4444', background: 'white', padding: '8px 12px', marginLeft: '10px', borderRadius: '4px', cursor: 'pointer' }}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default ApplicationItem;