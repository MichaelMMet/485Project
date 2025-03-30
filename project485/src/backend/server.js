import express from "express";
import cors from "cors";
import mysql from "mysql2";

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection setup
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Pokibear143!", // Make sure this is correct
  database: "lockers",
  port: 3306, // Default MySQL port, should not be 5000
});

const promisePool = pool.promise();

// Server Port
const PORT = 5000;

// Root route
app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Inventory Management Backend API!</h1>");
});

// Get all lockers
app.get("/api/lockers", async (req, res) => {
  try {
    const [lockers] = await promisePool.query(`
      SELECT 
        Lockers.id, 
        Lockers.occupied, 
        Customers.id AS customer_id, 
        Customers.name, 
        Customers.phone, 
        Customers.paid 
      FROM Lockers
      LEFT JOIN Customers ON Lockers.id = Customers.locker_id
    `);
    res.json(lockers);
  } catch (error) {
    console.error("Error fetching lockers:", error.message);
    res.status(500).json({ error: "Failed to fetch lockers" });
  }
});

// Get a locker by ID
app.get("/api/lockers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [lockers] = await promisePool.query(
      `
      SELECT 
        Lockers.id AS lockerId, 
        Lockers.occupied, 
        Customers.name, 
        Customers.phone, 
        Customers.paid
      FROM Lockers
      LEFT JOIN Customers ON Lockers.id = Customers.locker_id
      WHERE Lockers.id = ?
      `,
      [id]
    );

    if (lockers.length > 0) {
      res.json(lockers[0]);
    } else {
      res.status(404).json({ error: "Locker not found" });
    }
  } catch (error) {
    console.error("Error fetching locker:", error.message);
    res.status(500).json({ error: "Failed to fetch locker" });
  }
});

// Test DB connection
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await promisePool.query("SELECT 1 + 1 AS result");
    console.log("Database connected successfully.");
    res.json({
      success: true,
      message: "Database connected successfully!",
      result: rows[0].result,
    });
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to connect to the database",
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Create a new customer
app.post("/api/customers", async (req, res) => {
    const { name, phone, paid, locker_id } = req.body;
    try {
      const [result] = await promisePool.query(
        `
        INSERT INTO Customers (name, phone, paid, locker_id)
        VALUES (?, ?, ?, ?)
        `,
        [name, phone, paid, locker_id || null]
      );
  
      res.status(201).json({
        success: true,
        message: "Customer added successfully!",
        customerId: result.insertId,
      });
    } catch (error) {
      console.error(" Error adding customer:", error.message);
      res.status(500).json({ error: "Failed to add customer" });
    }
  });
  
  // Delete a customer by ID
app.delete("/api/customers/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await promisePool.query(
        `
        DELETE FROM Customers
        WHERE id = ?
        `,
        [id]
      );
  
      if (result.affectedRows > 0) {
        res.json({ success: true, message: "Customer deleted successfully!" });
      } else {
        res.status(404).json({ error: "Customer not found" });
      }
    } catch (error) {
      console.error(" Error deleting customer:", error.message);
      res.status(500).json({ error: "Failed to delete customer" });
    }
  });
  