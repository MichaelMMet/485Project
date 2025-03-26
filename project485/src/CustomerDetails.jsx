import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const mockLockers = [
  { id: 'A101', occupied: true, customer: { name: 'John Doe', paid: false, phone: '555-1234' } },
  { id: 'B202', occupied: true, customer: { name: 'Jane Smith', paid: true, phone: '555-5678' } },
  { id: 'C303', occupied: false, customer: null },
  { id: 'D404', occupied: true, customer: { name: 'Emily Rose', paid: false, phone: '555-4321' } },
  { id: 'E505', occupied: false, customer: null }
];

export default function CustomerDetails() {
  const { lockerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const locker = mockLockers.find(l => l.id === lockerId);
    if (!locker || !locker.occupied) {
      navigate('/dashboard');
      return;
    }
    setCustomer({ ...locker.customer, lockerId: locker.id });
  }, [lockerId, navigate]);

  if (!customer) return null;

  return (
    <main style={styles.page}>
      <h1 style={styles.heading}>Customer Details</h1>
      <div style={styles.card}>
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Phone:</strong> {customer.phone}</p>
        <p><strong>Locker ID:</strong> {customer.lockerId}</p>
        <p><strong>Status:</strong> {customer.paid ? 'Paid' : 'Owes Balance'}</p>
        <button style={styles.button} onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    </main>
  );
}

const styles = {
  page: {
    padding: '2rem',
    fontFamily: 'sans-serif',
    backgroundColor: '#f3f4f6',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
  },
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    margin: '0 auto',
  },
  button: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
