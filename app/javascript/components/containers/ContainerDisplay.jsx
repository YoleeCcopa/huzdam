import React, { useState } from 'react';
import { get, del } from '../../utils/api';
import ContainerForm from './ContainerForm';
import SearchBar from '../generics/SearchBar';

const ContainerDisplay = ({ data, loading, onUpdate, setContainers, shelves }) => {
  const [editingContainer, setEditingContainer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEditClick = (container) => setEditingContainer(container);

  const handleCancelClick = () => setEditingContainer(null);

  const handleSaveClick = async (form) => {
    const payload = {};
    for (const key in form) {
      if (
        form[key] !== '' &&
        editingContainer[key] !== form[key]
      ) {
        payload[key] = form[key];
      }
    }

    if (Object.keys(payload).length === 0) {
      alert('No changes made');
      return;
    }

    try {
      await onUpdate(editingContainer.id, payload);
      setEditingContainer(null);
    } catch (error) {
      alert('Failed to save container');
    }
  };

  const handleDeleteClick = async (containerId) => {
    const confirmed = window.confirm('Are you sure you want to delete this container?');
    if (confirmed) {
      try {
        await del(`/api/v1/containers/${containerId}`);
        const containersData = await get('/api/v1/containers');
        setContainers(containersData.data);
      } catch (error) {
        alert('Failed to delete container');
      }
    }
  };

  const filteredContainers = data.filter(container =>
    container.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {loading ? (
        <p>Loading Containers...</p>
      ) : (
        <div>
          <h2>Your COntainers</h2>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <ul>
            {filteredContainers.map((container) => (
              <li key={container.id}>
                <strong>Name:</strong> {container.name}<br />
                <strong>Description:</strong> {container.description}<br />
                <strong>Template:</strong> {container.template}<br />
                <strong>{container.parent_type} ID:</strong> {container.parent_id}<br />
                <button onClick={() => handleEditClick(container)}>Edit</button>
                <button onClick={() => handleDeleteClick(container.id)}>Delete</button>

                {editingContainer?.id === container.id && (
                  <ContainerForm
                    container={editingContainer}
                    onSubmit={handleSaveClick}
                    onCancel={handleCancelClick}
                    shelves={shelves}
                    containers={data}
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

export default ContainerDisplay;
