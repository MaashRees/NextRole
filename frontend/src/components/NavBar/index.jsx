import { NavLink } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import useLocalStorage from '../../hooks/useLocalStorage';

function NavBar() {
  const { theme, toggleTheme } = useTheme();
  const [token] = useLocalStorage('token', null);
  const [user] = useLocalStorage('user', null);

  const avatarUrl = `https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${user?.username || 'guest'}`;

  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-logo">NextRole</NavLink>
      
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Accueil</NavLink>
        <NavLink to="/jobs" className="nav-link">Offres</NavLink>
        <NavLink to="/applications" className="nav-link">Candidatures</NavLink>
        <NavLink to="/create" className="nav-link">Créer</NavLink>
      </div>

      <div className="right">
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {token ? (
          <div className="user-menu">
            <NavLink to="/profile">
              <img src={avatarUrl} alt="Profil" className="nav-avatar" style={{ width: '35px', borderRadius: '50%' }} />
            </NavLink>
            <button onClick={handleLogout} className="logout-btn">Quitter</button>
          </div>
        ) : (
          <NavLink to="/login" className="login-btn">Connexion</NavLink>
        )}
      </div>
    </nav>
  );
}

export default NavBar;