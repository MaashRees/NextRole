import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/ApiService';
import { useAuth } from '../../contexts/AuthContext';

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

  if (loading) return <p>Chargement de votre profil...</p>;
  if (error) return <p style={{ color: 'red' }}>Erreur : {error}</p>;

  return (
    <div className="profile-container">
      <h2>Mon Profil</h2>
      
      {!isEditing ? (
        <div className="profile-details">
          <p><strong>Prénom :</strong> {fullUser?.firstname}</p>
          <p><strong>Nom :</strong> {fullUser?.lastname}</p>
          <p><strong>Email :</strong> {fullUser?.email}</p>
          <p><strong>Âge :</strong> {fullUser?.age} ans</p>
          
          <button 
            onClick={() => setIsEditing(true)} 
            style={{ marginTop: '15px' }}
          >
            Éditer mon profil
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="profile-form">
          <div style={{ marginBottom: '10px' }}>
            <label><strong>Email :</strong> </label>
            <input 
              placeholder="Votre mail"
              value={fullUser?.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label><strong>Prénom : </strong></label>
            <input 
              placeholder="Votre prénom"
              value={formData.firstname} 
              onChange={(e) => setFormData({...formData, firstname: e.target.value})} 
            />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label><strong>Nom : </strong></label>
            <input 
              placeholder="Votre nom"
              value={formData.lastname} 
              onChange={(e) => setFormData({...formData, lastname: e.target.value})} 
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label><strong>Âge : </strong></label>
            <input 
              type="number"
              placeholder="Votre âge"
              value={formData.age} 
              onChange={(e) => setFormData({...formData, age: e.target.value})} 
            />
          </div>

          <div className="form-actions">
            <button type="submit" style={{ marginRight: '10px', backgroundColor: '#4CAF50', color: 'white' }}>
              Enregistrer les modifications
            </button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Annuler
            </button>
          </div>
        </form>
      )}

      <hr style={{ margin: '30px 0' }} />
      <button 
        onClick={handleLogout} 
        style={{ color: '#ef4444', border: '1px solid #ef4444', backgroundColor: 'transparent', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
      >
        Déconnexion
      </button>
      <button 
          onClick={handleDeleteAccount} 
          style={{ color: 'white', backgroundColor: '#ef4444', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
        >
          Supprimer mon compte
        </button>
    </div>
  );
};

export default ProfileScreen;