import React, { useState } from 'react';
import { post } from '../../utils/api';
import FormInput from '../generics/FormInput';

const SignupForm = ({ onSignupSuccess }) => {
  const [form, setForm] = useState({
    email: '',
    userName: '',
    password: '',
    confirmation: ''
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null); // General form-level error

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    // Update form
    setForm((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Validate field
    const error = validateField(name, fieldValue);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateField = (name, value) => {
    if (name === 'email') {
      if (!value.includes('@')) return 'Invalid email address.';
    }

    if (name === 'password') {
      if (value.length < 6) return 'Password must be at least 6 characters.';
      if (value.includes('#')) return 'This field does not support "#" symbol.';
    }

    if (name === 'confirmation') {
      if (value !== form.password) return 'Passwords do not match.';
    }

    return '';
  };

  const signup = async () => {
    setError(null);

    const { email, userName, password, confirmation, stayLoggedIn } = form;
    const payload = {
      email,
      user_name: userName,
      display_name: userName,
      password,
      password_confirmation: confirmation,
    };

    const res = await post('/api/v1/auth', payload, false);

    if (res.status === 'success') {
      alert('Signup successful! Logging in...');
      onSignupSuccess?.({ email, userName, password, stayLoggedIn });
    } else {
      const msg = res.errors?.full_messages?.join(', ') || res.message || 'Signup failed';
      setError(msg);
    }
  };

  return (
    <div id="signup-root">
      <h2>Sign Up</h2>

      <FormInput name="email" type="email" placeholder="Email" 
        value={form.email} onChange={handleChange}
        error={errors.email}
        required
      />
      <FormInput name="userName" type="text" placeholder="User name" 
        value={form.userName} onChange={handleChange}
        error={errors.userName}
        hint='You can later add a nickname different than the user name.'
        required
      />
      <FormInput name="password" type="password" placeholder="Password"
        value={form.password} onChange={handleChange}
        error={errors.password}
        hint='This field does not support "#" symbol.'
        required
      />
      <FormInput name="confirmation" type="password" placeholder="Confirm Password"
        value={form.confirmation} onChange={handleChange}
        error={errors.confirmation}
        required
      />

      <button onClick={signup}>Sign Up</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SignupForm;
