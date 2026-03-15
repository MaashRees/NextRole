import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/index';
import HomeScreen from './screens/HomeScreen/index';
import AuthScreen from './screens/AuthScreen/index';
import ProfileScreen from './screens/ProfileScreen/index';
import JobScreen from './screens/JobScreen';
import JobDetailsScreen from './screens/JobDetailsScreen';
import ApplicationScreen from './screens/ApplicationScreen';
import CreateScreen from './screens/CreateScreen';
import useLocalStorage from './hooks/useLocalStorage';

function Router() {
  const [token] = useLocalStorage('token', null);
  const [user] = useLocalStorage('user', null);
  const isAuthenticated = !!token && !!user;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/login" element={<AuthScreen />} />
          
          {/* Routes protégées */}
          <Route 
            path="/profile" 
            element={isAuthenticated ? <ProfileScreen /> : <Navigate to="/login" />} 
          />
          <Route path="/jobs" element={isAuthenticated ? <JobScreen /> : <Navigate to="/login" />} />
          <Route path="/jobs/:id" element={isAuthenticated ? <JobDetailsScreen /> : <Navigate to="/login" />} />
          <Route path="/applications" element={isAuthenticated ? <ApplicationScreen /> : <Navigate to="/login" />} />
          <Route path="/create" element={isAuthenticated ? <CreateScreen /> : <Navigate to="/login" />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;