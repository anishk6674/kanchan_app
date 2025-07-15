# 📱 Kanchan Delivery Mobile App (Expo)

A React Native mobile application built with Expo for delivery personnel to update daily customer status in real-time.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your phone (from App Store/Play Store)

### Setup Instructions

1. **Install Dependencies:**
   ```bash
   cd mobile-app
   npm install
   ```

2. **Configure Your Network:**
   - Find your computer's IP address:
     - Windows: `ipconfig` → IPv4 Address
     - Mac/Linux: `ifconfig` → inet address
   - Update `src/services/api.ts`:
     ```typescript
     const BASE_URL = 'http://YOUR_IP_ADDRESS:5000';
     ```

3. **Start Your Main Server:**
   ```bash
   # In your main project directory
   npm run start
   ```

4. **Run the Mobile App:**
   ```bash
   # In mobile-app directory
   npm start
   ```

5. **Open on Your Device:**
   - Scan the QR code with Expo Go app
   - Or press 'a' for Android emulator
   - Or press 'i' for iOS simulator

## ✨ Features

- 🔍 **Customer Search**: Search customers by name or phone
- 📱 **Real-time Updates**: Update delivery status instantly
- 🔄 **Auto Sync**: Data syncs with main system automatically
- 📊 **Status Tracking**: View current holding status
- 📝 **Notes**: Add delivery notes
- 🎨 **Modern UI**: Clean Material Design interface

## 📱 Usage

### For Delivery Personnel:

1. **Search Customers:**
   - Tap "Search Customers" on home screen
   - Use search bar to find customers
   - Tap on customer card to update

2. **Update Status:**
   - Enter delivered quantity
   - Enter collected quantity (returned cans)
   - Add optional notes
   - Tap "Save Update"

3. **View Results:**
   - Success message confirms save
   - Data appears in web dashboard immediately

## 🔧 Development

### Available Scripts:
- `npm start` - Start Expo development server
- `npm run android` - Open on Android
- `npm run ios` - Open on iOS
- `npm run web` - Open in web browser

### Project Structure:
```
mobile-app/
├── src/
│   ├── screens/          # App screens
│   ├── services/         # API services
│   └── theme/           # App theme
├── App.tsx              # Main app component
└── app.json            # Expo configuration
```

## 🌐 Network Configuration

### Testing Connection:
```bash
# Test API from phone browser:
http://YOUR_IP:5000/api/customers

# Should return JSON customer data
```

### Troubleshooting:
- Ensure both devices on same WiFi
- Check firewall settings
- Verify server is running
- Test API endpoint manually

## 📦 Building for Production

### Development Build:
```bash
expo build:android
expo build:ios
```

### EAS Build (Recommended):
```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## 🔒 Security Notes

- Uses HTTP for local network (fine for development)
- For production: implement HTTPS and authentication
- Consider VPN for remote access
- Add user login for delivery personnel

## 🆘 Support

### Common Issues:

1. **Network Error:**
   - Check WiFi connection
   - Verify IP address in api.ts
   - Test server accessibility

2. **Expo Go Issues:**
   - Clear Expo Go cache
   - Restart development server
   - Check Expo CLI version

3. **Build Errors:**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules: `rm -rf node_modules && npm install`
   - Update Expo: `expo upgrade`

### Success Indicators:
- ✅ App loads customer list
- ✅ Search functionality works
- ✅ Updates save successfully
- ✅ Data syncs to web dashboard
- ✅ No network errors

This Expo-based mobile app eliminates Gradle issues and provides a smooth development experience! 🎉