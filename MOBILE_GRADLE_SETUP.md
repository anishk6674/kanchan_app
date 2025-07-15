# 📱 Mobile App Gradle Setup & Troubleshooting Guide

## Step-by-Step Setup Instructions

### 1. Prerequisites Check
```bash
# Check Java installation
java -version
# Should show Java 11 or higher

# Check Android SDK
echo $ANDROID_HOME
# Should point to your Android SDK directory
```

### 2. Environment Variables Setup

**Windows:**
```cmd
# Add to System Environment Variables
ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
JAVA_HOME=C:\Program Files\Java\jdk-11.0.x

# Add to PATH
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%JAVA_HOME%\bin
```

**Mac/Linux:**
```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$JAVA_HOME/bin

# Reload shell
source ~/.bashrc  # or source ~/.zshrc
```

### 3. Clean and Setup Mobile App

```bash
# Navigate to mobile app directory
cd mobile-app

# Clean previous builds
rm -rf node_modules
rm -rf android/build
rm -rf android/app/build

# Install dependencies
npm install

# Clean and rebuild Gradle
cd android
./gradlew clean
cd ..
```

### 4. Android Studio Setup

1. **Open Android Studio**
2. **SDK Manager Setup:**
   - Go to Tools → SDK Manager
   - Install Android SDK Platform 33
   - Install Android SDK Build-Tools 33.0.0
   - Install Android SDK Platform-Tools

3. **AVD Manager Setup:**
   - Go to Tools → AVD Manager
   - Create Virtual Device
   - Choose Pixel 4 or similar
   - Select API Level 33 (Android 13)
   - Finish setup

### 5. Test Gradle Setup

```bash
# In mobile-app directory
cd android
./gradlew --version

# Should show Gradle version 8.0.2
# If this fails, Gradle wrapper is not properly configured
```

### 6. Build and Run

```bash
# In mobile-app directory
# Start Metro bundler
npm start

# In another terminal, run Android app
npm run android
```

## Common Issues & Solutions

### Issue 1: "Gradle command not found"
```bash
# Solution: Make gradlew executable
cd mobile-app/android
chmod +x gradlew

# Test
./gradlew --version
```

### Issue 2: "ANDROID_HOME not set"
```bash
# Find Android SDK location
# Usually at:
# Windows: C:\Users\%USERNAME%\AppData\Local\Android\Sdk
# Mac: ~/Library/Android/sdk
# Linux: ~/Android/Sdk

# Set environment variable
export ANDROID_HOME=/path/to/your/android/sdk
```

### Issue 3: "Java version incompatible"
```bash
# Check Java version
java -version

# Install Java 11 if needed
# Ubuntu/Debian:
sudo apt install openjdk-11-jdk

# Mac (using Homebrew):
brew install openjdk@11

# Windows: Download from Oracle or OpenJDK website
```

### Issue 4: "Gradle build failed"
```bash
# Clean everything
cd mobile-app
rm -rf node_modules
rm -rf android/build
rm -rf android/app/build

# Reinstall
npm install

# Clean Gradle
cd android
./gradlew clean
./gradlew build
cd ..
```

### Issue 5: "Metro bundler connection failed"
```bash
# Reset Metro cache
npx react-native start --reset-cache

# If still failing, check network configuration
# Make sure your IP is correctly set in src/services/api.ts
```

## Verification Commands

```bash
# 1. Check environment
echo $ANDROID_HOME
echo $JAVA_HOME
java -version

# 2. Test Gradle
cd mobile-app/android
./gradlew --version
./gradlew tasks

# 3. Test React Native
cd ..
npx react-native doctor

# 4. Test build
npm run android
```

## Network Configuration for Mobile App

### Update API Configuration
```bash
# Edit mobile-app/src/services/api.ts
# Find your computer's IP address:

# Windows:
ipconfig

# Mac/Linux:
ifconfig

# Update BASE_URL to your IP:
const BASE_URL = 'http://YOUR_IP_ADDRESS:5000';
```

### Test Network Connection
```bash
# From your phone's browser, test:
http://YOUR_IP_ADDRESS:5000/api/customers

# Should return JSON data
```

## Complete Test Sequence

```bash
# 1. Start main server (in project root)
npm run start

# 2. Verify server is accessible
curl http://localhost:5000/api/customers

# 3. Test from network
curl http://YOUR_IP:5000/api/customers

# 4. Start mobile app (in mobile-app directory)
npm start

# 5. Run on Android (in another terminal)
npm run android

# 6. Test mobile app functionality:
# - App should open
# - Search customers should work
# - Daily updates should save
# - Data should sync to web dashboard
```

## Success Indicators

✅ **Gradle Setup Complete When:**
- `./gradlew --version` shows Gradle 8.0.2
- `npm run android` builds successfully
- App installs on device/emulator
- No Gradle-related errors in console

✅ **Mobile App Working When:**
- App opens to home screen
- Customer search loads data
- Daily updates save successfully
- Data syncs to web dashboard
- No network errors

## Troubleshooting Checklist

- [ ] Java 11+ installed and JAVA_HOME set
- [ ] Android SDK installed and ANDROID_HOME set
- [ ] Gradle wrapper executable (chmod +x)
- [ ] Node modules installed
- [ ] Android build tools installed
- [ ] Device/emulator connected
- [ ] Network IP correctly configured
- [ ] Main server running
- [ ] Firewall allows connections

This setup will ensure your mobile app builds and runs correctly with proper Gradle configuration! 🚀