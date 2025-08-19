import React, { useState, useEffect } from 'react';
import FormInput from '../generics/FormInput';
import FormSelect from '../generics/FormSelect';

const ItemForm = ({ onSubmit, item = null, shelves, onCancel }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    parent_id: '',
    parent_type: '',
  });

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || '',
        description: item.description || '',
        parent_id: item.parent_id || '',
        parent_type: item.parent_type || '',
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    if (!item) {
      setForm({ name: '', description: '', parent_id: '', parent_type: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormSelect name="parent_id" value={form.parent_id} onChange={handleChange} options={shelves} />
      <FormInput name="name" value={form.name} onChange={handleChange} placeholder="Item name" required />
      <FormInput name="description" value={form.description} onChange={handleChange} placeholder="Description" />
      <button type="submit">{item ? 'Save' : 'Create New Item'}</button>
      {item && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default ItemForm;
