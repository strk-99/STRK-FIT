# STRK-FIT Mobile 📱

**Cross-Platform Fitness App** - Web, iOS & Android

---

## ✅ YOUR APP IS NOW MOBILE-READY!

STRK-FIT now works as:
- 🌐 **Web App** - Browser-based PWA
- 🤖 **Android App** - Native Android via Capacitor
- 🍎 **iOS App** - Native iPhone/iPad via Capacitor

---

## 🚀 Quick Commands

### Development
```bash
# Web development
npm run dev                    # Start web dev server (http://localhost:5173)

# Mobile development
npm run mobile:android         # Open in Android Studio
npm run mobile:ios             # Open in Xcode (Mac only)
npm run mobile:sync            # Build web + sync to mobile platforms
```

### Building
```bash
# Production builds
npm run build                  # Build web app
npm run mobile:build:android   # Build Android APK
npm run mobile:build:ios       # Build iOS app
```

---

## 📱 Test on Mobile NOW

### Android (All Platforms)

1. **Download Android Studio** (if not installed):
   https://developer.android.com/studio

2. **Open the project**:
   ```bash
   npm run mobile:android
   ```

3. **Click ▶️ Run** in Android Studio
   - App will launch in emulator or connected device

### iOS (Mac Only)

1. **Install Xcode** from Mac App Store

2. **Install CocoaPods**:
   ```bash
   sudo gem install cocoapods
   cd ios/App && pod install && cd ../..
   ```

3. **Open the project**:
   ```bash
   npm run mobile:ios
   ```

4. **Click ▶️ Run** in Xcode
   - App will launch in iOS Simulator

---

## 📦 What You Need Next

### 1. Create App Icons

Create a 1024x1024 PNG icon with:
- Your STRK-FIT logo
- Simple, recognizable design
- Works at small sizes

Save as `resources/icon.png`, then run:
```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate
```

### 2. Take Screenshots

For app store submission, capture:
- Login screen
- Daily tracking view
- Calendar/history view
- Profile screen
- Weekly review

### 3. Register Developer Accounts

**Google Play**:
- Cost: $25 (one-time)
- URL: https://play.google.com/console

**Apple App Store**:
- Cost: $99/year
- URL: https://developer.apple.com

---

## 📚 Full Documentation

- **Mobile Guide**: [MOBILE_DEPLOYMENT_GUIDE.md](MOBILE_DEPLOYMENT_GUIDE.md) - Complete mobile setup
- **App Store Prep**: [APP_STORE_READINESS.md](APP_STORE_READINESS.md) - Legal requirements
- **Main README**: [README.md](README.md) - Full project documentation

---

## 🎯 Key Features on Mobile

✅ **Native Notifications** - Push & local notifications
✅ **Offline Support** - Works without internet
✅ **Fast Performance** - Native speed
✅ **Platform Integration** - Status bar, splash screen
✅ **Secure** - Native storage and encryption

---

## 🔧 Project Structure

```
fitness-app/
├── android/           # Android native project (Gradle)
├── ios/              # iOS native project (Xcode)
├── dist/             # Web build (synced to mobile)
├── src/              # React source code
├── capacitor.config.ts  # Mobile configuration
└── package.json      # Mobile scripts added
```

---

## ⚡ Development Workflow

1. **Edit React code** in `/src`
2. **Test in browser**: `npm run dev`
3. **Sync to mobile**: `npm run mobile:sync`
4. **Test on device**: Run from Android Studio/Xcode

---

## 🎨 Customization

### App Name
Edit `capacitor.config.ts`:
```typescript
appName: 'STRK-FIT'  // Change this
```

### App ID (Package Name)
```typescript
appId: 'com.strkfit.app'  // Change this (reverse domain)
```

### Theme Colors
- **Background**: `#020617` (slate-950)
- **Primary**: `#06b6d4` (cyan-400)
- **Secondary**: `#10b981` (emerald-500)

---

## 📞 Need Help?

**Can't build?**
```bash
npm run build  # Fix TypeScript errors first
npm run mobile:sync  # Then sync
```

**Android Studio won't open?**
- Make sure Android Studio is installed
- Check that `ANDROID_HOME` is set

**Xcode issues?**
- Mac only (iOS development requires macOS)
- Install Xcode from App Store
- Run `pod install` in `ios/App/`

**More questions?**
- Email: technical@strkfit.com
- See [MOBILE_DEPLOYMENT_GUIDE.md](MOBILE_DEPLOYMENT_GUIDE.md)

---

## ✨ What's Included

### Legal Documents (Ready for App Stores)
- ✅ Privacy Policy
- ✅ Terms & Conditions
- ✅ Data Deletion Policy
- ✅ Health Disclaimer
- ✅ Support Contact

### Native Features
- ✅ Push Notifications
- ✅ Local Notifications
- ✅ Status Bar theming
- ✅ Splash Screen
- ✅ App lifecycle management

### Backend Ready
- ✅ Express API server
- ✅ SQLite database
- ✅ JWT authentication
- ✅ User management

---

## 🚀 Ready to Launch?

See [MOBILE_DEPLOYMENT_GUIDE.md](MOBILE_DEPLOYMENT_GUIDE.md) for:
- Creating release builds
- Signing apps
- Submitting to app stores
- Handling reviews

---

**Status**: ✅ Mobile-Ready
**Platforms**: Web, iOS, Android
**Version**: 1.0.0
**Last Updated**: December 28, 2025
