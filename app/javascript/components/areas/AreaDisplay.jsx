import React, { useState } from 'react';
import { get, del } from '../../utils/api';

// Parent Component (AreaDisplay)
const AreaDisplay = ({ data, loading, onUpdateArea, setAreas }) => {
  const [editingArea, setEditingArea] = useState(null); // To track the area being edited
  const [newValues, setNewValues] = useState({ name: '', description: '' }); // Track new values for both fields

  /**
   * Handle the edit button click
   * @param {number} areaId - The ID of the area to edit
   * @param {string} field - The field to edit ('name' or 'description')
   */
  const handleEditClick = (areaId, field) => {
    setEditingArea({ id: areaId, field });
  };

  // Handle value changes in the input fields (name or description)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewValues((prev) => ({ ...prev, [name]: value })); // Update only the field being edited
  };

  /**
   * Handle saving the new value for the area
   * @param {number} areaId - The ID of the area
   */
  const handleSaveClick = async (areaId) => {
    // Ensure we only save non-empty values
    const { name, description } = newValues;

    if (name.trim() || description.trim()) {
      try {
        // Try to update the area with the new values
        await onUpdateArea(areaId, 'name', name);
        await onUpdateArea(areaId, 'description', description);

        // Reset values
        setEditingArea(null);
        setNewValues({ name: '', description: '' });
      } catch (error) {
        console.error('Error saving area:', error);
        alert('Failed to save area');
      }
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
        // Delete the area using the 'del' function from apiUtils
        await del(`/api/v1/areas/${areaId}`);
        
        // Optionally, re-fetch the areas after deletion to get the latest state from the backend
        const areasData = await get('/api/v1/areas');
        setAreas(areasData.data); // Update the state with the fresh data

        alert('Area deleted successfully');
      } catch (error) {
        console.error('Error deleting area:', error);
        alert('Failed to delete area');
      }
    }
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredAreas = data.filter(area =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Render areas and buttons for changing name/description
  return (
    <div>
      {loading ? (
        <p>Loading areas...</p>
      ) : (
        <div>
          <h2>Your Areas</h2>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <ul>
            {filteredAreas.map((area) => (
              <li key={area.id}>
                <strong>Name:</strong> {area.name} <br />
                <strong>Description:</strong> {area.description} <br />
                <button onClick={() => handleEditClick(area.id, 'name')}>Change name</button>
                <button onClick={() => handleEditClick(area.id, 'description')}>Change description</button>
                <button onClick={() => handleDeleteClick(area.id)}>Delete</button>
                
                {editingArea && editingArea.id === area.id && (
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={newValues.name}
                      onChange={handleInputChange}
                      placeholder={`New name`}
                    />
                    <input
                      type="text"
                      name="description"
                      value={newValues.description}
                      onChange={handleInputChange}
                      placeholder={`New description`}
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
