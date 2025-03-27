import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CustomerDetails() {
  const { lockerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3307/api/lockers/${lockerId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data); // Debugging

        if (!data.occupied) {
          navigate("/dashboard");
          return;
        }

        setCustomer({
          name: data.name, // Check if this exists in API response
          phone: data.phone, // Check if this exists in API response
          paid: data.paid,
          lockerId: data.id,
        });
      })
      .catch((error) => console.error("Error fetching customer:", error));
  }, [lockerId, navigate]);

  if (!customer) return null;

  return (
    <main style={styles.page}>
      <h1 style={styles.heading}>Customer Details</h1>
      <div style={styles.card}>
        <p>
          <strong>Name:</strong> {customer.name}
        </p>
        <p>
          <strong>Phone:</strong> {customer.phone}
        </p>
        <p>
          <strong>Locker ID:</strong> {customer.lockerId}
        </p>
        <p>
          <strong>Status:</strong> {customer.paid ? "Paid" : "Owes Balance"}
        </p>
        <button style={styles.button} onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    </main>
  );
}

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
  card: {
    backgroundColor: "white",
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
};
