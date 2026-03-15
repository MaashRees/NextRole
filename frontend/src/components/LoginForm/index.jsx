import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/ApiService';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await apiService.login({ email, password });
      login(data.token, data.user); 
      navigate('/profile');
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      <input 
        type="password" 
        placeholder="Mot de passe" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
      <button type="submit">Se connecter</button>
    </form>
  );
};

export default LoginForm;