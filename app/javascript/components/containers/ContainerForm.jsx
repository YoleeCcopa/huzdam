import React, { useState, useEffect } from 'react';
import FormInput from '../generics/FormInput';
import FormSelect from '../generics/FormSelect';

const ContainerForm = ({ onSubmit, container = null, shelves, containers, onCancel }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    template: '',
    parent_id: '',
    parent_type: '',
  });

  useEffect(() => {
    if (container) {
      setForm({
        name: container.name || '',
        description: container.description || '',
        template: container.template || '',
        parent_id: container.parent_id || '',
        parent_type: container.parent_type || '',
      });
    }
  }, [container]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    if (!container) {
      setForm({ name: '', description: '', template: '', parent_id: '', parent_type: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormSelect name="parent_id" value={form.parent_id} onChange={handleChange} options={shelves} />
      <FormInput name="name" value={form.name} onChange={handleChange} placeholder="Container name" required />
      <FormInput name="description" value={form.description} onChange={handleChange} placeholder="Description" />
      <FormInput name="template" value={form.template} onChange={handleChange} placeholder="Template" />
      <button type="submit">{container ? 'Save' : 'Create New Container'}</button>
      {container && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default ContainerForm;
