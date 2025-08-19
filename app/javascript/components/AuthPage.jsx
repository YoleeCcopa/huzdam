import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from './auth/SignupForm';
import LoginForm from './auth/LoginForm';

const AuthPage = () => {
  const [prefill, setPrefill] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    const lastVisitedPath = sessionStorage.getItem('lastVisitedPath');
    const targetPath = lastVisitedPath && lastVisitedPath !== '/auth' 
    ? lastVisitedPath 
    : '/dashboard';

    navigate(targetPath);
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
      <div style={{ flex: 1 }}>
        <LoginForm prefill={prefill} onLoginSuccess={handleLoginSuccess}/>
      </div>
      <div style={{ flex: 1 }}>
        <SignupForm
          onSignupSuccess={({ email, password }) => setPrefill({ email, password })}
        />
      </div>
    </div>
  );
};

export default AuthPage;
