import React, { useState, useEffect } from 'react';
import FormInput from '../generics/FormInput';

const AreaForm = ({ onSubmit, area = null, onCancel }) => {
  const [form, setForm] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (area) {
      setForm({
        name: area.name || '',
        description: area.description || ''
      });
    }
  }, [area]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    if (!area) {
      setForm({ name: '', description: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput name="name" value={form.name} onChange={handleChange} placeholder="Area name" required />
      <FormInput name="description" value={form.description} onChange={handleChange} placeholder="Description" />
      <button type="submit">{area ? 'Save' : 'Create New Area'}</button>
      {area && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default AreaForm;
