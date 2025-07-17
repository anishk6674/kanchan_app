# 🚀 Kanchan Water CRM System

A comprehensive RO Water Shop CRM system with web dashboard and mobile delivery app.

## 📁 Project Structure

```
kanchan-water-crm/
├── src/                     # React web dashboard source
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Basic UI components (Button, Card, Input)
│   │   ├── Layout.tsx      # Main layout component
│   │   ├── Header.tsx      # Header component
│   │   └── Sidebar.tsx     # Sidebar navigation
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── Customers.tsx   # Customer management
│   │   ├── CustomerForm.tsx # Add/Edit customer form
│   │   ├── Orders.tsx      # Order management
│   │   ├── OrdersForm.tsx  # Add/Edit order form
│   │   ├── DailyUpdate.tsx # Daily delivery updates
│   │   ├── Billing.tsx     # Monthly billing
│   │   ├── Reports.tsx     # Reports and analytics
│   │   ├── CanManagement.tsx # Can inventory
│   │   ├── Settings.tsx    # System settings
│   │   └── Modal.tsx       # PDF generation modal
│   ├── context/            # React context providers
│   │   └── AppContext.tsx  # Global app state
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Shared types
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── server/                  # Node.js backend API
│   ├── routes/             # API route handlers
│   │   ├── customer.routes.js    # Customer CRUD operations
│   │   ├── dashboard.routes.js   # Dashboard statistics
│   │   ├── orders.routes.js      # Order management
│   │   ├── daily-update.routes.js # Daily updates & ledger
│   │   ├── settings.routes.js    # Price & settings management
│   │   └── bills.routes.js       # Monthly billing
│   ├── database.js         # Database connection & mock fallback
│   ├── server.js           # Main server file
│   ├── .env                # Environment variables
│   ├── .env.example        # Environment template
│   └── package.json        # Server dependencies
├── mobile-app/             # React Native mobile app
│   ├── delivery-app/       # Modern Expo app
│   │   ├── app/            # Expo Router pages
│   │   │   ├── _layout.tsx # Root layout
│   │   │   ├── index.tsx   # Home screen
│   │   │   ├── customers.tsx # Customer search
│   │   │   └── update/[customerId].tsx # Update screen
│   │   ├── src/
│   │   │   ├── services/   # API services
│   │   │   │   └── api.ts  # Mobile API client
│   │   │   └── theme/      # App theme
│   │   │       └── theme.ts
│   │   ├── package.json    # Mobile app dependencies
│   │   └── app.json        # Expo configuration
│   └── (legacy apps)       # Other mobile app versions
├── public/                 # Static assets
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── package.json            # Main project dependencies
└── README.md               # This file
```

## ✨ Features

### 🌐 Web Dashboard
- **Customer Management** - Add, edit, and manage customers (Shop/Monthly/Order types)
- **Order Tracking** - Complete order lifecycle management with collection tracking
- **Daily Updates** - Real-time delivery and collection status updates
- **Monthly Billing** - Automated bill generation with PDF export
- **Dashboard Analytics** - Real-time statistics and performance metrics
- **Settings Management** - Price configuration and system settings
- **PDF Generation** - Bills, receipts, and ledger reports

### 📱 Mobile Delivery App
- **Modern Expo App** - Built with latest Expo SDK 50
- **Customer Search** - Fast search by name or phone number
- **Real-time Updates** - Instant delivery status updates
- **Offline Ready** - Works offline with local data caching
- **Beautiful UI** - Material Design with haptic feedback
- **Auto Sync** - Automatic synchronization with web dashboard

### 🔧 Backend API
- **RESTful API** - Complete REST API with Express.js
- **Database Integration** - MySQL with automatic fallback to mock data
- **PDF Generation** - Server-side PDF creation with Puppeteer
- **Real-time Sync** - Live data synchronization between web and mobile
- **CORS Enabled** - Configured for mobile app access

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** ✅
- **MySQL** (optional - will use mock data if not available)
- **Expo CLI** (for mobile development only)

### 1. Install Dependencies
```bash
# Install main project dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 2. Database Setup (Optional)

**Option A: Use Mock Database (Recommended for Quick Start)**
The app automatically uses mock data if MySQL is not available. No setup required!

**Option B: Setup MySQL Database**
```bash
# 1. Install MySQL if you haven't already:
# Windows: Download from https://dev.mysql.com/downloads/mysql/
# Mac: brew install mysql
# Ubuntu: sudo apt install mysql-server

