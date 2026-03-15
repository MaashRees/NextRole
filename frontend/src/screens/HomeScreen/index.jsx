import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const HomeScreen = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  useEffect(() => {
    document.title = "Accueil - NextRole";
  }, []);
  return (
    <div className="home-container" style={{ textAlign: 'center', padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '60px', marginTop: '40px' }}>
        <h1 style={{ fontSize: '3rem', color: '#0ea5e9', marginBottom: '20px' }}>
          Prenez le contrôle de votre carrière avec NextRole
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '700px', margin: '0 auto 30px', lineHeight: '1.6' }}>
          L'outil tout-en-un conçu pour organiser votre recherche d'emploi. Suivez vos offres favorites, gérez vos candidatures étape par étape et n'oubliez plus aucune relance.
        </p>
        
        {isAuthenticated ? (
          <button 
            onClick={() => navigate('/jobs')}
            style={{ backgroundColor: '#0ea5e9', color: 'white', padding: '15px 30px', fontSize: '1.1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(14, 165, 233, 0.3)' }}
          >
            Reprendre mes recherches, {user?.firstName || 'expert'} !
          </button>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            style={{ backgroundColor: '#0ea5e9', color: 'white', padding: '15px 30px', fontSize: '1.1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(14, 165, 233, 0.3)' }}
          >
            Commencer gratuitement
          </button>
        )}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '60px 0' }} />

      <h2 style={{ fontSize: '2rem', marginBottom: '40px', color: '#334155' }}>Pourquoi utiliser NextRole ?</h2>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
        
        <div style={{ flex: '1 1 300px', backgroundColor: '#f8fafc', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'left' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>📋</div>
          <h3 style={{ marginBottom: '15px', color: '#0f172a' }}>Centralisez vos annonces</h3>
          <p style={{ color: '#475569', lineHeight: '1.6' }}>
            Sauvegardez les offres d'emploi qui vous intéressent (salaire, rythme, entreprise) pour ne jamais perdre le fil.
          </p>
        </div>

        <div style={{ flex: '1 1 300px', backgroundColor: '#f8fafc', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'left' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🚀</div>
          <h3 style={{ marginBottom: '15px', color: '#0f172a' }}>Suivez vos candidatures</h3>
          <p style={{ color: '#475569', lineHeight: '1.6' }}>
            Passez du statut "Postulé" à "Entretien" ou "Test Technique" en un clic. Ayez toujours une vue claire sur vos processus en cours.
          </p>
        </div>

        <div style={{ flex: '1 1 300px', backgroundColor: '#f8fafc', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'left' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>⏰</div>
          <h3 style={{ marginBottom: '15px', color: '#0f172a' }}>Gérez vos relances</h3>
          <p style={{ color: '#475569', lineHeight: '1.6' }}>
            Stockez les informations des recruteurs (LinkedIn, emails) et ajoutez un historique précis de toutes vos relances pour maximiser vos chances.
          </p>
        </div>

      </div>
    </div>
  );
};

export default HomeScreen;