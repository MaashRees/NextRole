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
        const response = await apiService.getApplications();
        const appsData = response.data ? response.data : response;
        setApplications(Array.isArray(appsData) ? appsData : []);
      } catch (err) {
        alert("Erreur lors du chargement des candidatures : " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  if (loading) return <p>Chargement des candidatures...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Mes Candidatures</h1>
        <button 
          onClick={() => navigate('/create')}
          style={{ backgroundColor: '#38bdf8', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + Nouvelle Candidature
        </button>
      </div>

      {applications.length === 0 ? (
        <p>Aucune candidature enregistrée pour le moment.</p>
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