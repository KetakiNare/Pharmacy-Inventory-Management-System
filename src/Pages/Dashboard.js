import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/Dashboard.css';
import {
  FaBoxOpen,
  FaExclamationTriangle,
  FaChartLine,
  FaRupeeSign,
  FaPlus,
} from 'react-icons/fa';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#f87171', '#facc15', '#10b981'];

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    total_medicines: 0,
    expiring_soon: 0,
    low_stock: 0,
    monthly_sales: 0,
    stock_distribution: [],
    daily_sales_data: [],
    monthly_sales_data: [],
    yearly_sales_data: []
  });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('daily');
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
  const [showAddRow, setShowAddRow] = useState(false);

  const categories = ['Pain Reliever', 'Antibiotic', 'Syrup', 'Injection', 'Ointment', 'Eye Drops', 'Multivitamin'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:8000/dashboard.php?action=alldata");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.error) {
          console.error('Server error:', data.error);
          return;
        }
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAddNew = async () => {
    try {
      const response = await axios.post('http://localhost:8000/inventory.php?action=add', newMedicine);
      setDashboardData(prevData => ({
        ...prevData,
        total_medicines: prevData.total_medicines + 1,
        stock_distribution: [...prevData.stock_distribution, response.data]
      }));
      setNewMedicine({ name: '', batch: '', category: '', qty: '', mfg: '', exp: '', cost: '', price: '', supplier: '' });
      setShowAddRow(false);
    } catch (error) {
      console.error("Error adding medicine:", error);
    }
  };


  const chartData =
    view === 'daily'
      ? dashboardData.daily_sales_data
      : view === 'monthly'
      ? dashboardData.monthly_sales_data
      : dashboardData.yearly_sales_data;

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard data...</div>;
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
        
        
      <div className="top-widgets">
        <div className="widget widget-blue">
          <FaBoxOpen className="widget-icon" />
          <div>
            <p>Total Medicines</p>
            <h3>{dashboardData.total_medicines}</h3>
          </div>
        </div>
        <div className="widget widget-yellow">
          <FaExclamationTriangle className="widget-icon" />
          <div>
            <p>Expiring Soon</p>
            <h3>{dashboardData.expiring_soon}</h3>
          </div>
        </div>
        <div className="widget widget-red">
          <FaChartLine className="widget-icon" />
          <div>
            <p>Low Stock</p>
            <h3>{dashboardData.low_stock}</h3>
          </div>
        </div>
        <div className="widget widget-green">
          <FaRupeeSign className="widget-icon" />
          <div>
            <p>Monthly Sales</p>
            <h3>₹{(dashboardData.monthly_sales || 0).toLocaleString('en-IN')}</h3>
          </div>
        </div>
      </div>


      <div className="quick-links">
        <button className="quick-btn" onClick={() => setShowAddRow(!showAddRow)}>
          <FaPlus /> Add New Medicine
        </button>
      </div>

      {showAddRow && (
        <div className="add-medicine-form">
          <input
            type="text"
            placeholder="Name"
            value={newMedicine.name}
            onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Batch"
            value={newMedicine.batch}
            onChange={(e) => setNewMedicine({ ...newMedicine, batch: e.target.value })}
          />
          <select
            value={newMedicine.category}
            onChange={(e) => setNewMedicine({ ...newMedicine, category: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantity"
            value={newMedicine.qty}
            onChange={(e) => setNewMedicine({ ...newMedicine, qty: e.target.value })}
          />
          <input
            type="date"
            placeholder="Manufacturing Date"
            value={newMedicine.mfg}
            onChange={(e) => setNewMedicine({ ...newMedicine, mfg: e.target.value })}
          />
          <input
            type="date"
            placeholder="Expiry Date"
            value={newMedicine.exp}
            onChange={(e) => setNewMedicine({ ...newMedicine, exp: e.target.value })}
          />
          <input
            type="number"
            placeholder="Cost"
            value={newMedicine.cost}
            onChange={(e) => setNewMedicine({ ...newMedicine, cost: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={newMedicine.price}
            onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })}
          />
          <input
            type="text"
            placeholder="Supplier"
            value={newMedicine.supplier}
            onChange={(e) => setNewMedicine({ ...newMedicine, supplier: e.target.value })}
          />
          <button onClick={handleAddNew}>Save</button>
          <button onClick={() => setShowAddRow(false)}>Cancel</button>
        </div>
      )}

     
      <div className="dual-charts">
        <div className="chart-card">
          <h3>Stock Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.stock_distribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {dashboardData.stock_distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Medicines']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

       
        <div className="chart-card">
          <h3>Sales Overview</h3>
          <select value={view} onChange={(e) => setView(e.target.value)}>
            <option value="daily">Daily Sales</option>
            <option value="monthly">Monthly Sales</option>
            <option value="yearly">Yearly Sales</option>
          </select>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={view === 'daily' ? 'date' : view === 'monthly' ? 'month' : 'year'} />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Sales']} />
              <Legend />
              <Bar
                dataKey={
                  view === 'daily'
                    ? 'daily_sales'
                    : view === 'monthly'
                    ? 'monthly_sales'
                    : 'yearly_sales'
                }
                name={`${view.charAt(0).toUpperCase() + view.slice(1)} Sales`}
                fill="#4a90e2"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
