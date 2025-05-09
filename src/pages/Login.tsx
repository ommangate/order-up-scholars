
import React from 'react';
import LoginForm from '@/components/Auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  // If already authenticated, redirect to appropriate page
  if (isAuthenticated) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/menu" replace />;
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-144px)]">
      <div className="w-full max-w-md px-4">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
