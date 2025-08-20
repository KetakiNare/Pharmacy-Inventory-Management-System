import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <img src="/images/logo.png" alt="Logo" className="home-logo" />

      <div className="home-buttons">
        <Link to="/login" className="home-btn login-btn">Login</Link>
        <Link to="/signup" className="home-btn signup-btn">SignUp</Link>
      </div>
    </div>
  );
}

export default Home;
