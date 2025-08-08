import React, { useState, useEffect } from 'react';
import useAuthGuard from '../hooks/useAuthGuard';
import { getAuthHeaders, logout } from '../utils/auth';

const Dashboard = () => {
  useAuthGuard(); // Redirects to /login if no auth token

  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAreaName, setNewAreaName] = useState('');

  // Fetch areas when the component mounts
  useEffect(() => {
    const getAreas = async () => {
      const areas = await fetchAreas();
      setAreas(areas);
      setLoading(false);
    };

    getAreas();
  }, []);
  
  // Utility function for making API calls
  const fetchAreas = async () => {
    const response = await fetch('/api/v1/areas', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    return data;
  };

  const createArea = async (newArea) => {
    const response = await fetch('/api/v1/areas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ area: newArea }),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error('Error creating area:', data.errors);
    }
  };

  const updateObject = async (objectType, objectId, data) => {
    try {
      const response = await axios.patch(`/api/${objectType}s/${objectId}`, data);
      console.log('Object updated:', response.data);
    } catch (error) {
      console.error('Error updating object:', error.response.data);
    }
  };

  // Handle creating a new area
  const handleCreateArea = async () => {
    if (newAreaName.trim()) {
      const newArea = { name: newAreaName, description: '' };
      const createdArea = await createArea(newArea);
      setAreas([...areas, createdArea]);
      setNewAreaName('');
    }
  };

  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      <button onClick={logout}>Logout</button>

      {/* Create new area */}
      <div>
        <input
          type="text"
          value={newAreaName}
          onChange={(e) => setNewAreaName(e.target.value)}
          placeholder="Enter new area name"
        />
        <button onClick={handleCreateArea}>Create New Area</button>
      </div>

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
