import React from 'react';

const FormInput = ({ type = 'text', name, value, onChange, placeholder, required = false }) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    style={{ marginBottom: '0.5rem', padding: '0.5rem', width: '100%' }}
  />
);

export default FormInput;
