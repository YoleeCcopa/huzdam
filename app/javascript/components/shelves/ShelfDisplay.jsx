import React, { useState } from 'react';
import { get, del } from '../../utils/api';

// Parent Component (AreaDisplay)
const ShelfDisplay = ({ data, loading, onUpdateShelf, setShelves }) => {
  const [editingShelf, setEditingShelf] = useState(null); // To track the area being edited
  const [newValues, setNewValues] = useState({ name: '', description: '', template: '' }); // Track new values for both fields

  /**
   * Handle the edit button click
   * @param {number} shelfId - The ID of the area to edit
   * @param {string} field - The field to edit ('name' or 'description')
   */
  const handleEditClick = (shelfId, field) => {
    setEditingShelf({ id: shelfId, field });
  };

  // Handle value changes in the input fields (name or description)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewValues((prev) => ({ ...prev, [name]: value })); // Update only the field being edited
  };

  /**
   * Handle saving the new value for the area
   * @param {number} shelfId - The ID of the area
   */
  const handleSaveClick = async (shelfId) => {
    // Ensure we only save non-empty values
    const { name, description, template } = newValues;

    if (name.trim() || description.trim() || template.trim()) {
      try {
        // Try to update the area with the new values
        await onUpdateShelf(shelfId, 'name', name);
        await onUpdateShelf(shelfId, 'description', description);
        await onUpdateShelf(shelfId, 'template', template);

        // Reset values
        setEditingShelf(null);
        setNewValues({ name: '', description: '', template: '' });
      } catch (error) {
        console.error('Error saving shelf:', error);
        alert('Failed to save shelf');
      }
    }
  };

  /**
   * Handle the delete button click to delete an area
   * @param {number} shelfId - The ID of the area to delete
   */
  const handleDeleteClick = async (shelfId) => {
    const confirmed = window.confirm('Are you sure you want to delete this shelf?');

    if (confirmed) {
      try {
        // Delete the area using the 'del' function from apiUtils
        await del(`/api/v1/shelves/${shelfId}`);
        
        // Optionally, re-fetch the Shelves after deletion to get the latest state from the backend
        const shelvesData = await get('/api/v1/shelves');
        setShelves(shelvesData.data); // Update the state with the fresh data

        alert('Shelf deleted successfully');
      } catch (error) {
        console.error('Error deleting shelf:', error);
        alert('Failed to delete shelf');
      }
    }
  };

  // Render Shelves and buttons for changing name/description
  return (
    <div>
      {loading ? (
        <p>Loading Shelves...</p>
      ) : (
        <div>
          <h2>Your Shelves</h2>
          <ul>
            {data.map((shelf) => (
              <li key={shelf.id}>
                <strong>Name:</strong> {shelf.name} <br />
                <strong>Description:</strong> {shelf.description} <br />
                <strong>Template:</strong> {shelf.template} <br />
                <button onClick={() => handleEditClick(shelf.id, 'area')}>Change area</button>
                <button onClick={() => handleEditClick(shelf.id, 'name')}>Change name</button>
                <button onClick={() => handleEditClick(shelf.id, 'description')}>Change description</button>
                <button onClick={() => handleEditClick(shelf.id, 'template')}>Change template</button>
                <button onClick={() => handleDeleteClick(shelf.id)}>Delete</button>
                
                {editingShelf && editingShelf.id === shelf.id && (
                  <div>
                    <input
                      type="text"
                      name="area"
                      value={area.area}
                      onChange={handleInputChange}
                      placeholder={`Area`}
                    />
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
                    <input
                      type="text"
                      name="template"
                      value={newValues.template}
                      onChange={handleInputChange}
                      placeholder={`New template`}
                    />
                    <button onClick={() => handleSaveClick(shelf.id)}>Save</button>
                    <button onClick={() => setEditingShelf(null)}>Cancel</button>
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

export default ShelfDisplay;
