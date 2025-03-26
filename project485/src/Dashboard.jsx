import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const mockLockers = [
  { id: 'A101', occupied: true, customer: { name: 'John Doe', paid: false, phone: '555-1234' } },
  { id: 'B202', occupied: true, customer: { name: 'Jane Smith', paid: true, phone: '555-5678' } },
  { id: 'C303', occupied: false, customer: null },
  { id: 'D404', occupied: true, customer: { name: 'Emily Rose', paid: false, phone: '555-4321' } },
  { id: 'E505', occupied: false, customer: null }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [lockers, setLockers] = useState([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('managerLoggedIn');
    if (!isLoggedIn) navigate('/');
    setLockers(mockLockers);
  }, [navigate]);

  const occupied = lockers.filter(l => l.occupied);
  const vacant = lockers.filter(l => !l.occupied);
  const customers = occupied.map(l => l.customer);
  const owing = customers.filter(c => !c.paid);
  const paid = customers.filter(c => c.paid);

  return (
    <main style={styles.page}>
      <h1 style={styles.heading}>Manager Dashboard</h1>

      <div style={styles.sections}>
        <section style={styles.card}>
          <h2>Profile Info</h2>
          <p>Logged in as: <strong>Manager</strong></p>
          <button style={styles.logout} onClick={() => {
            localStorage.removeItem('managerLoggedIn');
            navigate('/');
          }}>Log Out</button>
        </section>

        <section style={styles.card}>
          <h2>Locker Summary</h2>
          <p><strong>Total Lockers:</strong> {lockers.length}</p>
          <p><strong>Occupied:</strong> {occupied.length}</p>
          <p><strong>Vacant:</strong> {vacant.length}</p>
        </section>

        <section style={styles.card}>
          <h2>Customer Overview</h2>
          <p><strong>Customers Owing:</strong> {owing.length}</p>
          <p><strong>Customers Paid:</strong> {paid.length}</p>
        </section>
      </div>

      <section style={{ ...styles.card, marginTop: '2rem' }}>
        <h2>Locker Layout</h2>
        <div style={styles.lockerGrid}>
          {lockers.map((locker) => (
            <Link
              to={locker.occupied ? `/customer/${locker.id}` : '#'}
              key={locker.id}
              style={{
                ...styles.locker,
                backgroundColor: locker.occupied ? '#f87171' : '#34d399',
                textDecoration: 'none',
                pointerEvents: locker.occupied ? 'auto' : 'none'
              }}
            >
              <strong>{locker.id}</strong>
              <p>{locker.occupied ? locker.customer.name : 'Vacant'}</p>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ ...styles.card, marginTop: '2rem' }}>
        <h2>Customer Info</h2>
        {customers.map((c, index) => (
          <div key={index} style={styles.customer}>
            <p><strong>Name:</strong> {c.name}</p>
            <p><strong>Phone:</strong> {c.phone}</p>
            <p><strong>Status:</strong> {c.paid ? 'Paid' : 'Owes Balance'}</p>
          </div>
        ))}
      </section>
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
  sections: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  card: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
    flex: '1',
    minWidth: '250px',
  },
  logout: {
    marginTop: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  lockerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  },
  locker: {
    padding: '1rem',
    borderRadius: '6px',
    color: 'white',
    textAlign: 'center',
  },
  customer: {
    backgroundColor: '#f9fafb',
    padding: '0.75rem',
    marginTop: '0.5rem',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
  }
};