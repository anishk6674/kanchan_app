const express = require('express');
const router = express.Router();
const pool = require('../database');

// GET all bills for a specific month
router.get('/', async (req, res) => {
  const { month } = req.query;
  
  if (!month) {
    return res.status(400).json({ error: 'Month parameter (YYYY-MM) is required' });
  }

  try {
    const [rows] = await pool.query(`
      SELECT 
        mb.*,
        c.name,
        c.phone_number,
        c.customer_type
      FROM monthly_bills mb
      JOIN customers c ON mb.customer_id = c.customer_id
      WHERE mb.bill_month = ?
      ORDER BY c.name
    `, [month]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
});

// POST save monthly bills
router.post('/save-monthly-bills', async (req, res) => {
    const bills = req.body.bills;

    if (!bills || !Array.isArray(bills) || bills.length === 0) {
        return res.status(400).json({ message: 'No bills data provided.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        for (const bill of bills) {
            // Basic validation
            if (!bill.customer_id || !bill.bill_month || bill.bill_amount === undefined || bill.total_cans === undefined || bill.delivery_days === undefined) {
                console.error('Skipping bill due to missing data:', bill);
                throw new Error(`Missing required bill data for one or more entries (customer_id: ${bill.customer_id}, month: ${bill.bill_month}).`);
            }

            // MySQL INSERT ... ON DUPLICATE KEY UPDATE syntax
            const insertOrUpdateQuery = `
                INSERT INTO monthly_bills (
                    customer_id,
                    bill_month,
                    paid_status,
                    sent_status,
                    bill_amount,
                    created_at,
                    total_cans,
                    delivery_days
                ) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)
                ON DUPLICATE KEY UPDATE
                    paid_status = VALUES(paid_status),
                    sent_status = VALUES(sent_status),
                    bill_amount = VALUES(bill_amount),
                    total_cans = VALUES(total_cans),
                    delivery_days = VALUES(delivery_days),
                    created_at = NOW()
            `;
            const values = [
                bill.customer_id,
                bill.bill_month,
                bill.paid_status,
                bill.sent_status,
                bill.bill_amount,
                bill.total_cans,
                bill.delivery_days,
            ];

            await connection.execute(insertOrUpdateQuery, values);
        }

        await connection.commit();
        res.status(200).json({ message: 'Bills saved successfully!' });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Error saving bills to database:', error);
        res.status(500).json({ message: 'Failed to save bills to database.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// PUT update bill status
router.put('/:billId/status', async (req, res) => {
  const { billId } = req.params;
  const { paid_status, sent_status } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE monthly_bills SET paid_status = ?, sent_status = ? WHERE bill_id = ?',
      [paid_status, sent_status, billId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json({ message: 'Bill status updated successfully' });
  } catch (error) {
    console.error('Error updating bill status:', error);
    res.status(500).json({ error: 'Failed to update bill status' });
  }
});

// DELETE a bill
router.delete('/:billId', async (req, res) => {
  const { billId } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM monthly_bills WHERE bill_id = ?', [billId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({ error: 'Failed to delete bill' });
  }
});

module.exports = router;