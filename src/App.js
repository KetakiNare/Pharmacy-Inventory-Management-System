import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Inventory from './Pages/Inventory';
import Sales from './Pages/Sales';
import Invoice from './Pages/Invoice';


import AdminPage from './Pages/AdminPage';
import PharmacistPage from './Pages/PharmacistPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
         <Route path="inventory" element={<Inventory />} /> 
         <Route path="sales" element={<Sales />} />
        <Route path="invoice" element={<Invoice />} />
       

        {/* Role-based dashboard containers */}
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/pharmacist/*" element={<PharmacistPage />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
