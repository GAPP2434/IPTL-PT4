import React, { useState } from 'react';
import './Login.css'; 
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    
    fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      }),
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then(data => {
            throw new Error(data.error || 'Login failed');
          });
        }
      })
      .then(data => {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        console.log('Login successful:', data);
        navigate('/dashboard');
      })
      .catch(err => {
        setError(err.message);
        console.error('Login error:', err);
      });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;