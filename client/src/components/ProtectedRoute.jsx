import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { teacher, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: 14 }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!teacher) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
