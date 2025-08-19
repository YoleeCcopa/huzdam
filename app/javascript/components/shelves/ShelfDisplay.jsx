import React, { useState } from 'react';
import { get, del } from '../../utils/api';
import ShelfForm from './ShelfForm';
import SearchBar from '../generics/SearchBar';

const ShelfDisplay = ({ data, loading, onUpdateShelf, setShelves, areas }) => {
  const [editingShelf, setEditingShelf] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEditClick = (shelf) => setEditingShelf(shelf);

  const handleCancelClick = () => setEditingShelf(null);

  const handleSaveClick = async (form) => {
    const payload = {};
    for (const key in form) {
      if (
        form[key] !== '' &&
        editingShelf[key] !== form[key]
      ) {
        payload[key] = form[key];
      }
    }

    if (Object.keys(payload).length === 0) {
      alert('No changes made');
      return;
    }

    try {
      await onUpdateShelf(editingShelf.id, payload);
      setEditingShelf(null);
    } catch (error) {
      alert('Failed to save shelf');
    }
  };

  const handleDeleteClick = async (shelfId) => {
    const confirmed = window.confirm('Are you sure you want to delete this shelf?');
    if (confirmed) {
      try {
        await del(`/api/v1/shelves/${shelfId}`);
        const shelvesData = await get('/api/v1/shelves');
        setShelves(shelvesData.data);
      } catch (error) {
        alert('Failed to delete shelf');
      }
    }
  };

  const filteredShelves = data.filter(shelf =>
    shelf.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {loading ? (
        <p>Loading Shelves...</p>
      ) : (
        <div>
          <h2>Your Shelves</h2>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <ul>
            {filteredShelves.map((shelf) => (
              <li key={shelf.id}>
                <strong>Name:</strong> {shelf.name}<br />
                <strong>Description:</strong> {shelf.description}<br />
                <strong>Template:</strong> {shelf.template}<br />
                <strong>Area ID:</strong> {shelf.parent_id}<br />
                <button onClick={() => handleEditClick(shelf)}>Edit</button>
                <button onClick={() => handleDeleteClick(shelf.id)}>Delete</button>

                {editingShelf?.id === shelf.id && (
                  <ShelfForm
                    shelf={editingShelf}
                    onSubmit={handleSaveClick}
                    onCancel={handleCancelClick}
                    areas={areas}
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

export default ShelfDisplay;
