import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/ApiService';
import { useAuth } from '../../contexts/AuthContext';
import ProfileDetails from '../../components/ProfileDetails';
import ProfileEditForm from '../../components/ProfileEditForm';
import Layout from '../../components/Layout';

const ProfileScreen = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [fullUser, setFullUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    age: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiService.getProfile();
        const userData = response.data ? response.data : response;
        setFullUser(userData);
        setFormData({
          email: userData.email || '',
          firstname: userData.firstname || '',
          lastname: userData.lastname || '',
          age: userData.age || ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedResponse = await apiService.updateProfile({
        ...formData,
        age: Number(formData.age)
      });
      const updatedUserData = updatedResponse.data ? updatedResponse.data : updatedResponse;
      setFullUser(updatedUserData);
      setIsEditing(false);
      console.log("Profil mis à jour avec succès !");
    } catch (err) {
      console.error("Erreur lors de la mise à jour : " + err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.");
    if (confirmDelete) {
      try {
        await apiService.deleteAccount();
        alert("Votre compte a été supprimé avec succès.");
        logout();
        navigate('/');
      } catch (err) {
        alert("Erreur lors de la suppression : " + err.message);
      }
    }
  };

  if (loading){
    return (<Layout><p>Chargement de votre profil...</p></Layout>);
  }
  if (error) {
    return (<Layout><p style={{ color: 'red' }}>Erreur : {error}</p></Layout>);
  }

  return (
    <Layout>
    <div className="profile-container">
      <h2>Mon Profil</h2>
      
      {/* Affichage conditionnel avec tes nouveaux composants découpés */}
      {!isEditing ? (
        <ProfileDetails 
          user={fullUser} 
          onEditClick={() => setIsEditing(true)} 
        />
      ) : (
        <ProfileEditForm 
          formData={formData} 
          setFormData={setFormData} 
          onSubmit={handleUpdate} 
          onCancel={() => setIsEditing(false)} 
        />
      )}

      <hr  />
      
      <button 
        onClick={handleLogout} 
        
      >
        Déconnexion
      </button>
      
      <button 
        onClick={handleDeleteAccount} 
        
      >
        Supprimer mon compte
      </button>
    </div>
    </Layout>
  );
};

export default ProfileScreen;