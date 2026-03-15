import { useState } from 'react';
import LoginForm from '../../components/LoginForm/index';
import RegisterForm from '../../components/RegisterForm/index';
import Layout from '../../components/Layout';


const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Layout>
    <div>
      <h1>{isLogin ? 'Connexion' : 'Inscription'}</h1>
      
      {isLogin ? (
        <LoginForm />
      ) : (
        <RegisterForm onToggle={() => setIsLogin(true)} />
      )}

      <p>
        {isLogin ? "Nouveau ici ?" : "Déjà un compte ?"}
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Créer un compte" : "Se connecter"}
        </button>
      </p>
    </div>
    </Layout>
  );
};

export default AuthScreen;