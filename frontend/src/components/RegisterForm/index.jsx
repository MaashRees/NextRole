import { useState } from 'react';
import apiService from '../../services/ApiService';

const RegisterForm = ({ onToggle }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: ''
  });
  const [error, setError] = useState('');

  const validate = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) return "Format d'email invalide.";
    if (formData.password.length < 8) return "Le mot de passe doit contenir au moins 8 caractères.";
    if (formData.password !== formData.confirmPassword) return "Les mots de passe ne correspondent pas.";
    if (Number(formData.age) < 18) return "Vous devez avoir au moins 18 ans.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) return setError(validationError);

    try {
      const { confirmPassword, ...payload } = formData;
      await apiService.register({
        ...payload,
        age: Number(payload.age)
      });
      alert("Inscription réussie !");
      onToggle();
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input name="firstname" placeholder="Prénom" onChange={handleChange} required />
      <input name="lastname" placeholder="Nom" onChange={handleChange} required />
      <input name="username" placeholder="Nom d'utilisateur" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="age" type="number" placeholder="Âge (min 18)" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Mot de passe (min 8)" onChange={handleChange} required />
      <input name="confirmPassword" type="password" placeholder="Confirmer mot de passe" onChange={handleChange} required />
      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default RegisterForm;