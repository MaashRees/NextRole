import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../services/ApiService';
import JobEditForm from '../../components/JobEditForm';
import TagManager from '../../components/TagManager';
import ContactManager from '../../components/ContactManager';
import Layout from '../../components/Layout';

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

  if (loading) {
    return (<Layout><p>Chargement des détails du job...</p></Layout>);
  }
  if (error) {
    return (<Layout><p style={{ color: 'red' }}>Erreur : {error}</p></Layout>);
  }
  if (!job) {
    return (<Layout><p>Job introuvable.</p></Layout>);
  }
  return (
        <Layout>
      <div className="job-details-container">
        <button className="btn btn-outline mb-2" onClick={() => navigate('/jobs')}>
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
            
            <div className="form-actions" style={{ margin: '15px 0' }}>
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                Modifier les infos
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Supprimer l'offre
              </button>
            </div>
            
            <hr />
            <div className="job-meta">
              <p><strong>Contrat :</strong> {job.contractType}</p>
              <p><strong>Rythme :</strong> {job.workRhythm}</p>
              <p><strong>Salaire :</strong> {job.salary?.mini} - {job.salary?.maxi} {job.salary?.currency}</p>
            </div>
          </div>
        )}

        <hr/>
        <TagManager 
          jobId={job._id} 
          initialTags={job.tags || []} 
          onUpdate={(newTags) => setJob({...job, tags: newTags})} 
        />

        <hr />
        <ContactManager 
          jobId={job._id} 
          initialContacts={job.contacts || []} 
        />
      </div>
    </Layout>
  );
};

export default JobDetailsScreen;