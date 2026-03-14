import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/ApiService';
import StatusManager from '../StatusManager';

import FollowUpManager from '../FollowUpManager';
const ApplicationItem = ({ app, onDelete }) => {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState(app.status);

  const handleDelete = async () => {
    if (window.confirm("Supprimer cette candidature ?")) {
      try {
        await apiService.deleteApplication(app._id); //
        onDelete(app._id);
      } catch (err) { alert(err.message); }
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', margin: '10px 0' }}>
      <h3>{app.job?.title || "Job inconnu"} - {app.job?.company}</h3>
      
      <StatusManager 
        appId={app._id} 
        status={currentStatus} 
        onUpdate={setCurrentStatus} 
      />

      <p>Postulé le : {new Date(app.appliedDate).toLocaleDateString()}</p>

      <FollowUpManager 
        appId={application._id}
        followUps={application.followUps}
        onUpdate={(newFollowUps) => setApplication({...application, followUps: newFollowUps})}
      />

      <div style={{ marginTop: '10px' }}>
        <button onClick={() => window.location.href=`/jobs/${application.job?._id}`}>Voir Job</button>
        <button onClick={() => onDelete(application._id)} style={{ color: 'red', marginLeft: '10px' }}>Supprimer</button>
      </div>
    </div>
  );
};
export default ApplicationItem;