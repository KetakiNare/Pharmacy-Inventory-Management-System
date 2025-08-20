import React, { useEffect, useState } from "react";
import "../Styles/Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState({
    expiringSoon: { count: 0, medicines: [] },
    lowStock: { count: 0, medicines: [] },
  });

  useEffect(() => {
    fetch("http://localhost:8000/Notifications.php")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data); 
        if (data.status === "success") {
          setNotifications({
            expiringSoon: data.expiringSoon,
            lowStock: data.lowStock,
          });
        } else {
          console.error("Error in response status:", data.message);
        }
      })
      .catch((err) => console.error("Error fetching notifications:", err));
  }, []);

  useEffect(() => {
    console.log("Updated notifications state:", notifications); 
  }, [notifications]);

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>

      <div className="alert-box">
        <h3>⏰ Expiring Soon Medicines ({notifications.expiringSoon.count})</h3>
        <ul>
          {notifications.expiringSoon.medicines.length > 0 ? (
            notifications.expiringSoon.medicines.map((med, index) => (
              <li key={index}>{med}</li>
            ))
          ) : (
            <li>No medicines expiring soon.</li>
          )}
        </ul>
      </div>

      <div className="alert-box">
        <h3>📉 Low Stock Medicines ({notifications.lowStock.count})</h3>
        <ul>
          {notifications.lowStock.medicines.length > 0 ? (
            notifications.lowStock.medicines.map((med, index) => (
              <li key={index}>{med}</li>
            ))
          ) : (
            <li>No low stock medicines.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Notifications;
