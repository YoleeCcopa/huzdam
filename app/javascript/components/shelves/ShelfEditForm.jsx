import React from 'react';

const ShelfEditForm = ({
  newValues,
  onChange,
  onSave,
  onCancel,
  areas
}) => {
  return (
    <div style={{ marginTop: '10px', marginBottom: '20px' }}>
      <input
        type="text"
        name="name"
        value={newValues.name}
        onChange={onChange}
        placeholder="New name"
      />
      <input
        type="text"
        name="description"
        value={newValues.description}
        onChange={onChange}
        placeholder="New description"
      />
      <input
        type="text"
        name="template"
        value={newValues.template}
        onChange={onChange}
        placeholder="New template"
      />
      <select
        name="parent_id"
        value={newValues.parent_id}
        onChange={onChange}
      >
        <option value="">Select Area</option>
        {areas.map((area) => (
          <option key={area.id} value={area.id}>
            {area.name}
          </option>
        ))}
      </select>
      <button onClick={onSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default ShelfEditForm;