const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create a mock database for development when MySQL is not available
const mockDatabase = {
  query: async (sql, params) => {
    console.log('🔄 Mock Database Query:', sql);
    
    // Return mock data based on the query
    if (sql.includes('SELECT * FROM customers')) {
      return [[
        {
          customer_id: '1',
          name: 'Sample Customer',
          phone_number: '9876543210',
          address: '123 Sample Street',
          customer_type: 'shop',
          can_qty: 10,
          advance_amount: 500,
          created_at: new Date()
        }
      ]];
    }
    
    if (sql.includes('SELECT COUNT(*) AS count FROM customers WHERE customer_type = \'monthly\'')) {
      return [[{ count: 25 }]];
    }
    
    if (sql.includes('SELECT COUNT(*) AS count FROM customers WHERE customer_type = \'shop\'')) {
      return [[{ count: 15 }]];
    }
    
    if (sql.includes('SELECT * FROM prices WHERE is_active = 1')) {
      return [[{
        price_id: 1,
        shop_price: 30,
        monthly_price: 25,
        order_price: 35,
        effective_from: new Date(),
        is_active: 1
      }]];
    }
    
    if (sql.includes('SELECT * FROM orders')) {
      return [[
        {
          id: 1,
          order_date: new Date(),
          customer_name: 'Sample Customer',
          customer_phone: '9876543210',
          customer_address: '123 Sample Street',
          can_qty: 5,
          collected_qty: 0,
          delivery_amount: 50,
          delivery_date: new Date(),
          delivery_time: '10:00',
          order_status: 'pending',
          notes: 'Sample order'
        }
      ]];
    }
    
    if (sql.includes('daily_updates')) {
      return [[]]; // Empty array for daily updates
    }
    
    // For INSERT/UPDATE/DELETE operations
    if (sql.includes('INSERT') || sql.includes('UPDATE') || sql.includes('DELETE')) {
      return [{ insertId: Math.floor(Math.random() * 1000), affectedRows: 1 }];
    }
    
    return [[]];
  },
  
  execute: async (sql, params) => {
    return mockDatabase.query(sql, params);
  },
  
  getConnection: async () => {
    return {
      beginTransaction: async () => console.log('🔄 Mock: Begin Transaction'),
      commit: async () => console.log('✅ Mock: Commit Transaction'),
      rollback: async () => console.log('🔄 Mock: Rollback Transaction'),
      release: () => console.log('🔄 Mock: Release Connection'),
      execute: mockDatabase.execute,
      query: mockDatabase.query
    };
  }
};

let pool;
let usingMockDatabase = false;

try {
  // Try to create MySQL connection pool
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'kanchan_water',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
  });

  // Test the connection
  pool.getConnection()
    .then(connection => {
      console.log('✅ MySQL Database connected successfully');
      connection.release();
      usingMockDatabase = false;
    })
    .catch(err => {
      console.warn('⚠️  MySQL Database connection failed, using mock database for development');
      console.warn('   Error:', err.message);
      console.warn('   To fix: Start MySQL server or update connection settings in server/.env');
      usingMockDatabase = true;
      pool = mockDatabase;
    });

} catch (err) {
  console.warn('⚠️  MySQL setup failed, using mock database for development');
  console.warn('   Error:', err.message);
  usingMockDatabase = true;
  pool = mockDatabase;
}

// Export pool with fallback to mock database
module.exports = pool || mockDatabase;