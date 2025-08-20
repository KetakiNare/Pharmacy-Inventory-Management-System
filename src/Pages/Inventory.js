import React, { useState, useEffect } from 'react';
import '../Styles/Inventory.css';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

function Inventory() {
  const [showAddRow, setShowAddRow] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    batch: '',
    category: '',
    qty: '',
    mfg: '',
    exp: '',
    cost: '',
    price: '',
    supplier: ''
  });

  const [medicines, setMedicines] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const categories = ['Pain Reliever', 'Antibiotic', 'Syrup', 'Injection', 'Ointment', 'Eye Drops','Multivitamin'];

  
  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get('http://localhost:8000/inventory.php?action=fetch');
      setMedicines(response.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.post('http://localhost:8000/inventory.php?action=delete', { id });
      setMedicines(medicines.filter((med) => med.id !== id));
    } catch (error) {
      console.error("Error deleting medicine:", error);
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleChange = (e, id, field) => {
    const updated = medicines.map((med) =>
      med.id === id ? { ...med, [field]: e.target.value } : med
    );
    setMedicines(updated);
  };

  const handleSaveEdit = async (id) => {
    const medToUpdate = medicines.find(med => med.id === id);
    try {
      await axios.post('http://localhost:8000/inventory.php?action=update', medToUpdate);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating medicine:", error);
    }
  };

  const handleAddNew = async () => {
    try {
      const response = await axios.post('http://localhost:8000/inventory.php?action=add', newMedicine);
      setMedicines([...medicines, response.data]); 
      setNewMedicine({ name: '', batch: '', category: '', qty: '', mfg: '', exp: '', cost: '', price: '', supplier: '' });
      setShowAddRow(false);
    } catch (error) {
      console.error("Error adding medicine:", error);
    }
  };

  const isExpiringSoon = (expDate) => {
    const today = new Date();
    const exp = new Date(expDate);
    const diff = (exp - today) / (1000 * 60 * 60 * 24);
    return diff < 30;
  };

  const isLowStock = (qty) => qty <= 10;

  return (
    <div className="inventory">
      <div className="inventory-header">
        <h2>Inventory Management</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div className="legend">
            <div><span className="legend-box expiring-box"></span> Expiring Soon</div>
            <div><span className="legend-box lowstock-box"></span> Low Stock</div>
          </div>
          <button className="add-btn" onClick={() => setShowAddRow(true)}><FaPlus /> Add New</button>
        </div>
      </div>

      <table className="medicine-table">
        <thead>
          <tr>
            <th>Medicine Name</th>
            <th>Batch No</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Mfg Date</th>
            <th>Expiry Date</th>
            <th>Cost Price</th>
            <th>Sell Price</th>
            <th>Supplier</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>

          {showAddRow && (
            <tr>
              <td><input value={newMedicine.name} onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })} /></td>
              <td><input value={newMedicine.batch} onChange={(e) => setNewMedicine({ ...newMedicine, batch: e.target.value })} /></td>
              <td>
                <select value={newMedicine.category} onChange={(e) => setNewMedicine({ ...newMedicine, category: e.target.value })}>
                  <option value="">Select</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </td>
              <td><input value={newMedicine.qty} onChange={(e) => setNewMedicine({ ...newMedicine, qty: e.target.value })} /></td>
              <td><input value={newMedicine.mfg} onChange={(e) => setNewMedicine({ ...newMedicine, mfg: e.target.value })} /></td>
              <td><input value={newMedicine.exp} onChange={(e) => setNewMedicine({ ...newMedicine, exp: e.target.value })} /></td>
              <td><input value={newMedicine.cost} onChange={(e) => setNewMedicine({ ...newMedicine, cost: e.target.value })} /></td>
              <td><input value={newMedicine.price} onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })} /></td>
              <td><input value={newMedicine.supplier} onChange={(e) => setNewMedicine({ ...newMedicine, supplier: e.target.value })} /></td>
              <td>
                <button className="edit-btn" onClick={handleAddNew}>Save</button>
                <button className="delete-btn" onClick={() => setShowAddRow(false)}>Cancel</button>
              </td>
            </tr>
          )}

          {medicines.map((med) => (
            <tr key={med.id}
              className={`${isExpiringSoon(med.exp) ? 'expiring' : ''} ${isLowStock(med.qty) ? 'low-stock' : ''}`}>
              <td>{editingId === med.id ? <input value={med.name} onChange={(e) => handleChange(e, med.id, 'name')} /> : med.name}</td>
              <td>{editingId === med.id ? <input value={med.batch} onChange={(e) => handleChange(e, med.id, 'batch')} /> : med.batch}</td>
              <td>{editingId === med.id ? (
                <select value={med.category} onChange={(e) => handleChange(e, med.id, 'category')}>
                  <option value="">Select</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              ) : med.category}</td>
              <td>{editingId === med.id ? <input value={med.qty} onChange={(e) => handleChange(e, med.id, 'qty')} /> : med.qty}</td>
              <td>{editingId === med.id ? <input value={med.mfg} onChange={(e) => handleChange(e, med.id, 'mfg')} /> : med.mfg}</td>
              <td>{editingId === med.id ? <input value={med.exp} onChange={(e) => handleChange(e, med.id, 'exp')} /> : med.exp}</td>
              <td>{editingId === med.id ? <input value={med.cost} onChange={(e) => handleChange(e, med.id, 'cost')} /> : med.cost}</td>
              <td>{editingId === med.id ? <input value={med.price} onChange={(e) => handleChange(e, med.id, 'price')} /> : med.price}</td>
              <td>{editingId === med.id ? <input value={med.supplier} onChange={(e) => handleChange(e, med.id, 'supplier')} /> : med.supplier}</td>
              <td>
                {editingId === med.id ? (
                  <button className="edit-btn" onClick={() => handleSaveEdit(med.id)}>Save</button>
                ) : (
                  <button className="edit-btn" onClick={() => handleEdit(med.id)}><FaEdit /></button>
                )}
                <button className="delete-btn" onClick={() => handleDelete(med.id)}><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory; 