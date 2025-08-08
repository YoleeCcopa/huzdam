import React, { useState } from 'react';

const AreaDisplay = ({ data, loading, onUpdateArea }) => {
  const [editingArea, setEditingArea] = useState(null); // Track the area being edited
  const [newValue, setNewValue] = useState('');

  // Handle the button click to start editing the area name/description
  const handleEditClick = (areaId, field) => {
    setEditingArea({ id: areaId, field });
  };

  // Handle submitting the updated value for the area
  const handleSaveClick = async (areaId) => {
    if (newValue.trim()) {
      await onUpdateArea(areaId, editingArea.field, newValue); // Call parent function to update
      setEditingArea(null); // Reset editing state
      setNewValue(''); // Reset input field
    }
  };

  // Render areas and buttons for changing name/description
  return (
    <div>
      {loading ? (
        <p>Loading areas...</p>
      ) : (
        <div>
          <h2>Your Areas</h2>
          <ul>
            {data.map((area) => (
              <li key={area.id}>
                {area.name}
                <br />
                {area.description}
                <br />
                <button onClick={() => handleEditClick(area.id, 'name')}>Change name</button>
                <button onClick={() => handleEditClick(area.id, 'description')}>Change description</button>

                {editingArea && editingArea.id === area.id && (
                  <div>
                    <input
                      type="text"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder={`New ${editingArea.field}`}
                    />
                    <button onClick={() => handleSaveClick(area.id)}>Save</button>
                    <button onClick={() => setEditingArea(null)}>Cancel</button>
                  </div>
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
