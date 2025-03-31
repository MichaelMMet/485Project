// src/pages/AddCustomer.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AddCustomer() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [paid, setPaid] = useState(false);
  const [lockerId, setLockerId] = useState("");
  const [lockers, setLockers] = useState([]);

  // Fetch available lockers to populate dropdown
  const fetchLockers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/lockers");
      if (!response.ok) {
        throw new Error("Failed to fetch lockers.");
      }
      const data = await response.json();
      // Only show vacant lockers
      setLockers(data.filter((locker) => !locker.occupied));
    } catch (error) {
      console.error("Error fetching lockers:", error);
    }
  };

  useEffect(() => {
    fetchLockers();
  }, []);

  // Add new customer and update locker status to occupied
  const addCustomer = async (e) => {
    e.preventDefault();

    if (!lockerId) {
      alert("Please select a locker before adding a customer.");
      return;
    }

    const newCustomer = {
      name,
      phone,
      paid,
      locker_id: lockerId,
    };

    try {
      // 1. Add the customer
      const res = await fetch("http://localhost:5000/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });

      if (res.ok) {
        alert("Customer added successfully!");

        // 2. Update the locker to be occupied
        await fetch(`http://localhost:5000/api/lockers/${lockerId}`, {
          method: "PATCH", // Use PATCH to update a specific locker
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ occupied: true }), // Set the locker to occupied
        });

        // Redirect back to dashboard after both actions
        navigate("/dashboard");
      } else {
        alert("Failed to add customer.");
      }
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  return (
    <main style={styles.page}>
      <h1 style={styles.heading}>Add New Customer</h1>
      <form onSubmit={addCustomer} style={styles.form}>
        <label>Locker:</label>
        <select
          value={lockerId}
          onChange={(e) => setLockerId(e.target.value)}
          required
        >
          <option value="">Select a Locker</option>
          {lockers.map((locker) => (
            <option key={locker.id} value={locker.id}>
              {locker.id} (Vacant)
            </option>
          ))}
        </select>

        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Phone:</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label>Paid:</label>
        <select
          value={paid}
          onChange={(e) => setPaid(e.target.value === "true")}
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>

        <button type="submit" style={styles.button}>
          + Add Customer
        </button>
      </form>
      <button style={styles.backButton} onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </main>
  );
}

// Styles
const styles = {
  page: {
    padding: "2rem",
    fontFamily: "sans-serif",
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    margin: "0 auto",
  },
  button: {
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  backButton: {
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#9ca3af",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "block",
    margin: "1rem auto",
  },
};
