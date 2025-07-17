# 🚀 Kanchan Water CRM - Monorepo

A modern, scalable RO Water Shop CRM system with web dashboard and mobile delivery app built as a monorepo.

## 📁 Project Structure

```
kanchan-water-crm/
├── apps/
│   ├── web/                 # React web dashboard
│   ├── server/              # Node.js backend API
│   └── mobile/              # Expo React Native app
├── packages/
│   ├── shared/              # Shared API client & config
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Shared utility functions
└── package.json             # Root package.json with workspaces
```

## ✨ Features

### 🌐 Web Dashboard
- Customer management (Shop/Monthly/Order types)
- Order tracking and management
- Daily delivery updates
- Monthly billing with PDF generation
- Real-time dashboard with statistics
- Settings and pricing configuration

### 📱 Mobile Delivery App
- Modern Expo-based React Native app
- Customer search and selection
- Real-time daily status updates
- Offline-ready with local caching
- Beautiful UI with haptic feedback
- Instant sync with web dashboard

### 🔧 Backend API
- RESTful API with Express.js
- MySQL database integration
- PDF generation for bills and receipts
- Real-time data synchronization
- CORS enabled for mobile access

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ✅
- MySQL database (optional - will use mock data if not available)
- Expo CLI for mobile development (for mobile app only)

### 1. Install Dependencies
```bash
# Install all dependencies for all apps
npm run install:all
```

### 2. Database Setup (Optional)

**Option A: Use Mock Database (Recommended for Quick Start)**
The app will automatically use mock data if MySQL is not available. No setup required!

**Option B: Setup MySQL Database**
```bash
# Create MySQL database and tables
# Update apps/server/.env with your database credentials

# Install MySQL if you haven't already:
# Windows: Download from https://dev.mysql.com/downloads/mysql/
# Mac: brew install mysql
# Ubuntu: sudo apt install mysql-server

# Start MySQL service:
# Windows: Start MySQL service from Services
# Mac: brew services start mysql
# Ubuntu: sudo systemctl start mysql
```

### 3. Environment Configuration
```bash
# Copy and configure environment files
cp server/.env.example server/.env
# Update server/.env with your MySQL credentials if using real database
```

### 4. Start Development
```bash
# Start web + server
npm run dev

# Start mobile app (in separate terminal)
npm run dev:mobile
```

## 📱 Mobile App Setup

### Network Configuration
1. Find your computer's IP address:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. Update mobile API configuration:
   ```typescript
   // apps/mobile/src/services/api.ts
   const BASE_URL = 'http://YOUR_IP_ADDRESS:5000';
   ```

3. Install Expo Go app on your phone and scan QR code

## 🛠️ Development Scripts

```bash
# Development
npm run dev              # Start web + server
npm run dev:web          # Start web only
npm run dev:server       # Start server only
npm run dev:mobile       # Start mobile app

# Building
npm run build            # Build web + server
npm run build:web        # Build web only
npm run build:server     # Build server only

# Production
npm start                # Start production servers

# Utilities
npm run clean            # Clean all node_modules
npm run lint             # Lint all apps
npm run test             # Test all apps
```

## 📦 Package Management

This project uses npm workspaces for efficient dependency management:

- **Shared dependencies** are hoisted to the root
- **App-specific dependencies** stay in their respective folders
- **Internal packages** are linked automatically

### Adding Dependencies

```bash
# Add to specific app
npm install package-name --workspace=@kanchan/web
npm install package-name --workspace=@kanchan/server
npm install package-name --workspace=@kanchan/mobile

# Add to shared package
npm install package-name --workspace=@kanchan/shared
```

## 🏗️ Architecture Benefits

### ✅ Monorepo Advantages
- **Shared code** between web, server, and mobile
- **Consistent types** across all applications
- **Single dependency management**
- **Unified build and deployment**
- **Better code reuse** and maintainability

### 📱 Mobile App Benefits
- **Latest Expo SDK** with modern features
- **File-based routing** with Expo Router
- **Real-time sync** with web dashboard
- **Offline capabilities** with local storage
- **Beautiful UI** with Material Design
- **Haptic feedback** for better UX

### 🌐 Web Dashboard Benefits
- **Modern React** with TypeScript
- **Tailwind CSS** for styling
- **Real-time updates** from mobile app
- **PDF generation** for bills
- **Responsive design** for all devices

## 🔧 Technology Stack

### Frontend (Web)
- React 18 + TypeScript
- Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- Lucide React for icons

### Backend (Server)
- Node.js + Express
- MySQL with mysql2
- Puppeteer for PDF generation
- CORS for mobile access
- dotenv for configuration

### Mobile (App)
- Expo SDK 50
- React Native + TypeScript
- Expo Router for navigation
- React Native Paper for UI
- AsyncStorage for offline data

### Shared Packages
- TypeScript for type safety
- Axios for HTTP requests
- Shared utilities and constants

## 🚀 Deployment

### Web Dashboard
```bash
npm run build:web
# Deploy apps/web/dist to your hosting provider
```

### Server
```bash
npm run build:server
# Deploy apps/server to your server
```

### Mobile App
```bash
cd apps/mobile
npx eas build --platform android
npx eas build --platform ios
```

## 📊 Performance Benefits

- **Reduced bundle size** through shared dependencies
- **Faster development** with hot reloading
- **Better caching** with monorepo structure
- **Optimized builds** for each platform
- **Real-time sync** between web and mobile

## 🔒 Security Features

- Input validation on all forms
- SQL injection prevention
- CORS configuration for mobile
- Environment variable management
- Secure API communication

This optimized structure reduces your project size significantly while maintaining all functionality and improving development experience! 🎉