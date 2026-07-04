import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isInitialLoading } = useAuth();

  if (isInitialLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export const PublicRoute: React.FC = () => {
  const { isAuthenticated, isInitialLoading } = useAuth();

  if (isInitialLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};
