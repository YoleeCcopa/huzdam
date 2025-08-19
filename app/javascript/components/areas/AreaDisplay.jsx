import React, { useState } from 'react';
import { get, del } from '../../utils/api';
import AreaForm from './AreaForm';
import SearchBar from '../generics/SearchBar';

const AreaDisplay = ({ data, loading, onUpdateArea, setAreas }) => {
  const [editingArea, setEditingArea] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEditClick = (area) => setEditingArea(area);

  const handleCancelClick = () => setEditingArea(null);
  
  const handleSaveClick = async (form) => {
    const payload = {};
    for (const key in form) {
      if (
        form[key] !== '' &&
        editingArea[key] !== form[key]
      ) {
        payload[key] = form[key];
      }
    }

    if (Object.keys(payload).length === 0) {
      alert('No changes made');
      return;
    }

    try {
      await onUpdateArea(editingArea.id, payload);
      setEditingArea(null);
    } catch (error) {
      alert('Failed to save area');
    }
  };

  /**
   * Handle the delete button click to delete an area
   * @param {number} areaId - The ID of the area to delete
   */
  const handleDeleteClick = async (areaId) => {
    const confirmed = window.confirm('Are you sure you want to delete this area?');
    if (confirmed) {
      try {
        await del(`/api/v1/areas/${areaId}`);
        const areasData = await get('/api/v1/areas');
        setAreas(areasData.data);
      } catch (error) {
        alert('Failed to delete area');
      }
    }
  };

  const filteredAreas = data.filter(area =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      {loading ? (
        <p>Loading Areas...</p>
      ) : (
        <div>
          <h2>Your Areas</h2>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <ul>
            {filteredAreas.map((area) => (
              <li key={area.id}>
                <strong>Name:</strong> {area.name}<br />
                <strong>Description:</strong> {area.description}<br />
                <button onClick={() => handleEditClick(area)}>Edit</button>
                <button onClick={() => handleDeleteClick(area.id)}>Delete</button>

                {editingArea?.id === area.id && (
                  <AreaForm
                    area={editingArea}
                    onSubmit={handleSaveClick}
                    onCancel={handleCancelClick}
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

export default AreaDisplay;