# 2. Start MySQL service:
# Windows: Start MySQL service from Services
# Mac: brew services start mysql
# Ubuntu: sudo systemctl start mysql

# 3. Create database and update credentials in server/.env
```

### 3. Environment Configuration
```bash
# Copy environment template
cp server/.env.example server/.env

# Edit server/.env with your database credentials (if using MySQL)
# Default mock database works without any changes
```

### 4. Start Development Servers

**Option A: Start Both Web and Server Together**
```bash
# From project root directory
npm run start
```

**Option B: Start Individually**
```bash
# Terminal 1: Start web development server
npm run dev

# Terminal 2: Start backend server
cd server
npm start
```

### 5. Access Applications
- **Web Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 📱 Mobile App Setup

### 1. Install Mobile Dependencies
```bash
cd mobile-app/delivery-app
npm install
```

### 2. Configure Network for Mobile App
```bash
# Find your computer's IP address:
# Windows:
ipconfig

# Mac/Linux:
ifconfig
```

### 3. Update Mobile API Configuration
```bash
# Edit mobile-app/delivery-app/src/services/api.ts
# Change line 6:
const BASE_URL = 'http://YOUR_IP_ADDRESS:5000';
```

### 4. Start Mobile App
```bash
# From mobile-app/delivery-app directory
npm start

# Then scan QR code with Expo Go app on your phone
```

## 🛠️ Development Commands

### Web Dashboard Commands
```bash
# Start development server (from project root)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend Server Commands
```bash
# Start server (from server/ directory)
cd server
npm start

# Start with auto-reload (development)
cd server
npm run dev
```

### Mobile App Commands
```bash
# Start Expo development server (from mobile-app/delivery-app/)
cd mobile-app/delivery-app
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

### Database Commands
```bash
# Test database connection (from server/ directory)
cd server
node -e "require('./database.js')"

# The app will automatically show if using MySQL or mock database
```

## 📦 Project Dependencies

### Main Project (package.json)
```bash
# Install main dependencies
npm install

# Key dependencies:
# - React 18 + TypeScript
# - Vite for development
# - Tailwind CSS for styling
# - React Router for navigation
# - PDF generation libraries
```

### Server Dependencies (server/package.json)
```bash
# Install server dependencies
cd server
npm install

# Key dependencies:
# - Express.js for API
# - MySQL2 for database
# - Puppeteer for PDF generation
# - CORS for mobile access
```

### Mobile Dependencies (mobile-app/delivery-app/package.json)
```bash
# Install mobile dependencies
cd mobile-app/delivery-app
npm install

# Key dependencies:
# - Expo SDK 50
# - React Native Paper for UI
# - Expo Router for navigation
# - AsyncStorage for offline data
```

## 🔧 Configuration Files

### Environment Variables (server/.env)
```bash
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_DATABASE=kanchan_water

# Server Configuration
SERVER_PORT=5000

