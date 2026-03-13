import { Outlet } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

import NavBar from '../Navbar/index';

const Layout = ({ children }) => {
  const { theme } = useTheme();
  
  const layoutStyle = {
    backgroundColor: theme === 'light' ? '#ffffff' : '#242424',
    color: theme === 'light' ? '#213547' : 'rgba(255, 255, 255, 0.87)',
    width: '100%',
    minHeight: '100vh',
    transition: 'all 0.2s ease',
    display:  'block',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'left',
  };

  return (
    <div style={layoutStyle}>
      <header><NavBar /></header>
      <main><Outlet/></main>
    </div>
  );
};

export default Layout;