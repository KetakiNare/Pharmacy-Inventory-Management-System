import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaCashRegister,
  FaChartBar,
  FaBell,
} from 'react-icons/fa';

function Sidebar({ role }) {
  const base = role === 'admin' ? '/admin' : '/pharmacist';

  return (
    <div className="sidebar">
      <NavLink to={`${base}/dashboard`} className="sidebar-link">
        <FaTachometerAlt /> Dashboard
      </NavLink>
      <NavLink to={`${base}/inventory`} className="sidebar-link">
        <FaBoxOpen /> Inventory
      </NavLink>
      <NavLink to={`${base}/sales`} className="sidebar-link">
        <FaCashRegister /> Sales
      </NavLink>
      {role === 'admin' && (
        <>
          <NavLink to={`${base}/reports`} className="sidebar-link">
            <FaChartBar /> Reports
          </NavLink>
          <NavLink to={`${base}/notifications`} className="sidebar-link">
            <FaBell /> Notifications
          </NavLink>
        </>
      )}
    </div>
  );
}

export default Sidebar;
