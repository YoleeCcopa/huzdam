import React from 'react';

const FormCheck = ({
  type = 'checkbox',
  name,
  value,
  onChange,
  options = [],
  checked,
  label,
  required = false,
  error = '',
  hint = '',
  disabled = false,
  readOnly = false, // not really usable for checkboxes/radios, but accepted
  className = '',
  inputClass = '',
  hintClass = 'form-hint',
  errorClass = 'form-error',
}) => {
  const isSingle = !options.length;

  if (isSingle) {
    return (
      <div className={`form-group ${className}`}>
        <label className="form-label">
          <input
            type={type}
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={!!error}
            className={inputClass}
          />
          {label}
        </label>
        {hint && !error && <small className={hintClass}>{hint}</small>}
        {error && <small className={errorClass}>{error}</small>}
      </div>
    );
  }

  return (
    <div className={`form-group ${className}`} role={type === 'radio' ? 'radiogroup' : 'group'} aria-invalid={!!error}>
      {options.map((opt) => {
        const isChecked = type === 'checkbox'
          ? value.includes(opt.id)
          : value === opt.id;

        return (
          <label key={opt.id} className="form-label">
            <input
              type={type}
              name={name}
              value={opt.id}
              checked={isChecked}
              onChange={onChange}
              required={required}
              disabled={disabled}
              readOnly={readOnly}
              className={inputClass}
            />
            {opt.label}
          </label>
        );
      })}
      {hint && !error && <small className={hintClass}>{hint}</small>}
      {error && <small className={errorClass}>{error}</small>}
    </div>
  );
};

export default FormCheck;
