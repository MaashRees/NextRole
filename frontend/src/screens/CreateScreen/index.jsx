import React, { useState } from 'react';
import JobCreateForm from '../../components/JobCreateForm';
import ApplicationCreateForm from '../../components/ApplicationCreateForm';
import JobUpload from '../../components/JobUpload';
import OcrReview from '../../components/OcrReview';
import Layout from '../../components/Layout';

const CreateScreen = () => {
  const [activeTab, setActiveTab] = useState('job');
  // Stores the pending job returned by the OCR upload, waiting for user review
  const [pendingOcrJob, setPendingOcrJob] = useState(null);

  const handleUploadSuccess = (job) => {
    setPendingOcrJob(job);
  };

  const handleOcrValidated = (validatedJob) => {
    setPendingOcrJob(null);
    setActiveTab('job');
  };

  return (
    <Layout>
      <div className="create-screen">
        <h1>Centre de Création</h1>
        <div className="create-tabs">
          <button
            className={activeTab === 'job' ? 'active' : ''}
            onClick={() => { setActiveTab('job'); setPendingOcrJob(null); }}
          >
            📝 Nouvelle Offre (manuel)
          </button>
          <button
            className={activeTab === 'ocr' ? 'active' : ''}
            onClick={() => { setActiveTab('ocr'); setPendingOcrJob(null); }}
          >
            🤖 Importer PDF / IA
          </button>
          <button
            className={activeTab === 'app' ? 'active' : ''}
            onClick={() => setActiveTab('app')}
          >
            📬 Nouvelle Candidature
          </button>
        </div>

        <hr />

        {activeTab === 'job' && <JobCreateForm onSuccess={() => setActiveTab('app')} />}

        {activeTab === 'ocr' && (
          pendingOcrJob ? (
            <OcrReview job={pendingOcrJob} onValidated={handleOcrValidated} />
          ) : (
            <JobUpload onSuccess={handleUploadSuccess} />
          )
        )}

        {activeTab === 'app' && <ApplicationCreateForm />}
      </div>
    </Layout>
  );
};

export default CreateScreen;