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
    <div>
      <div >
        <div>
          <h3 >{currentApp.job?.title || "Offre sans titre"}</h3>
          <p >{currentApp.job?.company || "Entreprise inconnue"}</p>
        </div>
        
        <StatusManager 
          appId={currentApp._id} 
          status={currentApp.status} 
          onUpdate={(newStatus) => setCurrentApp({...currentApp, status: newStatus})} 
        />
      </div>

      <p >Postulé le : {new Date(currentApp.appliedDate).toLocaleDateString()}</p>
      {currentApp.notes && <p ><strong>Notes :</strong> {currentApp.notes}</p>}

      <FollowUpManager 
        appId={currentApp._id}
        followUps={currentApp.followUps}
        onUpdate={(newFollowUps) => setCurrentApp({...currentApp, followUps: newFollowUps})}
      />

      <div >
        <button 
          onClick={() => navigate(`/jobs/${currentApp.job?._id}`)}
          
        >
          Voir l'offre associée
        </button>
        <button 
          onClick={handleDelete} 
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default ApplicationItem;