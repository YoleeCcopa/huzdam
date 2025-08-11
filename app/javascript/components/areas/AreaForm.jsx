import React, { useState } from 'react';

const AreaForm = ({ handleCreateArea }) => {
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [error, setError] = useState(null);

  // Handle form submission
  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Prepare areaData as an object
    const areaData = {
      name: newName,
      description: newDescription,
    };

    // Pass the data to the parent through the callback function
    handleCreateArea(areaData);

    // Clear form fields after submission
    setNewName('');
    setNewDescription('');
  };

  return (
    <div>
      <h2>Create New Area</h2>
      {/* Error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleFormSubmit}>
        <div>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new area name"
            required
          />
        </div>
        <div>
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Enter new area description"
          />
        </div>
        <div>
          <button type="submit">Create New Area</button>
        </div>
      </form>
    </div>
  );
};

export default AreaForm;
