import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../Styles/Invoice.css';

function Invoice() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  if (!state) {
    navigate("/sales");
    return null;
  }

  const { customerName, saleDate, paymentMode, cartItems, subtotal } = state;

   const handlePrint = () => {
    window.print();
  };

  return (
    <div className="invoice-container">
      <h2>Invoice</h2>
      <button className="print-btn" onClick={handlePrint}>🖨️ Print</button>
      <p><strong>Customer:</strong> {customerName}</p>
      <p><strong>Date:</strong> {saleDate}</p>
      <p><strong>Payment Mode:</strong> {paymentMode}</p>

      <table>
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Batch No</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>{item.batchNo}</td>
              <td>{item.quantity}</td>
              <td>₹ {item.price}</td>
              <td>₹ {item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Total Amount: ₹ {subtotal}</h3>

      <button
        className="continue-btn"
        onClick={() => navigate("/sales")}
      >
        Continue Shopping
      </button>
    </div>
  );
}

export default Invoice;
