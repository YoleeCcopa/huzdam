import React from 'react';

const FormInput = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error = '',
  hint = '',
  disabled = false,
  readOnly = false,
  className = '',
  inputClass = '',
  hintClass = 'form-hint',
  errorClass = 'form-error',
}) => {
  const inputProps = {
    name,
    value,
    onChange,
    placeholder,
    required,
    disabled,
    readOnly,
    'aria-invalid': !!error,
    className: `${inputClass} ${error ? 'input-error' : ''}`,
  };

  return (
    <div className={`form-group ${className}`}>
      {type === 'textarea' ? (
        <textarea {...inputProps} />
      ) : (
        <input type={type} {...inputProps} />
      )}
      {hint && !error && <small className={hintClass}>{hint}</small>}
      {error && <small className={errorClass}>{error}</small>}
    </div>
  );
};

export default FormInput;
