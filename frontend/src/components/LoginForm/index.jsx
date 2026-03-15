import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/ApiService';
import useLocalStorage from '../../hooks/useLocalStorage';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useLocalStorage('token', null);
  const [user, setUser] = useLocalStorage('user', null);
  
  const navigate = useNavigate();
  const isAuthenticated = !!token && !!user;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await apiService.login({ email, password });
      setToken(data.token);
      setUser(data.user); 
      
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