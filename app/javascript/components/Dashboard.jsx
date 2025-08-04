import React from 'react';
import useAuthGuard from '../hooks/useAuthGuard';
import { getAuthHeaders, logout } from '../utils/auth';

const Dashboard = () => {
  useAuthGuard(); // Redirects to /login if no auth token

  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;