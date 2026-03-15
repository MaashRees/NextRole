import { Outlet } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

import NavBar from '../Navbar/index';

const Layout = ({ children }) => {
  const { theme } = useTheme();
  return (
    <div className='Layout'>
      <header><NavBar /></header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;