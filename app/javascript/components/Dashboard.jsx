import React, { useState, useEffect } from 'react';
import useAuthGuard from '../hooks/useAuthGuard';
import { getAuthHeaders, logout } from '../utils/auth';

const Dashboard = () => {
  useAuthGuard(); // Redirects to /login if no auth token

  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAreaName, setNewAreaName] = useState('');
  const [error, setError] = useState(null); // For handling errors

  // Fetch areas when the component mounts
  useEffect(() => {
    const getAreas = async () => {
      try {
        const areas = await fetchAreas();
        setAreas(areas);
      } catch (error) {
        setError('Failed to load areas.'); // Set error if the fetch fails
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete
      }
    };

    getAreas();
  }, []);
  
  // Utility function for making API calls to fetch areas
  const fetchAreas = async () => {
    const response = await fetch('/api/v1/areas', {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch areas'); // Throw an error if the response is not ok
    }

    const data = await response.json();
    return data;
  };

  // Handle creating a new area
  const handleCreateArea = async () => {
    if (newAreaName.trim()) {
      try {
        const newArea = { name: newAreaName, description: '' };
        const createdArea = await createArea(newArea);
        setAreas([...areas, createdArea]); // Update state with new area
        setNewAreaName(''); // Reset input field
      } catch (error) {
        setError('Failed to create area.'); // Show error if creation fails
      }
    } else {
      setError('Area name cannot be empty.'); // Show error if input is empty
    }
  };

  // Utility function to create a new area
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
      throw new Error('Error creating area'); // Throw error if creation fails
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

  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      <button onClick={logout}>Logout</button>

      {/* Error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

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
