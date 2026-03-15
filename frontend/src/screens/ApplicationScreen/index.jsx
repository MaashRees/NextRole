import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/ApiService';
import ApplicationItem from '../../components/ApplicationItem';
import Layout from '../../components/Layout';

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

  if (loading) {
    return 
    <Layout>
      <p>Chargement des candidatures...</p>;
    </Layout>
  }
  return (
        <Layout>
      <div className="applications-container">
        <div className="applications-header">
          <h1>Mes Candidatures</h1>
          <button className="btn btn-primary" onClick={() => navigate('/create')}>
            + Nouvelle Candidature
          </button>
        </div>

        {applications.length === 0 ? (
          <p>Aucune candidature enregistrée pour le moment.</p>
        ) : (
          <div className="application-list">
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
    </Layout>
  );
};

export default ApplicationScreen;