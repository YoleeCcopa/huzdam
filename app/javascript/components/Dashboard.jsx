import React, { useState, useEffect } from 'react';
import useAuthGuard from '../hooks/useAuthGuard';
import { logout } from '../utils/auth';
import { get, post } from '../utils/api';
import AreaForm from './areas/AreaForm';

const Dashboard = () => {
  useAuthGuard(); // Redirects to /login if no auth token

  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // For handling errors

  // Fetch areas when the component mounts
  useEffect(() => {
    const getAreas = async () => {
      try {
        const areasData = await get('/api/v1/areas');
        setAreas(areasData);
      } catch (error) {
        setError('Failed to load areas.');
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete
      }
    };

    getAreas();
  }, []);

  // Handle creating a new area
  const handleCreateArea = async (areaData) => {
    try {
      const createdArea = await post('/api/v1/areas', { area: areaData });
      setAreas([...areas, createdArea]);
    } catch (error) {
      setError('Failed to create area.');
    }
  };

  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      <button onClick={logout}>Logout</button>

      {/* Error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Create new area form */}
      <AreaForm handleCreateArea={handleCreateArea} />

      {/* Display areas */}
      {loading ? (
        <p>Loading areas...</p>
      ) : (
        <div>
          <h2>Your Areas</h2>
          <ul>
            {areas.map((area) => (
              <li key={area.id}>{area.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
