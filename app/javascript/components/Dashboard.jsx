import React, { useState, useEffect } from 'react';
import useAuthGuard from '../hooks/useAuthGuard';
import { logout } from '../utils/auth';
import { get, post, patch } from '../utils/api';
import AreaForm from './areas/AreaForm';
import AreaDisplay from './areas/AreaDisplay';

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
        setAreas(areasData.data);
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
      setAreas([...areas, createdArea.data]);
    } catch (error) {
      setError('Failed to create area.');
    }
  };

  // API call to update the area (name or description)
  const onUpdateArea = async (areaId, field, newValue) => {
    // const updatedArea = { [field]: newValue }; // Update only the field that was changed
    try {
      // Call the patch function from the apiUtils
      const updatedArea = await patch(`/api/v1/areas/${areaId}`, { [field]: newValue });

      // Update only the field that was changed in the state
      setAreas((prevAreas) =>
        prevAreas.map((area) =>
          area.id === areaId ? { ...area, ...updatedArea.data } : area
        )
      );
    } catch (error) {
      console.error('Error updating area:', error);
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
      <AreaDisplay data={areas} loading={loading} onUpdateArea={onUpdateArea} setAreas={setAreas} />
    </div>
  );
};

export default Dashboard;
