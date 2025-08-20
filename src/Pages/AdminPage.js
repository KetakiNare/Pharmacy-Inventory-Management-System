import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';

import Dashboard from './Dashboard';
import Inventory from './Inventory';
import Sales from './Sales';
import Invoice from './Invoice';
import Reports from './Reports';
import Notifications from './Notifications';

function AdminPage() {
  return (
    <>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar role="admin" />
        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
             <Route path="dashboard" element={<Dashboard />} />
             <Route path="inventory" element={<Inventory />} />
            <Route path="sales" element={<Sales />} />
        <Route path="invoice" element={<Invoice />} />
             
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default AdminPage;
