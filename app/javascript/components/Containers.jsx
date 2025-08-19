import React, { useState, useEffect } from 'react';
import useAuthGuard from '../hooks/useAuthGuard';
import { AuthService } from '../services/authService';
import { get, post, patch } from '../utils/api';
import ContainerForm from './containers/ContainerForm';
import ContainerDisplay from './containers/ContainerDisplay';

const Containers = () => {
  useAuthGuard(); // Redirects to /login if no auth token

  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingShelves, setLoadingShelves] = useState(true);
  const [error, setError] = useState(null); // For handling errors
  const [shelves, setShelves] = useState([]);

  // Fetch areas when the component mounts
  useEffect(() => {
    const getContainers = async () => {
      setLoading(true);
      try {
        const containersData = await get('/api/v1/containers');
        setContainers(containersData.data);
      } catch (error) {
        setError('Failed to load containers.');
      } finally {
        setLoading(false);
      }
    };

    const getShelves = async () => {
      setLoadingShelves(true);
      try {
        const shelvesData = await get('/api/v1/shelves');
        setShelves(shelvesData.data);
      } catch (error) {
        setError('Failed to load shelves.');
      } finally {
        setLoadingShelves(false);
      }
    };

    getContainers();
    getShelves();
  }, []);

  // Handle creating a new area
  const handleCreateContainer = async (containerData) => {
    try {
      const createdContainer = await post('/api/v1/containers', { container: containerData });
      setContainers([...containers, createdContainer.data]);
    } catch (error) {
      setError('Failed to create container.');
    }
  };

  // API call to update the area (name or description)
  const onUpdateContainer = async (containerId, updatedFields) => {
    try {
      const updatedContainer = await patch(`/api/v1/containers/${containerId}`, { container: updatedFields });

      setContainers((prevContainers) =>
        prevContainers.map((container) =>
          container.id === containerId ? { ...container, ...updatedContainer.data } : container
        )
      );
    } catch (error) {
      console.error('Error updating container:', error);
      alert('Failed to update container');
    }
  };

  return (
    <div>
      <h1>Welcome to your Containers</h1>
      <button onClick={() => AuthService.logout()}>Logout</button>

      {/* Error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Create new area form */}
      <ContainerForm onSubmit={handleCreateContainer} shelves={shelves} />

      {/* Display areas */}
      <ContainerDisplay data={containers} loading={loading} onUpdate={onUpdateContainer} setContainers={setContainers} shelves={shelves} />
    </div>
  );
};

export default Containers;
