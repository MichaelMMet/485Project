import express from "express";
import cors from "cors";
import mysql from "mysql2";

// Create the Express app
const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection setup
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Running_Mac17", 
  database: "lockers",
});

const promisePool = pool.promise();

// API Routes
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
    console.error("Error fetching lockers:", error);
    res.status(500).json({ error: "Failed to fetch lockers" });
  }
});

app.get("/api/lockers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [lockers] = await promisePool.query(
      `SELECT 
        Lockers.id AS lockerId, Lockers.occupied, 
        Customers.name, Customers.phone, Customers.paid
      FROM Lockers
      LEFT JOIN Customers ON Lockers.id = Customers.locker_id
      WHERE Lockers.id = ?`,
      [id]
    );

    if (lockers.length > 0) {
      res.json(lockers[0]); // Send the first matching locker
    } else {
      res.status(404).json({ error: "Locker not found" });
    }
  } catch (error) {
    console.error("Error fetching locker:", error);
    res.status(500).json({ error: "Failed to fetch locker" });
  }
});


// Start the server
app.listen(3307, () => {
  console.log("Server is running on port 5000");
});
