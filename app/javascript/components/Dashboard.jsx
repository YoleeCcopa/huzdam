import React, { useEffect } from 'react';
import { getAuthHeaders, logout } from '../utils/auth';

const Dashboard = () => {

  useEffect(() => {
  const headers = getAuthHeaders();
  if (!headers) {
      window.location.href = '/login';
    }
  }, []);

  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;