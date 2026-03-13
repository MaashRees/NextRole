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
      <NavLink title="Home" to="/" className="nav-logo">
        NextRole
      </NavLink>
      <div className="nav-links">
        <NavLink to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          Accueil
        </NavLink>
        <NavLink to="/jobs" className="nav-link">
          Offres
        </NavLink>
        <NavLink to="/applications" className="nav-link">
          Candidatures
        </NavLink>
      </div>

      <div className="right">
        <button onClick={toggleTheme} className="nav-logo">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {token ? (
          <NavLink to="/profile" className="nav-btn">
            <img 
              src={avatarUrl} 
              alt="Profil" 
              className="nav-logo"
            />
          </NavLink>
        ) : (
          <NavLink 
            to="/login" 
            className="nav-btn"
          >
            Connexion
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default NavBar;