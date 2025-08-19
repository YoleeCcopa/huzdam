import React from 'react';

const FormSelect = ({
  name,
  value,
  onChange,
  options,
  label = 'Select an option',
  required = false,
  error = '',
  hint = '',
  disabled = false,
  className = '',
  selectClass = '',
  hintClass = 'form-hint',
  errorClass = 'form-error',
}) => {
  return (
    <div className={`form-group ${className}`}>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        className={`${selectClass} ${error ? 'input-error' : ''}`}
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
      {hint && !error && <small className={hintClass}>{hint}</small>}
      {error && <small className={errorClass}>{error}</small>}
    </div>
  );
};

export default FormSelect;
