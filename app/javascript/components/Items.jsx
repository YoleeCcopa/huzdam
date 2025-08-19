import React, { useState, useEffect } from 'react';
import useAuthGuard from '../hooks/useAuthGuard';
import { AuthService } from '../services/authService';
import { get, post, patch } from '../utils/api';
import ItemForm from './items/ItemForm';
import ItemDisplay from './items/ItemDisplay';

const Items = () => {
  useAuthGuard(); // Redirects to /login if no auth token

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingShelves, setLoadingShelves] = useState(true);
  const [error, setError] = useState(null); // For handling errors
  const [shelves, setShelves] = useState([]);

  // Fetch areas when the component mounts
  useEffect(() => {
    const getItems = async () => {
      setLoading(true);
      try {
        const itemsData = await get('/api/v1/items');
        setItems(itemsData.data);
      } catch (error) {
        setError('Failed to load items.');
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

    getItems();
    getShelves();
  }, []);

  // Handle creating a new area
  const handleCreateItem = async (itemData) => {
    try {
      const createdItem = await post('/api/v1/items', { item: itemData });
      setItems([...items, createdItem.data]);
    } catch (error) {
      setError('Failed to create items.');
    }
  };

  // API call to update the area (name or description)
  const onUpdateItem = async (itemId, updatedFields) => {
    try {
      const updatedItem = await patch(`/api/v1/items/${itemId}`, { item: updatedFields });

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, ...updatedItem.data } : item
        )
      );
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item');
    }
  };

  return (
    <div>
      <h1>Welcome to your items</h1>
      <button onClick={() => AuthService.logout()}>Logout</button>

      {/* Error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Create new area form */}
      <ItemForm onSubmit={handleCreateItem} shelves={shelves} />

      {/* Display areas */}
      <ItemDisplay data={items} loading={loading} onUpdate={onUpdateItem} setItems={setItems} shelves={shelves} />
    </div>
  );
};

export default Items;
