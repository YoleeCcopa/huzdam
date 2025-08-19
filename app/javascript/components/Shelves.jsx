import React, { useState, useEffect } from 'react';
import useAuthGuard from '../hooks/useAuthGuard';
import { AuthService } from '../services/authService';
import { get, post, patch } from '../utils/api';
import ShelfForm from './shelves/ShelfForm';
import ShelfDisplay from './shelves/ShelfDisplay';

const Shelves = () => {
  useAuthGuard(); // Redirects to /login if no auth token

  const [shelves, setShelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // For handling errors
  const [areas, setAreas] = useState([]);

  // Fetch areas when the component mounts
  useEffect(() => {
    const getShelves = async () => {
      try {
        const shelvesData = await get('/api/v1/shelves');
        setShelves(shelvesData.data);
      } catch (error) {
        setError('Failed to load shelves.');
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete
      }
    };

    getShelves();

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
  const handleCreateShelf = async (shelfData) => {
    try {
      const createdShelf = await post('/api/v1/shelves', { shelf: shelfData });
      setShelves([...shelves, createdShelf.data]);
    } catch (error) {
      setError('Failed to create shelf.');
    }
  };

  // API call to update the area (name or description)
  const onUpdateShelf = async (shelfId, updatedFields) => {
    try {
      const updatedShelf = await patch(`/api/v1/shelves/${shelfId}`, { shelf: updatedFields });

      setShelves((prevShelves) =>
        prevShelves.map((shelf) =>
          shelf.id === shelfId ? { ...shelf, ...updatedShelf.data } : shelf
        )
      );
    } catch (error) {
      console.error('Error updating shelf:', error);
      alert('Failed to update shelf');
    }
  };

  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      <button onClick={AuthService.logout()}>Logout</button>

      {/* Error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Create new area form */}
      <ShelfForm onSubmit={handleCreateShelf} areas={areas} />

      {/* Display areas */}
      <ShelfDisplay data={shelves} loading={loading} onUpdateShelf={onUpdateShelf} setShelves={setShelves} areas={areas} />
    </div>
  );
};

export default Shelves;
