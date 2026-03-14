import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/ApiService';
import ApplicationItem from '../../components/ApplicationItem';

const ApplicationScreen = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await apiService.getApplications(); 
        setApplications(data);
      } catch (err) {
        alert("Erreur : " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  if (loading) return <p>Chargement des candidatures...</p>;

  return (
    <div>
      <h1>Mes Candidatures</h1>
      {applications.length === 0 ? (
        <p>Aucune candidature enregistrée. <button onClick={() => navigate('/create')}>Postuler maintenant</button></p>
      ) : (
        <div>
          {applications.map(app => (
            <ApplicationItem 
              key={app._id} 
              app={app} 
              onDelete={(id) => setApplications(prev => prev.filter(a => a._id !== id))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationScreen;