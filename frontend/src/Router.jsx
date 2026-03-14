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
  const isAuthenticated = !!token;

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
          <Route path="/jobs" element={<JobScreen />} />
          <Route path="/jobs/:id" element={<JobDetailsScreen />} />
          <Route path="/applications" element={<ApplicationScreen />} />
          <Route path="/create" element={<CreateScreen />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;