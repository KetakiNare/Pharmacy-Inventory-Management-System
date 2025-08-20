import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!email || !password || !role) {
      setMessage({ type: 'error', text: 'Please enter all details including role.' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        sessionStorage.setItem('username', data.user.username);
        sessionStorage.setItem('role', data.user.role);
        sessionStorage.setItem('userId', data.user.id);

        if (data.user.role === 'admin') {
          navigate('/admin');
        } else if (data.user.role === 'pharmacist') {
          navigate('/pharmacist');
        } else {
          navigate('/');
        }
      } else {
        if (data.error === 'invalid_email') {
          setMessage({ type: 'error', text: 'Invalid email address.' });
        } else if (data.error === 'invalid_password') {
          setMessage({ type: 'error', text: 'Incorrect password.' });
        } else if (data.error === 'invalid_role') {
          setMessage({ type: 'error', text: 'Incorrect role selected.' });
        } else {
          setMessage({ type: 'error', text: data.message || 'Login failed. Please try again.' });
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);
      setMessage({ type: 'error', text: 'Network or server error. Please try again.' });
    }
  };

  return (
    <div className="login-page">
      <div className="left-section">
        <img src="/images/login.png" alt="Login Visual" />
      </div>

      <div className="right-section">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          <p>Please log in to continue.</p>

          {message && (
            <div className={`message ${message.type === 'error' ? 'error' : 'success'}`}>
              {message.text}
            </div>
          )}

          <input
            type="email"
            placeholder="Email Id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>👁️</span>
          </div>

          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">-- Select role --</option>
            <option value="admin">Admin</option>
            <option value="pharmacist">Pharmacist</option>
          </select>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="signup-link">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
