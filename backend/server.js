const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads folder
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Database
const dbPath = path.join(__dirname, 'inventory.db');
const db = new sqlite3.Database(dbPath);

// Enable foreign keys
db.run("PRAGMA foreign_keys = ON");

// Initialize DB tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      unit TEXT,
      category TEXT,
      brand TEXT,
      stock INTEGER NOT NULL DEFAULT 0,
      status TEXT,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS inventory_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      old_quantity INTEGER,
      new_quantity INTEGER,
      change_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      user_info TEXT,
      action_type TEXT,
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `);

  // Auto-update updated_at
  db.run(`
    CREATE TRIGGER IF NOT EXISTS update_product_timestamp
    AFTER UPDATE ON products
    FOR EACH ROW
    BEGIN
      UPDATE products 
      SET updated_at = CURRENT_TIMESTAMP 
      WHERE id = OLD.id;
    END;
  `);

  // Insert sample data
  db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
    if (row.count === 0) {
      const sampleProducts = [
        ['Laptop Dell XPS 13', 'piece', 'Electronics', 'Dell', 15],
        ['MacBook Pro 16"', 'piece', 'Electronics', 'Apple', 8],
        ['Office Chair Ergonomic', 'piece', 'Furniture', 'Herman Miller', 12],
        ['Standing Desk', 'piece', 'Furniture', 'IKEA', 5],
        ['Wireless Mouse MX Master', 'piece', 'Electronics', 'Logitech', 25],
        ['Mechanical Keyboard', 'piece', 'Electronics', 'Corsair', 18],
        ['Monitor 27" 4K', 'piece', 'Electronics', 'LG', 7],
        ['Webcam HD Pro', 'piece', 'Electronics', 'Logitech', 22],
        ['Coffee Beans Premium', 'kg', 'Food & Beverage', 'Starbucks', 0],
        ['Green Tea Organic', 'box', 'Food & Beverage', 'Twinings', 45]
      ];

      const stmt = db.prepare(`
        INSERT INTO products (name, unit, category, brand, stock)
        VALUES (?, ?, ?, ?, ?)
      `);

      sampleProducts.forEach(product => stmt.run(product));
      stmt.finalize();

      console.log('Sample data inserted successfully!');
    }
  });
});

// Make db available to routes
app.set('db', db);

// Routes
app.use('/api/products', require('./routes/products')(db));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Server start
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export for testing
module.exports = { app, db };