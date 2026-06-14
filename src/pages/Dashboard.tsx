import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BusinessDashboard from '../components/dashboard/BusinessDashboard';
import TeamDashboard from '../components/dashboard/TeamDashboard';

export default function Dashboard() {
  const { user, profile, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/login" state={{ from: '/dashboard' }} replace />;

  if (profile?.account_type === 'business') return <BusinessDashboard />;
  if (profile?.account_type === 'team') return <TeamDashboard />;
  if (profile?.account_type === 'admin') return <Navigate to="/admin" replace />;

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center">
      <p className="text-white">Setting up your account...</p>
    </div>
  );
}
