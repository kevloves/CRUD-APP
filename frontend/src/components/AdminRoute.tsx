import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { state } = useAuth();
  
  if (!state.user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  if (!state.user.isAdmin) {
    // Redirect to home if not admin
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default AdminRoute;