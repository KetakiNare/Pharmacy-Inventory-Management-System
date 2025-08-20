import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../Styles/Sales.css';

function Sales() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null); 
  const [quantityToSell, setQuantityToSell] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  
const [saleDate, setSaleDate] = useState(() => {
    return new Date().toISOString().split("T")[0];  
  });

  const [paymentMode, setPaymentMode] = useState('Cash');
  const navigate = useNavigate(); 

  
  useEffect(() => {
    fetch("http://localhost:8000/sales.php?action=categories")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Categories:", data);
        setCategories(data); 
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  
  const fetchMedicinesByCategory = async (category) => {
  try {
    const res = await fetch(`http://localhost:8000/sales.php?action=medicines&category=${category}`);
    const data = await res.json();
    
   
    if (Array.isArray(data)) {
      setMedicines(data);
    } else if (Array.isArray(data.data)) {
      setMedicines(data.data);
    } else {
      setMedicines([]);
    }
  } catch (err) {
    console.error("Error fetching medicines", err);
    setMedicines([]);
  }
};


  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSelectedMedicine(null); 
    if (category) {
      fetchMedicinesByCategory(category);
    } else {
      setMedicines([]);
    }
  };

const handleMedicineChange = async (e) => {
  const selectedId = e.target.value;
  if (!selectedId) return;

  try {
    const response = await fetch(`http://localhost:8000/sales.php?action=medicineDetails&id=${selectedId}`);
    const data = await response.json();
    
    setSelectedMedicine(data.error ? null : data); 
  } catch (error) {
    console.error("Error fetching medicine details", error);
  }
};

const handleAddToCart = () => {
  if (!selectedMedicine || quantityToSell <= 0 || quantityToSell > selectedMedicine.qty) return;

  const item = {
    id: selectedMedicine.id, 
    name: selectedMedicine.name,
    batchNo: selectedMedicine.batch, 
    price: selectedMedicine.price,   
    quantity: quantityToSell,
    total: selectedMedicine.price * quantityToSell
  };

  setCartItems([...cartItems, item]);
  setQuantityToSell(1);
  setSelectedMedicine(null);
};

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);

  const handleProcessSale = async () => {
  if (!cartItems.length) {
    alert("Cart is empty!");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/sales.php?action=saveSale", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerName,
        saleDate,
        paymentMode,
        cartItems,
        subtotal,
      }),
    });

    const data = await response.json();
    if (data.success) {
      alert("Sale processed successfully!");
      navigate("/invoice", {
        state: {
          customerName,
          saleDate,
          paymentMode,
          cartItems,
          subtotal,
        },
      });

     
      setCartItems([]);
      setCustomerName('');
      setSaleDate('');
      setPaymentMode('Cash');
    } else {
      alert("Error processing sale: " + data.error);
    }
  } catch (error) {
    alert("An error occurred: " + error.message);
  }
};


  const goToAdminLogin = () => {
    navigate("/admin"); 
  };

const handleClearCart = () => {
  setCartItems([]);
};

const handleRemoveItem = (index) => {
  const updatedCart = [...cartItems];
  updatedCart.splice(index, 1);
  setCartItems(updatedCart);
};



  return (
    <div className="sales-container">
      <h2 className="title">💊 Sales / Billing Page</h2>
      <div className="sales-main">
        <div className="sales-left">
          <div className="form-group">
            <label>📂 Select Category:</label>
            <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">-- Select Category --</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
      <label>🔍 Select Medicine:</label>
      <select onChange={handleMedicineChange}>
  <option value="">-- Select Medicine --</option>
  {medicines.map((med) => (
    <option key={med.id} value={med.id}>
      {med.name}
    </option>
  ))}
</select>

    </div>

          {selectedMedicine && (
            <>
              <div className="form-group">
                <label>📦 Batch No:</label>
                <input readOnly value={selectedMedicine.batch} />
              </div>
              <div className="form-group">
                <label>🏷️ Sell Price (₹):</label>
                <input readOnly value={selectedMedicine.price} />
              </div>
              <div className="form-group">
                <label>📅 Expiry Date:</label>
                <input readOnly value={selectedMedicine.exp || ''} />
              </div>
              <div className="form-group">
                <label>📦 Available Stock:</label>
                <input readOnly value={selectedMedicine.qty} />
              </div>
             <div className="form-group">
  <label>🔢 Quantity to Sell:</label>
  <input
    type="number"
    min="0"
    max={selectedMedicine.qty} 
    value={quantityToSell}
    onChange={(e) => {
      const qty = parseInt(e.target.value) || 0; 
      if (qty > selectedMedicine.qty) {
        alert("❌ Quantity exceeds available stock!");
        setQuantityToSell(selectedMedicine.qty);
      } else {
        setQuantityToSell(qty);
      }
    }}
  />
</div>
              <button className="add-btn" onClick={handleAddToCart}>
                ➕ Add to Cart
              </button>
            </>
          )}
        </div>

        <div className="sales-right">
          <h3>🛒 Items in Bill:</h3>
          {cartItems.length > 0 && (
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Batch No</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>❌</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.batchNo}</td>
                    <td>{item.quantity}</td>
                    <td>₹ {item.price}</td>
                    <td>₹ {item.total}</td>
                    <td>
                      <button className="remove-btn" onClick={() => handleRemoveItem(index)}>❌</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h3>💰 Subtotal: ₹ {subtotal}</h3>

          <div className="form-group">
            <label>👤 Customer Name:</label>
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </div>

          <div className="form-group">
            <label>📅 Date of Sale:</label>
            <input type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} />
          </div>

          <div className="form-group">
            <label>💳 Payment Mode:</label>
            <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
              <option>Cash</option>
              <option>UPI</option>
              <option>Card</option>
              <option>Other</option>
            </select>
          </div>

          <div className="button-group">
            <button className="process-btn" onClick={handleProcessSale}>✅ Generate Bill</button>
            <button className="clear-btn" onClick={handleClearCart}>🧹 Clear Cart</button>
          </div>
          
          <div className="admin-login-btn-container">
            <button className="admin-login-btn" onClick={goToAdminLogin}>Back</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Sales;
