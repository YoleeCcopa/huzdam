import React, { useState, useEffect } from 'react';
import FormInput from '../generics/FormInput';
import FormSelect from '../generics/FormSelect';

const ShelfForm = ({ onSubmit, shelf = null, areas, onCancel }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    template: '',
    parent_id: '',
    parent_type: 'Area',
  });

  useEffect(() => {
    if (shelf) {
      setForm({
        name: shelf.name || '',
        description: shelf.description || '',
        template: shelf.template || '',
        parent_id: shelf.parent_id || '',
        parent_type: shelf.parent_type || 'Area',
      });
    }
  }, [shelf]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    if (!shelf) {
      setForm({ name: '', description: '', template: '', parent_id: '', parent_type: 'Area' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormSelect name="parent_id" value={form.parent_id} onChange={handleChange} options={areas} />
      <FormInput name="name" value={form.name} onChange={handleChange} placeholder="Shelf name" required />
      <FormInput name="description" value={form.description} onChange={handleChange} placeholder="Description" />
      <FormInput name="template" value={form.template} onChange={handleChange} placeholder="Template" />
      <button type="submit">{shelf ? 'Save' : 'Create New Shelf'}</button>
      {shelf && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default ShelfForm;
