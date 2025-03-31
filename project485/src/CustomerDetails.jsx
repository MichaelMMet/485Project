// frontend/src/CustomerDetails.js
import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CustomerDetails() {
  const { lockerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch customer details
  const fetchCustomerDetails = useCallback(async () => {
    console.log(`Fetching customer details for locker: ${lockerId}`);
    try {
      const response = await fetch(
        `http://localhost:5000/api/lockers/${lockerId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch customer details.");
      }
      const data = await response.json();

      if (!data || !data.name) {
        navigate("/dashboard");
        return;
      }
      console.log(data);
      setCustomer({
        id: data.customerId, // Use lockerId as the customer identifier
        name: data.name,
        phone: data.phone,
        paid: data.paid === 1 || data.paid === true,
        lockerId: data.lockerId,
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching customer:", error);
      setIsLoading(false);
    }
  }, [lockerId, navigate]);

  useEffect(() => {
    fetchCustomerDetails();
  }, [fetchCustomerDetails]);

  // Add new customer

  // Delete customer
  const deleteCustomer = async () => {
    console.log("Customer object:", customer);
    console.log("Deleting customer with Locker ID:", customer.lockerId); // Use lockerId for deletion

    const customerId = customer.id; // ✅ Correct: Use customer.id (which comes from the database)

    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const res = await fetch(
          `http://localhost:5000/api/customers/${customerId}`,
          {
            method: "DELETE",
          }
        );

        if (res.ok) {
          alert("Customer deleted successfully!");
          navigate("/dashboard");
          await fetch(`http://localhost:5000/api/lockers/${lockerId}`, {
            method: "PATCH", // Use PATCH to update a specific locker
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ occupied: false }), // Set the locker to vacant
          });
        } else {
          alert("Failed to delete customer.");
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  if (isLoading) return <h2>Loading...</h2>;

  return (
    <main style={styles.page}>
      <h1 style={styles.heading}>Customer Details</h1>
      {customer ? (
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
          <button style={styles.deleteButton} onClick={deleteCustomer}>
            Delete Customer
          </button>
        </div>
      ) : (
        <p>No customer assigned to this locker.</p>
      )}

      <button style={styles.button} onClick={() => navigate("/dashboard")}>
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
  card: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    margin: "0 auto",
    marginBottom: "1rem",
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
  deleteButton: {
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  formContainer: {
    marginTop: "2rem",
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    margin: "0 auto",
  },
};
