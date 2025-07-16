const express = require('express');
const router = express.Router();
const pool = require('../database');

// GET dashboard statistics
router.get('/', async (req, res) => {
  try {
    const [
      [todayOrders],
      [monthlyCustomers],
      [shopCustomers],
      [cansDeliveredToday],
      [cansCollectedToday],
      [pendingCans],
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) AS count FROM orders WHERE DATE(order_date) = CURDATE()"),
      pool.query("SELECT COUNT(*) AS count FROM customers WHERE customer_type = 'monthly'"),
      pool.query("SELECT COUNT(*) AS count FROM customers WHERE customer_type = 'shop'"),
      pool.query("SELECT IFNULL(SUM(delivered_qty), 0) AS count FROM daily_updates WHERE DATE(date) = CURDATE()"),
      pool.query("SELECT IFNULL(SUM(collected_qty), 0) AS count FROM daily_updates WHERE DATE(date) = CURDATE()"),
      pool.query("SELECT IFNULL(SUM(holding_status), 0) AS count FROM (SELECT customer_id, holding_status FROM daily_updates WHERE date = (SELECT MAX(date) FROM daily_updates WHERE customer_id = daily_updates.customer_id) GROUP BY customer_id) AS latest_status"),
    ]);

    const stats = {
      OrdersTotal: todayOrders[0].count,
      totalMonthlyCustomers: monthlyCustomers[0].count,
      shopCustomersTotal: shopCustomers[0].count,
      cansDeliveredToday: cansDeliveredToday[0].count,
      cansCollectedToday: cansCollectedToday[0].count,
      pendingCansTotal: pendingCans[0].count,
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

module.exports = router;