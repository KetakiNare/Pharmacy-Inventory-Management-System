import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import Papa from 'papaparse';
import '../Styles/Reports.css';
import axios from 'axios';

function Reports() {
  const [reportType, setReportType] = useState('sales');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reportData, setReportData] = useState([]);

  
  const handleGenerate = async () => {
    try {
      const response = await axios.get("http://localhost:8000/reports.php", {
        params: { type: reportType, from: fromDate, to: toDate }
      });
      if (response.data.success) {
        setReportData(response.data.data);
      } else {
        alert("Error: " + response.data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch report");
    }
  };


  const exportPDF = () => {
  if (reportData.length === 0) {
    alert("No data to export!");
    return;
  }

  const doc = new jsPDF();
  doc.text(`${reportType.toUpperCase()} Report`, 14, 16);

  const headers = Object.keys(reportData[0]);
  const rows = reportData.map(row => Object.values(row));

  
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 20,
  });

  doc.save(`${reportType}_report.pdf`);
};

  const exportCSV = () => {
    if (reportData.length === 0) {
      alert("No data to export!");
      return;
    }

    const csv = Papa.unparse(reportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  
  const renderTableHeaders = () => {
    switch (reportType) {
      case "sales":
        return (
          <>
            <th>Date</th>
            <th>Medicine</th>
            <th>Quantity</th>
            <th>Amount</th>
          </>
        );
      case "inventory":
        return (
          <>
            <th>Name</th>
            <th>Batch</th>
            <th>Quantity</th>
            <th>Cost</th>
            <th>Price</th>
            <th>Supplier</th>
            <th>Expiry</th>
          </>
        );
      case "expiry":
        return (
          <>
            <th>Name</th>
            <th>Batch</th>
            <th>Quantity</th>
            <th>Expiry Date</th>
          </>
        );
      case "lowstock":
        return (
          <>
            <th>Name</th>
            <th>Batch</th>
            <th>Quantity</th>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="reports-page">
      <h2>Reports</h2>

     
      <div className="report-filters">
        <div>
          <label>From Date:</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div>
          <label>To Date:</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
        <div>
          <label>Report Type:</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="sales">Sales Report</option>
            <option value="inventory">Inventory Report</option>
            <option value="expiry">Expiry Report</option>
            <option value="lowstock">Low Stock Report</option>
          </select>
        </div>
        <button className="generate-btn" onClick={handleGenerate}>Generate</button>
      </div>

     
      <div className="report-table-section">
        <table className="report-table">
          <thead>
            <tr>{renderTableHeaders()}</tr>
          </thead>
          <tbody>
            {reportData.length === 0 ? (
              <tr><td colSpan="7">No records found</td></tr>
            ) : (
              reportData.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val, i) => (
                    <td key={i}>{val}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

       
        <div className="export-buttons">
          <button className="export-btn" onClick={exportPDF}>Export as PDF</button>
          <button className="export-btn" onClick={exportCSV}>Export as CSV</button>
        </div>
      </div>
    </div>
  );
}

export default Reports;
