import React from 'react';

const FormSelect = ({ name, value, onChange, options, label = 'Select Area', required = false }) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    required={required}
    style={{ marginBottom: '0.5rem', padding: '0.5rem', width: '100%' }}
  >
    <option value="">{label}</option>
    {options.map((opt) => (
      <option key={opt.id} value={opt.id}>
        {opt.name}
      </option>
    ))}
  </select>
);

export default FormSelect;
