const express = require('express');
const router = express.Router();
const pool = require('../database');

// GET current prices
router.get('/prices', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM prices WHERE is_active = 1 ORDER BY effective_from DESC LIMIT 1');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

// POST update prices
router.post('/prices', async (req, res) => {
  const { shop, monthly, order } = req.body;
  
  if (!shop || !monthly || !order) {
    return res.status(400).json({ error: 'All price fields (shop, monthly, order) are required' });
  }

  try {
    // Start transaction
    await pool.query('START TRANSACTION');
    
    // Deactivate current prices
    await pool.query('UPDATE prices SET is_active = 0 WHERE is_active = 1');
    
    // Insert new prices
    const [result] = await pool.query(
      'INSERT INTO prices (shop_price, monthly_price, order_price, effective_from, is_active) VALUES (?, ?, ?, NOW(), 1)',
      [shop, monthly, order]
    );
    
    // Commit transaction
    await pool.query('COMMIT');
    
    res.json({ 
      message: 'Prices updated successfully',
      price_id: result.insertId
    });
  } catch (error) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    console.error('Error updating prices:', error);
    res.status(500).json({ error: 'Failed to update prices' });
  }
});

// GET price history
router.get('/prices/history', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM prices ORDER BY effective_from DESC LIMIT 10');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching price history:', error);
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
});

module.exports = router;