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
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await apiService.getJobById(id);
        setJob(data);
      } catch (err) {
        alert(err.message);
      }
    };
    fetchJob();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Supprimer définitivement cette offre ?")) {
      try {
        await apiService.deleteJob(id);
        navigate('/jobs');
      } catch (err) { alert(err.message); }
    }
  };

  if (!job) return <p>Chargement du job...</p>;

  return (
    <div>
      <button onClick={() => navigate('/jobs')}>← Retour à la liste</button>
      
      {isEditing ? (
        <JobEditForm 
          job={job} 
          onCancel={() => setIsEditing(false)} 
          onUpdate={(updated) => { setJob(updated); setIsEditing(false); }} 
        />
      ) : (
        <div>
          <h1>{job.title}</h1>
          <h2>{job.company} - {job.location}</h2>
          <button onClick={() => setIsEditing(true)}>Modifier les infos générales</button>
          <button onClick={handleDelete} style={{ color: 'red' }}>Supprimer l'offre</button>
          
          <hr />
          <p><strong>Contrat :</strong> {job.contractType}</p>
          <p><strong>Rythme :</strong> {job.workRhythm}</p>
          <p><strong>Salaire :</strong> {job.salary?.mini} - {job.salary?.maxi} {job.salary?.currency}</p>
        </div>
      )}

      <hr />
      <TagManager 
        jobId={job._id} 
        initialTags={job.tags} 
        onUpdate={(newTags) => setJob({...job, tags: newTags})} 
      />

      <hr />
      <ContactManager 
        jobId={job._id} 
        initialContacts={job.contacts} 
      />
    </div>
  );
};

export default JobDetailsScreen;