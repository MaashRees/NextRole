import { useState, useEffect } from 'react';
import apiService from '../../services/ApiService';
import useLocalStorage from '../../hooks/useLocalStorage';

const ProfileScreen = () => {
  const [user, setUser] = useLocalStorage('user', null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    age: user?.age || ''
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await apiService.updateProfile({
        ...formData,
        age: Number(formData.age)
      });
      setUser(updatedUser);
      setIsEditing(false);
      alert("Profil mis à jour");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div>
      <h2>Mon Profil (@{user?.username})</h2>
      {!isEditing ? (
        <div>
          <p><strong>Identité :</strong> {user?.firstname} {user?.lastname}</p>
          <p><strong>Email :</strong> {user?.email}</p>
          <p><strong>Âge :</strong> {user?.age} ans</p>
          <button onClick={() => setIsEditing(true)}>Modifier mes infos</button>
        </div>
      ) : (
        <form onSubmit={handleUpdate}>
          <input 
            placeholder="Prénom"
            value={formData.firstname} 
            onChange={(e) => setFormData({...formData, firstname: e.target.value})} 
          />
          <input 
            placeholder="Nom"
            value={formData.lastname} 
            onChange={(e) => setFormData({...formData, lastname: e.target.value})} 
          />
          <input 
            type="number"
            placeholder="Âge"
            value={formData.age} 
            onChange={(e) => setFormData({...formData, age: e.target.value})} 
          />
          <button type="submit">Sauvegarder</button>
          <button type="button" onClick={() => setIsEditing(false)}>Annuler</button>
        </form>
      )}

      <hr />
      <button onClick={handleLogout} style={{ color: 'red' }}>Déconnexion</button>
    </div>
  );
};

export default ProfileScreen;