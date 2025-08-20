import React, { useState, useEffect } from 'react';
import { FaBell, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const username = sessionStorage.getItem('username') || 'User';
  const [hasNotification, setHasNotification] = useState(true);

  
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const handleNotifications = () => {
    setHasNotification(false);
    const role = sessionStorage.getItem('role');
    if (role === 'admin') {
      navigate('/admin/notifications');
    } else if (role === 'pharmacist') {
      navigate('/pharmacist/notifications');
    }
  };

  
  useEffect(() => {
    if (search.trim() === '') {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/inventory.php?action=fetch&query=${search}`
        );

        
        const filtered = response.data.filter(
          (med) =>
            med.name.toLowerCase().includes(search.toLowerCase()) ||
            med.batch.toLowerCase().includes(search.toLowerCase())
        );
        setResults(filtered);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };

    fetchData();
  }, [search]);

  
  const handleSelectMedicine = (medicine) => {
    setSearch('');
    setResults([]);
    navigate('/sales', { state: { selectedMedicine: medicine } });
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/images/Logo.png" alt="Logo" className="logo" />

        <div className="sidebar-search">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search medicine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

         
          {results.length > 0 && (
            <ul className="search-results">
              {results.map((med) => (
                <li key={med.id} onClick={() => handleSelectMedicine(med)}>
                  {med.name} (Batch: {med.batch}, Qty: {med.qty})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

     
      <div className="navbar-right">
        <span className="welcome-text">Welcome, {username}</span>

        <div className="notification-icon" onClick={handleNotifications}>
          <FaBell size={18} />
          {hasNotification && <span className="notification-dot"></span>}
        </div>

        <div className="logout-icon" onClick={handleLogout}>
          <FaSignOutAlt size={18} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
