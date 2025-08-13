import React, { useState } from 'react';
import { get, del } from '../../utils/api';
import ShelfEditForm from './ShelfEditForm';

const ShelfDisplay = ({ data, loading, onUpdateShelf, setShelves, areas }) => {
  const [editingShelf, setEditingShelf] = useState(null);
  const [newValues, setNewValues] = useState(clearFormValues());

  function clearFormValues() {
    return {
      name: '',
      description: '',
      template: '',
      parent_id: '',
      parent_type: 'Area'
    };
  }

  const handleEditClick = (shelf) => {
    setEditingShelf(shelf);
    setNewValues({
      name: shelf.name || '',
      description: shelf.description || '',
      template: shelf.template || '',
      parent_id: shelf.parent_id || '',
      parent_type: shelf.parent_type || 'Area'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async () => {
    if (!editingShelf) return;

    const payload = {};

    for (const key in newValues) {
      if (
        newValues[key] !== undefined &&
        newValues[key] !== '' &&
        newValues[key] !== editingShelf[key]
      ) {
        payload[key] = newValues[key];
      }
    }

    if (Object.keys(payload).length === 0) {
      alert('No changes made');
      return;
    }

    try {
      await onUpdateShelf(editingShelf.id, payload);

      setEditingShelf(null);
      setNewValues(clearFormValues());
    } catch (error) {
      console.error('Error saving shelf:', error);
      alert('Failed to save shelf');
    }
  };

  const handleCancelClick = () => {
    setEditingShelf(null);
    setNewValues(clearFormValues());
  };

  const handleDeleteClick = async (shelfId) => {
    const confirmed = window.confirm('Are you sure you want to delete this shelf?');
    if (confirmed) {
      try {
        await del(`/api/v1/shelves/${shelfId}`);
        const shelvesData = await get('/api/v1/shelves');
        setShelves(shelvesData.data);
        alert('Shelf deleted successfully');
      } catch (error) {
        console.error('Error deleting shelf:', error);
        alert('Failed to delete shelf');
      }
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredShelves = data.filter(shelf =>
    shelf.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SearchBar = ({ searchTerm, setSearchTerm }) => (
    <input
      type="text"
      placeholder="Search areas by name..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
    />
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
                  <ShelfEditForm
                    newValues={newValues}
                    onChange={handleInputChange}
                    onSave={handleSaveClick}
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
