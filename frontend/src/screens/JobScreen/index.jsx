import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import apiService from '../../services/ApiService';
import { useAuth } from '../../contexts/AuthContext';

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

  if (loading) return <p>Chargement des offres...</p>;
  if (error) return <p style={{ color: 'red' }}>Erreur : {error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Offres d'emploi</h1>
      <button 
          onClick={() => navigate('/create')}
          style={{ 
            backgroundColor: '#38bdf8', 
            color: 'white', 
            padding: '10px 20px', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          + Ajouter une offre
        </button>
      </div>
      {jobs.length === 0 ? <p>Aucun job trouvé.</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {jobs.map(job => (
            <li key={job._id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', borderRadius: '8px' }}>
              <h3>{job.title}</h3>
              <p><strong>Entreprise :</strong> {job.company}</p>
              <p><strong>Lieu :</strong> {job.location}</p>
              <p><strong>Type :</strong> {job.contractType}</p>
              
              <NavLink 
                to={`/jobs/${job._id}`} 
                style={{ display: 'inline-block', marginTop: '10px', color: '#007BFF', textDecoration: 'none' }}
              >
                Voir les détails →
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobScreen;