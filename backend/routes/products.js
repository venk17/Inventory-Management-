const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

module.exports = (db) => {

  // Get all products with search and filter
  router.get('/', (req, res) => {
    const { search, category, brand, status, sort = 'name', order = 'asc' } = req.query;
    
    let query = `
      SELECT p.*, 
        CASE 
          WHEN p.stock = 0 THEN 'Out of Stock'
          WHEN p.stock < 10 THEN 'Low Stock' 
          ELSE 'In Stock'
        END as status
      FROM products p
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ' AND (p.name LIKE ? OR p.category LIKE ? OR p.brand LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (category) {
      query += ' AND p.category = ?';
      params.push(category);
    }

    if (brand) {
      query += ' AND p.brand = ?';
      params.push(brand);
    }

    if (status) {
      if (status === 'In Stock') {
        query += ' AND p.stock >= 10';
      } else if (status === 'Low Stock') {
        query += ' AND p.stock < 10 AND p.stock > 0';
      } else if (status === 'Out of Stock') {
        query += ' AND p.stock = 0';
      }
    }

    // Add sorting
    const validSortColumns = ['name', 'category', 'brand', 'stock', 'created_at', 'updated_at'];
    const sortColumn = validSortColumns.includes(sort) ? sort : 'name';
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    
    query += ` ORDER BY ${sortColumn} ${sortOrder}`;

    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch products' });
      }
      res.json(rows);
    });
  });

  // Get product by ID
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    
    db.get(`
      SELECT p.*, 
        CASE 
          WHEN p.stock = 0 THEN 'Out of Stock'
          WHEN p.stock < 10 THEN 'Low Stock' 
          ELSE 'In Stock'
        END as status
      FROM products p 
      WHERE p.id = ?
    `, [id], (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch product' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json(row);
    });
  });

  // Create new product
  router.post('/', (req, res) => {
    const { name, unit, category, brand, stock, image } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    const query = `
      INSERT INTO products (name, unit, category, brand, stock, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.run(query, [name, unit, category, brand, stock || 0, image], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Product name already exists' });
        }
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to create product' });
      }
      
      // Log inventory history
      const historyQuery = `
        INSERT INTO inventory_history (product_id, old_quantity, new_quantity, action_type)
        VALUES (?, ?, ?, ?)
      `;
      db.run(historyQuery, [this.lastID, 0, stock || 0, 'CREATE']);
      
      res.status(201).json({ 
        id: this.lastID, 
        message: 'Product created successfully' 
      });
    });
  });

  // Update product
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, unit, category, brand, stock, image } = req.body;
    
    // First get current product data
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, currentProduct) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch product' });
      }
      
      if (!currentProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const query = `
        UPDATE products 
        SET name = ?, unit = ?, category = ?, brand = ?, stock = ?, image = ?
        WHERE id = ?
      `;
      
      db.run(query, [
        name || currentProduct.name,
        unit || currentProduct.unit,
        category || currentProduct.category,
        brand || currentProduct.brand,
        stock !== undefined ? stock : currentProduct.stock,
        image || currentProduct.image,
        id
      ], function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Product name already exists' });
          }
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to update product' });
        }
        
        // Log inventory history if stock changed
        if (stock !== undefined && stock !== currentProduct.stock) {
          const historyQuery = `
            INSERT INTO inventory_history (product_id, old_quantity, new_quantity, action_type)
            VALUES (?, ?, ?, ?)
          `;
          db.run(historyQuery, [id, currentProduct.stock, stock, 'UPDATE']);
        }
        
        res.json({ message: 'Product updated successfully' });
      });
    });
  });

  // Delete product
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    
    db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to delete product' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json({ message: 'Product deleted successfully' });
    });
  });

  // Get inventory history for a product
  router.get('/:id/history', (req, res) => {
    const { id } = req.params;
    
    db.all(`
      SELECT h.*, p.name as product_name
      FROM inventory_history h
      JOIN products p ON h.product_id = p.id
      WHERE h.product_id = ?
      ORDER BY h.change_date DESC
    `, [id], (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch history' });
      }
      res.json(rows);
    });
  });

  // Get categories and brands for filters
  router.get('/meta/filters', (req, res) => {
    db.all(`
      SELECT 
        (SELECT GROUP_CONCAT(DISTINCT category) FROM products WHERE category IS NOT NULL) as categories,
        (SELECT GROUP_CONCAT(DISTINCT brand) FROM products WHERE brand IS NOT NULL) as brands
    `, (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch filter data' });
      }
      
      const result = {
        categories: row[0].categories ? row[0].categories.split(',') : [],
        brands: row[0].brands ? row[0].brands.split(',') : []
      };
      
      res.json(result);
    });
  });

  return router;
};