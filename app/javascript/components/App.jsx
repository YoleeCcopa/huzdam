import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './AuthPage';
import Dashboard from './Dashboard';
import Shelves from './Shelves';
import useAuthGuard from '../hooks/useAuthGuard';
import useTrackLastLocation from '../hooks/useTrackLastLocation';

const ProtectedRoute = ({ children }) => {
  useAuthGuard();
  return children;
};

const TrackLastLocationWrapper = () => {
  useTrackLastLocation();
  return null;
};

const App = () => {
  return (
    <Router>
      <TrackLastLocationWrapper />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shelves"
          element={
            <ProtectedRoute>
              <Shelves />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
