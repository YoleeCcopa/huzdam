import React, { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(true);
  const [error, setError] = useState(null);

  const login = async () => {
    setError(null);

    try {
      const res = await fetch('/api/v1/auth/sign_in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const tokenHeaders = {
          'access-token': res.headers.get('access-token'),
          client: res.headers.get('client'),
          uid: res.headers.get('uid'),
        };

        const storage = stayLoggedIn ? localStorage : sessionStorage;
        storage.setItem('authHeaders', JSON.stringify(tokenHeaders));

        window.location.href = '/dashboard';
      } else {
        setError(data.errors?.join(', ') || 'Login failed');
      }
    } catch (e) {
      setError('Unexpected error occurred');
      console.error(e);
    }
  };

  return (
    <div id="login-root">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <label style={{ display: 'block', marginTop: '10px' }}>
        <input
          type="checkbox"
          checked={stayLoggedIn}
          onChange={e => setStayLoggedIn(e.target.checked)}
        />
        Stay logged in after closing the browser
      </label>
      <button onClick={login}>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoginForm;
