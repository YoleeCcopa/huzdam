import React, { useState } from 'react';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState(null);

  const signup = async () => {
    setError(null);

    try {
      const res = await fetch('/api/v1/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          password_confirmation: confirmation,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Signup successful! Check your email to confirm.');
        window.location.href = '/';
      } else {
        setError(data.errors?.full_messages?.join(', ') || 'Signup failed');
      }
    } catch (e) {
      setError('Unexpected error occurred');
      console.error(e);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <input type="password" placeholder="Confirm Password" onChange={e => setConfirmation(e.target.value)} />
      <button onClick={signup}>Sign Up</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SignupForm;