import React, { useState } from 'react';
import { AuthService } from '../../services/authService';
import FormInput from '../generics/FormInput';
import FormCheck from '../generics/FormCheck';

const LoginForm = ({ prefill, onLoginSuccess }) => {
  const [form, setForm] = useState({
    identifier: prefill?.identifier || '',
    password: prefill?.password || '',
    stayLoggedIn: true,
  });
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [status, setStatus] = useState({ loading: false, message: null, error: null });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLogin = async () => {
    setStatus({ loading: true, message: null, error: null });
    const { identifier, password, stayLoggedIn } = form;

    try {
      const res = await AuthService.login({ identifier, password, stayLoggedIn });

      if (res.status === 'success') {
        onLoginSuccess?.(); // Redirect to dashboard or do other success actions
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (error) {
      setStatus({ loading: false, message: null, error: error.message });
    }
  };

  return (
    <div id="login-root">
      <h2>{useMagicLink ? 'Magic Link Login' : 'Login with Password'}</h2>

      <FormInput
        name="identifier"
        type="text"
        placeholder="Email or Username"
        value={form.identifier}
        onChange={handleChange}
        required
      />

      {!useMagicLink && (
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
      )}

      {!useMagicLink && (
        <FormCheck
          name="stayLoggedIn"
          checked={form.stayLoggedIn}
          onChange={handleChange}
          label="Stay logged in after closing the browser"
          required
        />
      )}

      <FormCheck
        name="useMagicLink"
        checked={useMagicLink}
        onChange={(e) => setUseMagicLink(e.target.checked)}
        label="Use magic login link instead"
      />

      <button onClick={handleLogin} disabled={status.loading}>
        {useMagicLink ? 'Send Magic Link' : 'Login'}
      </button>

      {status.message && <p style={{ color: 'green' }}>{status.message}</p>}
      {status.error && <p style={{ color: 'red' }}>{status.error}</p>}
    </div>
  );
};

export default LoginForm;
