import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import apiService from '../../services/ApiService';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';

const JobScreen = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await apiService.getJobs();
        const jobsData = response.data ? response.data : response; 
        setJobs(Array.isArray(jobsData) ? jobsData : []); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading){
    return (<Layout><p>Chargement des offres...</p></Layout>);
  }
  if (error) {
    return (<Layout><p style={{ color: 'red' }}>Erreur : {error}</p></Layout>);
  }

  return (
        <Layout>
      <div className="jobs-container">
        <div className="jobs-header">
          <h1>Offres d'emploi</h1>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/create')}
          >
            + Ajouter une offre
          </button>
        </div>

        {jobs.length === 0 ? (
          <p>Aucun job trouvé.</p>
        ) : (
          <ul className="job-list">
            {jobs.map(job => (
              <li key={job._id} className="job-card">
                <h3>{job.title}</h3>
                <p><strong>Entreprise :</strong> {job.company}</p>
                <p><strong>Lieu :</strong> {job.location}</p>
                <p><strong>Type :</strong> {job.contractType}</p>
                <NavLink 
                  to={`/jobs/${job._id}`} 
                  className="btn btn-outline btn-sm"
                  style={{ alignSelf: 'flex-start' }} // conservé si nécessaire, mais peut être supprimé si la classe suffit
                >
                  Voir les détails →
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default JobScreen;