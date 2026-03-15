import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Layout from "../../components/Layout";

const HomeScreen = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  useEffect(() => {
    document.title = "Accueil - NextRole";
  }, []);
  return (
    <Layout>
    <div className="home-container">
      
      <div>
        <h1>
          Prenez le contrôle de votre carrière avec NextRole
        </h1>
        <p>
          L'outil tout-en-un conçu pour organiser votre recherche d'emploi. Suivez vos offres favorites, gérez vos candidatures étape par étape et n'oubliez plus aucune relance.
        </p>
        
        {isAuthenticated ? (
          <button 
            onClick={() => navigate('/jobs')}
            
          >
            Reprendre mes recherches, {user?.firstName || 'expert'} !
          </button>
        ) : (
          <button 
            onClick={() => navigate('/login')}>
            Commencer gratuitement
          </button>
        )}
      </div>

      <hr />

      <h2 >Pourquoi utiliser NextRole ?</h2>
      
      <div >
        
        <div >
          <div >📋</div>
          <h3 >Centralisez vos annonces</h3>
          <p >
            Sauvegardez les offres d'emploi qui vous intéressent (salaire, rythme, entreprise) pour ne jamais perdre le fil.
          </p>
        </div>

        <div >
          <div >🚀</div>
          <h3>Suivez vos candidatures</h3>
          <p >
            Passez du statut "Postulé" à "Entretien" ou "Test Technique" en un clic. Ayez toujours une vue claire sur vos processus en cours.
          </p>
        </div>

        <div >
          <div>⏰</div>
          <h3>Gérez vos relances</h3>
          <p>
            Stockez les informations des recruteurs (LinkedIn, emails) et ajoutez un historique précis de toutes vos relances pour maximiser vos chances.
          </p>
        </div>

      </div>
    </div>
    </Layout>
  );
};

export default HomeScreen;