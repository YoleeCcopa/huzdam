import React, { useState, useEffect } from 'react';
import useAuthGuard from '../hooks/useAuthGuard';
import { logout } from '../utils/auth';
import { get, post, patch } from '../utils/api';
import ShelfForm from './shelves/ShelfForm';
import ShelfDisplay from './shelves/ShelfDisplay';

const Shelves = () => {
  useAuthGuard(); // Redirects to /login if no auth token

  const [shelves, setShelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // For handling errors

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
  const onUpdateShelf = async (shelfId, field, newValue) => {
    // const updatedArea = { [field]: newValue }; // Update only the field that was changed
    try {
      // Call the patch function from the apiUtils
      const updatedShelf = await patch(`/api/v1/shelves/${shelfId}`, { [field]: newValue });

      // Update only the field that was changed in the state
      setShelves((prevShelves) =>
        prevShelves.map((shelf) =>
          shelf.id === shelfId ? { ...shelf, ...updatedShelf.data } : shelf
        )
      );
    } catch (error) {
      console.error('Error updating shelf:', error);
    }
  };

  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      <button onClick={logout}>Logout</button>

      {/* Error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Create new area form */}
      <ShelfForm handleCreateShelf={handleCreateShelf} />

      {/* Display areas */}
      <ShelfDisplay data={shelves} loading={loading} onUpdateShelf={onUpdateShelf} setShelves={setShelves} />
    </div>
  );
};

export default Shelves;