# Environment
NODE_ENV=development
```

### Vite Configuration (vite.config.ts)
```bash
# Proxy configuration for API calls
# Automatically forwards /api/* to backend server
```

### Mobile Configuration (mobile-app/delivery-app/app.json)
```bash
# Expo configuration
# App name, icons, permissions, etc.
```

## 🗄️ Database Schema (Optional MySQL Setup)

If you want to use a real MySQL database instead of mock data:

### 1. Create Database
```sql
CREATE DATABASE kanchan_water;
USE kanchan_water;
```

### 2. Create Tables
```sql
-- Customers table
CREATE TABLE customers (
  customer_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(15) NOT NULL,
  alternate_number VARCHAR(15),
  address TEXT NOT NULL,
  customer_type ENUM('shop', 'monthly', 'order') NOT NULL,
  can_qty INT DEFAULT 0,
  advance_amount DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_date DATE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(15) NOT NULL,
  customer_address TEXT NOT NULL,
  can_qty INT NOT NULL,
  collected_qty INT DEFAULT 0,
  collected_date DATE NULL,
  delivery_amount DECIMAL(10,2) DEFAULT 0.00,
  delivery_date DATE NOT NULL,
  delivery_time TIME NOT NULL,
  order_status ENUM('pending', 'processing', 'delivered', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Daily updates table
CREATE TABLE daily_updates (
  update_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  date DATE NOT NULL,
  delivered_qty INT DEFAULT 0,
  collected_qty INT DEFAULT 0,
  holding_status INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  UNIQUE KEY unique_customer_date (customer_id, date)
);

-- Prices table
CREATE TABLE prices (
  price_id INT PRIMARY KEY AUTO_INCREMENT,
  shop_price DECIMAL(10,2) NOT NULL,
  monthly_price DECIMAL(10,2) NOT NULL,
  order_price DECIMAL(10,2) NOT NULL,
  effective_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Monthly bills table
CREATE TABLE monthly_bills (
  bill_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  bill_month VARCHAR(7) NOT NULL, -- YYYY-MM format
  paid_status BOOLEAN DEFAULT FALSE,
  sent_status BOOLEAN DEFAULT FALSE,
  bill_amount DECIMAL(10,2) NOT NULL,
  total_cans INT NOT NULL,
  delivery_days INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  UNIQUE KEY unique_customer_month (customer_id, bill_month)
);

-- Insert default prices
INSERT INTO prices (shop_price, monthly_price, order_price) 
VALUES (30.00, 25.00, 35.00);
```

## 🚀 Deployment

### Web Dashboard Deployment
```bash
# Build for production
npm run build

# Deploy dist/ folder to your hosting provider
# (Netlify, Vercel, Apache, Nginx, etc.)
```

### Server Deployment
```bash
# Deploy server/ folder to your server
# Update server/.env with production database credentials
# Start with: npm start
```

### Mobile App Deployment
```bash
cd mobile-app/delivery-app

# Build for Android
npx eas build --platform android

# Build for iOS
npx eas build --platform ios
```

## 🔍 API Endpoints

### Customer Management
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Order Management
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Daily Updates
- `GET /api/daily-updates?date=YYYY-MM-DD` - Get daily updates
- `POST /api/daily-updates` - Save daily update
- `GET /api/daily-updates/ledger` - Get customer ledger
- `GET /api/daily-updates/monthly-bills` - Get monthly bills

### Dashboard & Settings
- `GET /api/dashboard` - Get dashboard statistics
- `GET /api/settings/prices` - Get current prices
- `POST /api/settings/prices` - Update prices

### PDF Generation
- `POST /generate-bill-pdf` - Generate customer bill PDF
- `POST /generate-order-receipt` - Generate order receipt PDF

## 🆘 Troubleshooting

### Common Issues

**1. Preview Not Loading**
```bash
# Check if both servers are running:
# Terminal 1: npm run dev (should show Vite server on :5173)
# Terminal 2: cd server && npm start (should show server on :5000)
```

**2. Database Connection Error**
```bash
# The app uses mock data by default - this is normal!
# Look for: "⚠️ MySQL Database connection failed, using mock database"
# This means everything is working with sample data
```

**3. Mobile App Network Error**
```bash
# Update mobile-app/delivery-app/src/services/api.ts
# Replace 'YOUR_IP_ADDRESS' with your actual computer IP
# Test API from phone browser: http://YOUR_IP:5000/api/customers
```

**4. Port Already in Use**
```bash
# Kill processes on ports 5173 or 5000:
# Windows: netstat -ano | findstr :5173
# Mac/Linux: lsof -ti:5173 | xargs kill
```

**5. Dependencies Issues**
```bash
# Clear and reinstall:
rm -rf node_modules package-lock.json
npm install

# For server:
cd server
rm -rf node_modules package-lock.json
npm install
```

### Success Indicators
- ✅ Web dashboard loads at http://localhost:5173
- ✅ API responds at http://localhost:5000/health
- ✅ Mobile app connects and shows customer data
- ✅ No red errors in browser console
- ✅ Database connection status shown in server logs

## 📊 Performance Features

- **Fast Development** with Vite hot reloading
- **Optimized Builds** with code splitting
- **Real-time Sync** between web and mobile
- **Offline Support** in mobile app
- **Efficient Database** queries with proper indexing
- **PDF Generation** with server-side rendering

## 🔒 Security Features

- **Input Validation** on all forms
- **SQL Injection Prevention** with parameterized queries
- **CORS Configuration** for secure mobile access
- **Environment Variables** for sensitive data
- **Error Handling** without exposing internal details

This comprehensive CRM system provides everything needed for managing an RO water delivery business! 🚀