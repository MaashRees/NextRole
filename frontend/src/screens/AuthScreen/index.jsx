import { useState } from 'react';
import LoginForm from '../../components/LoginForm/index';
import RegisterForm from '../../components/RegisterForm/index';
import Layout from '../../components/Layout';


const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Layout>
    <div className="auth-container">
        <h1 className="text-center">{isLogin ? 'Connexion' : 'Inscription'}</h1>
      
          <div className="auth-tabs">
          <button 
            className={isLogin ? 'active' : ''}
            onClick={() => setIsLogin(true)}
          >
            Connexion
          </button>
          <button 
            className={!isLogin ? 'active' : ''}
            onClick={() => setIsLogin(false)}
          >
            Inscription
          </button>
        </div>

      <div className="auth-form">
          {isLogin ? <LoginForm /> : <RegisterForm onToggle={() => setIsLogin(true)} />}
        </div>
      </div>
    </Layout>
  );
};

export default AuthScreen;