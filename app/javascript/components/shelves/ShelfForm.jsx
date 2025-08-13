import React, { useState } from 'react';

const ShelfForm = ({ handleCreateShelf, areas }) => {
  const [area, setArea] = useState('');
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTemplate, setNewTemplate] = useState('');
  const [error, setError] = useState(null);

  // Handle form submission
  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Prepare shelfData as an object
    const shelfData = {
      name: newName,
      description: newDescription,
      template: newTemplate,
      parent_id: parseInt(area, 10),
      parent_type: "Area"
    };

    // Pass the data to the parent through the callback function
    handleCreateShelf(shelfData);

    // Clear form fields after submission
    setNewName('');
    setNewDescription('');
    setNewTemplate('');
    setArea('');
  };

  return (
    <div>
      <h2>Form</h2>
      {/* Error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleFormSubmit}>
        <div>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
          >
            <option value="">Select Area</option>
            {areas.map(area => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new shelf name"
            required
          />
        </div>
        <div>
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Enter new shelf description"
          />
        </div>
        <div>
          <input
            type="text"
            value={newTemplate}
            onChange={(e) => setNewTemplate(e.target.value)}
            placeholder="Enter new shelf template"
          />
        </div>
        <div>
          <button type="submit">Create New Shelf</button>
        </div>
      </form>
    </div>
  );
};

export default ShelfForm;
