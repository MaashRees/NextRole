import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import apiService from '../../services/ApiService';

const JobScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await apiService.getJobs();
        setJobs(data);
      } catch (err) {
        alert("Erreur lors de la récupération : " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <p>Chargement des offres...</p>;

  return (
    <div>
      <h1>Offres d'emploi</h1>
      {jobs.length === 0 ? <p>Aucun job trouvé.</p> : (
        <ul>
          {jobs.map(job => (
            <li key={job._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <h3>{job.title}</h3>
              <p><strong>Entreprise :</strong> {job.company}</p>
              <p><strong>Lieu :</strong> {job.location}</p>
              <p><strong>Type :</strong> {job.contractType}</p>
              
              <NavLink to={`/jobs/${job._id}`}>Voir plus</NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobScreen;