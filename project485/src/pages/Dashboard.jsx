import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [lockers, setLockers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const location = useLocation(); // Detects route changes

  // Fetch lockers and customers from backend
  const fetchData = async () => {
    try {
      // Fetch lockers
      const lockersResponse = await fetch("http://localhost:5000/api/lockers");
      if (!lockersResponse.ok) {
        throw new Error("Failed to fetch lockers.");
      }
      const lockersData = await lockersResponse.json();
      setLockers(lockersData);

      // Fetch customers
      const customersResponse = await fetch(
        "http://localhost:5000/api/customers"
      );
      if (!customersResponse.ok) {
        throw new Error("Failed to fetch customers.");
      }
      const customersData = await customersResponse.json();
      console.log(" Customers Data:", customersData); // Debug log
      setCustomers(customersData);
    } catch (error) {
      console.error(" Error fetching data:", error);
    }
  };

  const fetchLockers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/lockers");
      if (!response.ok) throw new Error("Failed to fetch lockers");
      setLockers(await response.json());
    } catch (error) {
      console.error("Error fetching lockers:", error);
    }
  };

  //  Auto-fetch data when the dashboard loads
  useEffect(() => {
    fetchLockers();
    fetchData();
  }, [location]);

  // Separate customers who have paid and those who owe balance
  const owing = customers.filter((c) => !c.paid);
  const paid = customers.filter((c) => c.paid);

  return (
    <main style={styles.page}>
      <h1 style={styles.heading}>Manager Dashboard</h1>

      <div style={styles.sections}>
        {/* Profile Info */}
        <section style={styles.card}>
          <h2>Profile Info</h2>
          <p>
            Logged in as: <strong>Manager</strong>
          </p>
          <button
            style={styles.logout}
            onClick={() => {
              localStorage.removeItem("managerLoggedIn");
              navigate("/");
            }}
          >
            Log Out
          </button>
        </section>

        {/* Locker Summary */}
        <section style={styles.card}>
          <h2>Locker Summary</h2>
          <p>
            <strong>Total Lockers:</strong> {lockers.length}
          </p>
          <p>
            <strong>Occupied:</strong>{" "}
            {lockers.filter((l) => l.occupied).length}
          </p>
          <p>
            <strong>Vacant:</strong> {lockers.filter((l) => !l.occupied).length}
          </p>
        </section>

        {/* Customer Overview Section with Add Button */}
        <section style={styles.card}>
          <h2 style={styles.titleContainer}>
            Customer Overview
            <button
              style={styles.addButton}
              onClick={() => navigate("/add-customer")}
            >
              + Add
            </button>
          </h2>
          <p>
            <strong>Customers Owing:</strong> {owing.length}
          </p>
          <p>
            <strong>Customers Paid:</strong> {paid.length}
          </p>
        </section>
      </div>

      {/* Locker Layout */}
      <section style={{ ...styles.card, marginTop: "2rem" }}>
        <h2>Locker Layout</h2>
        <div style={styles.lockerGrid}>
          {lockers.map((locker) => (
            <Link
              to={locker.occupied ? `/customer/${locker.id}` : "#"}
              key={locker.id}
              style={{
                ...styles.locker,
                backgroundColor: locker.occupied ? "#f87171" : "#34d399",
                textDecoration: "none",
                pointerEvents: locker.occupied ? "auto" : "none",
              }}
            >
              <strong>{locker.id}</strong>
              <p>{locker.occupied ? "Occupied" : "Vacant"}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Customer Info Section */}
      <section style={{ ...styles.card, marginTop: "2rem" }}>
        <h2>Customer Info</h2>
        {customers.length === 0 ? (
          <p>No customers available.</p>
        ) : (
          customers.map((c, index) => (
            <div key={index} style={styles.customer}>
              <p>
                <strong>Name:</strong> {c.name}
              </p>
              <p>
                <strong>Phone:</strong> {c.phone || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {c.paid ? "Paid" : "Owes Balance"}
              </p>
            </div>
          ))
        )}
      </section>
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
  sections: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
  },
  card: {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
    flex: "1",
    minWidth: "250px",
  },
  titleContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    padding: "0.4rem 1rem", // Padding to make it look wider
    backgroundColor: "#3b82f6", // Blue color
    color: "white",
    border: "none",
    borderRadius: "20px", // Rounded corners
    cursor: "pointer",
    fontSize: "0.9rem",
    lineHeight: "1.2rem",
    flexWrap: "wrap",
    textAlign: "center",
    transition: "background-color 0.2s ease-in-out",
  },

  // Add hover effect for better UX
  addButtonHover: {
    backgroundColor: "#2563eb", // Darker blue on hover
  },

  lockerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "1rem",
    marginTop: "1rem",
  },
  locker: {
    padding: "1rem",
    borderRadius: "6px",
    color: "white",
    textAlign: "center",
  },
  logout: {
    marginTop: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  customer: {
    backgroundColor: "#f9fafb",
    padding: "0.75rem",
    marginTop: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
  },
};