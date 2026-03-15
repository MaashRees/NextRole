import React, { useState } from 'react';
import JobCreateForm from '../../components/JobCreateForm';
import ApplicationCreateForm from '../../components/ApplicationCreateForm';
import Layout from '../../components/Layout';

const CreateScreen = () => {
  const [activeTab, setActiveTab] = useState('job');

  return (
    <Layout>
    <div>
      <h1>Centre de Création</h1>
      <div>
        <button 
          onClick={() => setActiveTab('job')}
          style={{ fontWeight: activeTab === 'job' ? 'bold' : 'normal' }}
        >
          Nouvelle Offre (Job)
        </button>
        <button 
          onClick={() => setActiveTab('app')}
          style={{ fontWeight: activeTab === 'app' ? 'bold' : 'normal' }}
        >
          Nouvelle Candidature
        </button>
      </div>

      <hr />

      {activeTab === 'job' ? (
        <JobCreateForm onSuccess={() => setActiveTab('app')} />
      ) : (
        <ApplicationCreateForm />
      )}
    </div>
    </Layout>
  );
};

export default CreateScreen;