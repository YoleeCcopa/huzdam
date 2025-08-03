import React, { useState } from 'react';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const signup = async () => {
    const res = await fetch('/api/v1/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, password_confirmation: confirmation }),
    })

    if (res.ok) {
      alert('Signup successful! Check your email to confirm.');
      window.location.href = '/';
    } else {
      const data = await res.json();
      alert(`Error: ${data.errors?.full_messages?.join(', ') || 'Signup failed'}`);
    }
  };

  return (
    <div id="signup-root">
      <h2>Sign Up</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <input type="password" placeholder="Confirm Password" onChange={e => setConfirmation(e.target.value)} />
      <button onClick={signup}>Sign Up</button>
    </div>
  );
};

export default SignupForm;