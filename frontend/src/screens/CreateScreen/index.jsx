import React, { useState } from 'react';
import JobCreateForm from '../../components/JobCreateForm';
import ApplicationCreateForm from '../../components/ApplicationCreateForm';
import Layout from '../../components/Layout';

const CreateScreen = () => {
  const [activeTab, setActiveTab] = useState('job');

  return (
    <Layout>
      <div className="create-screen">
        <h1>Centre de Création</h1>
        <div className="create-tabs">
          <button 
            className={activeTab === 'job' ? 'active' : ''}
            onClick={() => setActiveTab('job')}
          >
            Nouvelle Offre (Job)
          </button>
          <button 
            className={activeTab === 'app' ? 'active' : ''}
            onClick={() => setActiveTab('app')}
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