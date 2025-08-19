import React, { useState } from 'react';
import { get, del } from '../../utils/api';
import ItemForm from './ItemForm';
import SearchBar from '../generics/SearchBar';

const ItemDisplay = ({ data, loading, onUpdate, setItems, shelves }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEditClick = (item) => setEditingItem(item);

  const handleCancelClick = () => setEditingItem(null);

  const handleSaveClick = async (form) => {
    const payload = {};
    for (const key in form) {
      if (
        form[key] !== '' &&
        editingItem[key] !== form[key]
      ) {
        payload[key] = form[key];
      }
    }

    if (Object.keys(payload).length === 0) {
      alert('No changes made');
      return;
    }

    try {
      await onUpdate(editingItem.id, payload);
      setEditingItem(null);
    } catch (error) {
      alert('Failed to save item');
    }
  };

  const handleDeleteClick = async (itemId) => {
    const confirmed = window.confirm('Are you sure you want to delete this item?');
    if (confirmed) {
      try {
        await del(`/api/v1/items/${itemId}`);
        const itemsData = await get('/api/v1/items');
        setItems(itemsData.data);
      } catch (error) {
        alert('Failed to delete item');
      }
    }
  };

  const filteredItems = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {loading ? (
        <p>Loading Items...</p>
      ) : (
        <div>
          <h2>Your Items</h2>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <ul>
            {filteredItems.map((item) => (
              <li key={item.id}>
                <strong>Name:</strong> {item.name}<br />
                <strong>Description:</strong> {item.description}<br />
                <strong>{item.parent_type} ID:</strong> {item.parent_id}<br />
                <button onClick={() => handleEditClick(item)}>Edit</button>
                <button onClick={() => handleDeleteClick(item.id)}>Delete</button>

                {editingItem?.id === item.id && (
                  <ItemForm
                    item={editingItem}
                    onSubmit={handleSaveClick}
                    onCancel={handleCancelClick}
                    shelves={shelves}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ItemDisplay;
