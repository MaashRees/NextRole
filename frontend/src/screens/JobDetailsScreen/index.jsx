import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../services/ApiService';
import JobEditForm from '../../components/JobEditForm';
import TagManager from '../../components/TagManager';
import ContactManager from '../../components/ContactManager';

const JobDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await apiService.getJobById(id);
        const jobData = response.data ? response.data : response;
        setJob(jobData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Supprimer définitivement cette offre ?")) {
      try {
        await apiService.deleteJob(id);
        navigate('/jobs');
      } catch (err) { 
        alert("Erreur lors de la suppression : " + err.message); 
      }
    }
  };

  if (loading) return <p>Chargement des détails du job...</p>;
  if (error) return <p style={{ color: 'red' }}>Erreur : {error}</p>;
  if (!job) return <p>Job introuvable.</p>;

  return (
    <div className="job-details-container">
      <button onClick={() => navigate('/jobs')} style={{ marginBottom: '20px' }}>
        ← Retour à la liste
      </button>
      
      {isEditing ? (
        <JobEditForm 
          job={job} 
          onCancel={() => setIsEditing(false)} 
          onUpdate={(updatedJob) => { 
            const newData = updatedJob.data ? updatedJob.data : updatedJob;
            setJob(newData); 
            setIsEditing(false); 
          }} 
        />
      ) : (
        <div className="job-info">
          <h1>{job.title}</h1>
          <h2>{job.company} - {job.location}</h2>
          
          <div style={{ margin: '15px 0', display: 'flex', gap: '10px' }}>
            <button onClick={() => setIsEditing(true)}>Modifier les infos</button>
            <button onClick={handleDelete} style={{ color: 'red' }}>Supprimer l'offre</button>
          </div>
          
          <hr />
          <div style={{ marginTop: '15px' }}>
            <p><strong>Contrat :</strong> {job.contractType}</p>
            <p><strong>Rythme :</strong> {job.workRhythm}</p>
            <p><strong>Salaire :</strong> {job.salary?.mini} - {job.salary?.maxi} {job.salary?.currency}</p>
          </div>
        </div>
      )}

      <hr style={{ margin: '30px 0' }} />
      <TagManager 
        jobId={job._id} 
        initialTags={job.tags || []} 
        onUpdate={(newTags) => setJob({...job, tags: newTags})} 
      />

      <hr style={{ margin: '30px 0' }} />
      <ContactManager 
        jobId={job._id} 
        initialContacts={job.contacts || []} 
      />
    </div>
  );
};

export default JobDetailsScreen;