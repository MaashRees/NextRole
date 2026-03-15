import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage('token', null);
  const [user, setUser] = useLocalStorage('user', null);
  const isAuthenticated = !!token && !!user;
  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };
  const logout = () => {
    setToken(null);
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);