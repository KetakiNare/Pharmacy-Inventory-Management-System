import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const formData = {
      username,
      email,
      password,
      confirmPassword,
      role,
    };

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/signup.php', formData);
      const data = response.data;

      if (data.success) {
        alert('Signup successful!');
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'pharmacist') {
          navigate('/pharmacist');
        }
      } else if (data.message === 'User already exists') {
        alert('Account already exists. Redirecting to login...');
        navigate('/login');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Network or server error:', error);
      alert('Network or server error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="signup-page">
  <div className="left-section">
    <img src="/images/login.png" alt="Signup illustration" />
  </div>

  <div className="right-section">
    <div className="signup-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="UserName"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

       <div className="password-field">
  <input
    type={showPassword ? 'text' : 'password'}
    placeholder="Password"
    required
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <span onClick={() => setShowPassword(!showPassword)}>
    {showPassword ? '🙈' : '👁️'}
  </span>
</div>

<div className="password-field">
  <input
    type={showConfirmPassword ? 'text' : 'password'}
    placeholder="Confirm Password"
    required
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
  />
  <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
    {showConfirmPassword ? '🙈' : '👁️'}
  </span>
</div>


        <select
          className="role-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="pharmacist">Pharmacist</option>
        </select>

        <button type="submit" className="signup-btn" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      <p className="login-link">
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  </div>
</div>

  );
};

export default Signup;
