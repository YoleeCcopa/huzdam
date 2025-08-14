import React, { useState, useEffect } from 'react';

const GenericForm = ({
  fields,               // [{ name, label, type, options (optional for select, radio), required }]
  initialValues = {},   // for edit mode
  onSubmit,             // submit handler
  onCancel,             // optional cancel handler
  submitLabel = 'Save'
}) => {
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    // Only update if initialValues is different
    setValues(prev => {
      const hasChanged = Object.keys(initialValues).some(
        key => initialValues[key] !== prev[key]
      );
      return hasChanged ? initialValues : prev;
    });
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setValues(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setValues(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  const renderField = (field) => {
    const val = values[field.name] || '';

    switch (field.type) {
      case 'select':
        return (
          <div key={field.name}>
            <label>{field.label}</label>
            <select
              name={field.name}
              value={val}
              onChange={handleChange}
              required={field.required}
            >
              <option value="">Select {field.label}</option>
              {field.options.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        );

      case 'radio':
        return (
          <div key={field.name}>
            <label>{field.label}</label>
            {field.options.map(option => (
              <label key={option.value}>
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={val === option.value}
                  onChange={handleChange}
                />
                {option.label}
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name}>
            <label>{field.label}</label>
            <input
              type="checkbox"
              name={field.name}
              checked={val}
              onChange={handleChange}
            />
          </div>
        );

      case 'date':
        return (
          <div key={field.name}>
            <label>{field.label}</label>
            <input
              type="date"
              name={field.name}
              value={val}
              onChange={handleChange}
              required={field.required}
            />
          </div>
        );

      case 'number':
        return (
          <div key={field.name}>
            <label>{field.label}</label>
            <input
              type="number"
              name={field.name}
              value={val}
              onChange={handleChange}
              required={field.required}
            />
          </div>
        );

      default:
        return (
          <div key={field.name}>
            <label>{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={val}
              onChange={handleChange}
              placeholder={field.placeholder}
              required={field.required}
            />
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      {fields.map(renderField)}

      <button type="submit">{submitLabel}</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default GenericForm;
