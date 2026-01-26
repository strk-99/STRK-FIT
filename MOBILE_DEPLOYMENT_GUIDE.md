# STRK-FIT Mobile Deployment Guide
**Version**: 1.0
**Last Updated**: December 28, 2025
**Platform**: Capacitor 8.0 (iOS & Android)

---

## 🎉 STATUS: MOBILE-READY!

Your STRK-FIT app is now configured to run as both a **web app** AND **native mobile app** (iOS & Android)!

---

## 📱 WHAT WAS DONE

### ✅ Installed Capacitor
- Core Capacitor framework
- iOS platform support
- Android platform support
- Native plugins:
  - Push Notifications
  - Local Notifications
  - Status Bar
  - Splash Screen
  - App (lifecycle management)

### ✅ Created Native Projects
- **Android**: `/android` directory with Gradle project
- **iOS**: `/ios` directory with Xcode project
- **Config**: `capacitor.config.ts` with app settings

### ✅ Added Build Scripts
New npm commands for mobile development:
```bash
npm run mobile:sync        # Build web + sync to mobile
npm run mobile:android     # Open Android Studio
npm run mobile:ios         # Open Xcode
npm run mobile:build:android  # Build Android APK
npm run mobile:build:ios   # Build iOS app
```

---

## 🚀 QUICK START

### Test on Android (Linux/Windows)

1. **Install Android Studio**:
   ```bash
   # Download from: https://developer.android.com/studio
   ```

2. **Open the project**:
   ```bash
   npm run mobile:android
   ```

3. **Run on emulator or device**:
   - Android Studio will open
   - Click ▶️ Run button
   - Select emulator or connected device

### Test on iOS (Mac Only)

1. **Install Xcode**:
   ```bash
   # From Mac App Store (free)
   # Or: https://developer.apple.com/xcode/
   ```

2. **Install CocoaPods**:
   ```bash
   sudo gem install cocoapods
   cd ios/App
   pod install
   cd ../..
   ```

3. **Open the project**:
   ```bash
   npm run mobile:ios
   ```

4. **Run on simulator**:
   - Xcode will open
   - Select iPhone simulator
   - Click ▶️ Run button

---

## 📦 APP ICONS & SPLASH SCREENS

### Required Assets

You need to create these image assets:

#### **App Icon** (Required)
- **Android**:
  - 512x512 PNG (for Play Store)
  - Adaptive icon layers (foreground + background)
- **iOS**:
  - 1024x1024 PNG (for App Store)

#### **Splash Screen** (Optional but recommended)
- 2732x2732 PNG (universal size)
- Background color: `#020617` (slate-950)

### Quick Icon Generation

**Option 1: Use Capacitor Assets Generator**
```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate --iconBackgroundColor '#020617'
```

**Option 2: Manual Creation**

1. Create your icon (1024x1024):
   - Use Figma, Photoshop, or Canva
   - Simple design with STRK-FIT logo
   - Save as `resources/icon.png`

2. Create splash screen (2732x2732):
   - Dark background (#020617)
   - Centered logo
   - Save as `resources/splash.png`

3. Generate all sizes:
   ```bash
   npx @capacitor/assets generate
   ```

### Icon Design Tips
- **Simple**: Works at small sizes
- **High contrast**: Stands out on home screen
- **No text**: Logo/symbol only
- **Square**: Will be masked to rounded corners
- **Consistent**: Matches your brand colors (cyan/emerald)

---

## 🔧 DEVELOPMENT WORKFLOW

### Daily Development

1. **Make changes** to React code
2. **Test in browser**:
   ```bash
   npm run dev
   ```
3. **Test on mobile** (when ready):
   ```bash
   npm run mobile:sync
   # Then run from Android Studio/Xcode
   ```

### Live Reload (Android)

For faster development on Android:
```bash
# In capacitor.config.ts, add:
server: {
  url: 'http://YOUR_IP:5173',
  cleartext: true
}

# Then run vite dev server
npm run dev

# Mobile app will reload automatically!
```

---

## 📱 TESTING

### Browser Testing (Web Version)
```bash
npm run dev
# Open http://localhost:5173
```

### Android Emulator
1. Open Android Studio
2. Tools → Device Manager
3. Create Virtual Device
4. Run app on emulator

### iOS Simulator (Mac)
1. Open Xcode
2. Select simulator (iPhone 15 Pro recommended)
3. Click Run

### Real Devices

**Android**:
1. Enable Developer Mode on phone
2. Enable USB Debugging
3. Connect via USB
4. Select device in Android Studio

**iOS**:
1. Need Apple Developer Account ($99/year)
2. Add device UDID to provisioning profile
3. Connect via USB
4. Select device in Xcode

---

## 🏗️ BUILDING FOR PRODUCTION

### Android APK/AAB

#### Debug Build (for testing)
```bash
npm run mobile:build:android
# APK location: android/app/build/outputs/apk/release/app-release.apk
```

#### Release Build (for Play Store)

1. **Create keystore** (one-time):
   ```bash
   cd android
   keytool -genkey -v -keystore strk-fit.keystore -alias strk-fit -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure signing** in `android/app/build.gradle`:
   ```gradle
   signingConfigs {
       release {
           storeFile file("../strk-fit.keystore")
           storePassword "YOUR_PASSWORD"
           keyAlias "strk-fit"
           keyPassword "YOUR_PASSWORD"
       }
   }
   ```

3. **Build AAB** (Android App Bundle):
   ```bash
   cd android
   ./gradlew bundleRelease
   # AAB location: app/build/outputs/bundle/release/app-release.aab
   ```

### iOS IPA

#### Debug Build
- Build in Xcode
- Product → Archive
- Distribute App → Development

#### Release Build (for App Store)

1. **Apple Developer Account** required ($99/year)

2. **Configure app in Xcode**:
   - Set Bundle ID: `com.strkfit.app`
   - Set Version: `1.0`
   - Set Build number: `1`

3. **Archive**:
   - Product → Archive
   - Distribute App → App Store Connect
   - Upload

---

## 🔐 SIGNING & CERTIFICATES

### Android Signing

**For Play Store**:
- Need signing keystore (created above)
- Keep keystore file SAFE (backup it!)
- Store passwords securely

**Important**:
- Losing keystore = can't update app ever
- Backup to multiple secure locations

### iOS Signing

**Requirements**:
1. Apple Developer Account ($99/year)
2. Certificates (iOS Distribution)
3. Provisioning Profiles
4. App ID registration

**Setup in Xcode**:
1. Open project in Xcode
2. Select target → Signing & Capabilities
3. Enable "Automatically manage signing"
4. Select your team

---

## 📤 SUBMISSION TO APP STORES

### Google Play Store

#### Prerequisites
- Google Play Console account ($25 one-time)
- Signed AAB file
- App assets (icons, screenshots, etc.)

#### Steps

1. **Create App** in Play Console
2. **Fill Store Listing**:
   - App name: STRK-FIT
   - Short description: (80 chars)
   - Full description: (See APP_STORE_READINESS.md)
   - Screenshots: 2-8 images
   - Feature graphic: 1024x500
   - App icon: 512x512

3. **Data Safety** form:
   - Fill out data collection questions
   - Reference our Privacy Policy

4. **Content Rating**:
   - Complete IARC questionnaire
   - Should get E/Everyone rating

5. **Upload AAB**:
   - Create release → Production
   - Upload app-release.aab
   - Add release notes

6. **Submit for Review**
   - Review takes 1-7 days

### Apple App Store

#### Prerequisites
- Apple Developer Account ($99/year)
- Signed IPA file
- App Store Connect access

#### Steps

1. **Create App** in App Store Connect
2. **App Information**:
   - Name: STRK-FIT
   - Bundle ID: com.strkfit.app
   - SKU: com.strkfit.app.001
   - Categories: Health & Fitness

3. **Pricing**: Free (or set price)

4. **App Privacy**:
   - Fill privacy nutrition labels
   - Reference our Privacy Policy

5. **Build Upload**:
   - Upload via Xcode Archive
   - Wait for processing (15-60 mins)

6. **Screenshots**:
   - iPhone 6.7" (required)
   - iPhone 6.5" (required)
   - iPhone 5.5" (required)
   - iPad Pro 12.9" (optional)

7. **App Review Information**:
   - Demo account (if needed)
   - Contact info
   - Notes for reviewer

8. **Submit for Review**:
   - Review takes 24-48 hours typically

---

## 🎨 SCREENSHOT GUIDE

### What to Screenshot

Capture these screens for app stores:

1. **Login/Onboarding** - First impression
2. **Daily Card** - Main tracking screen
3. **Calendar View** - Month overview
4. **Weekly Review** - Progress charts
5. **Profile** - User stats and levels
6. **Resources** - Helpful content

### Screenshot Sizes

**Android** (min 2, max 8):
- 16:9 aspect ratio
- At least 320px
- Recommended: 1080x1920

**iOS** (multiple sizes required):
- 6.7" iPhone: 1290x2796
- 6.5" iPhone: 1242x2688
- 5.5" iPhone: 1242x2208
- 12.9" iPad: 2048x2732

### Tools
- **Android**: Android Studio built-in screenshot
- **iOS**: Xcode Simulator → File → New Screenshot
- **Both**: https://www.screely.com/ (add frame)

---

## 🔔 PUSH NOTIFICATIONS SETUP

### Firebase (Android)

1. **Create Firebase Project**:
   - Go to https://console.firebase.google.com/
   - Create new project
   - Add Android app

2. **Download google-services.json**:
   - Place in `android/app/`

3. **Configure Android**:
   ```gradle
   // android/build.gradle
   dependencies {
       classpath 'com.google.gms:google-services:4.3.15'
   }

   // android/app/build.gradle
   apply plugin: 'com.google.gms.google-services'
   ```

### Apple Push Notifications (iOS)

1. **Enable in Xcode**:
   - Target → Signing & Capabilities
   - Click + → Push Notifications

2. **Create APNs Key**:
   - Apple Developer Portal
   - Certificates, IDs & Profiles
   - Keys → + (Create new)
   - Download .p8 file

3. **Configure in Firebase**:
   - Upload APNs key to Firebase
   - For Cloud Messaging

---

## 🐛 TROUBLESHOOTING

### Build Errors

**TypeScript errors**:
```bash
npm run build
# Fix any errors before mobile:sync
```

**Gradle errors** (Android):
```bash
cd android
./gradlew clean
cd ..
npm run mobile:sync
```

**Pod errors** (iOS):
```bash
cd ios/App
pod deintegrate
pod install
cd ../..
```

### Runtime Issues

**White screen on mobile**:
- Check browser console in dev tools
- Verify API URLs are accessible
- Check capacitor.config.ts

**Notifications not working**:
- Check permissions granted
- Verify Firebase/APNs setup
- Test with native plugins

### Common Fixes

**"Cannot find module"**:
```bash
npm install
npm run mobile:sync
```

**"Build failed"**:
```bash
npm run build
# Fix TypeScript errors first
```

**"No devices found"**:
- Enable Developer Mode (Android)
- Trust computer (iOS)
- Check USB connection

---

## 📚 HELPFUL RESOURCES

### Documentation
- **Capacitor**: https://capacitorjs.com/docs
- **Android**: https://developer.android.com
- **iOS**: https://developer.apple.com

### Communities
- Capacitor Discord: https://discord.gg/UPYYRhtyzp
- Stack Overflow: Tag with `capacitor`

### Tools
- **Android Studio**: https://developer.android.com/studio
- **Xcode**: https://developer.apple.com/xcode/
- **Fastlane**: https://fastlane.tools/ (for CI/CD)

---

## ✅ DEPLOYMENT CHECKLIST

### Before First Release

#### Code
- [ ] All TypeScript errors fixed
- [ ] App builds successfully (`npm run build`)
- [ ] Tested on web browser
- [ ] Tested on Android emulator
- [ ] Tested on iOS simulator
- [ ] Tested on real devices

#### Assets
- [ ] App icon created (1024x1024)
- [ ] Splash screen created
- [ ] Screenshots taken (all required sizes)
- [ ] Feature graphic created (Android)

#### Legal
- [ ] Privacy Policy published
- [ ] Terms & Conditions published
- [ ] Data Deletion Policy published
- [ ] Health Disclaimer published
- [ ] Support contact added

#### Store Listings
- [ ] App name finalized
- [ ] Description written
- [ ] Keywords selected
- [ ] Screenshots uploaded
- [ ] Privacy forms completed
- [ ] Age rating obtained

#### Accounts
- [ ] Google Play Console account ($25)
- [ ] Apple Developer account ($99/year)
- [ ] Firebase project created
- [ ] APNs certificates configured

#### Builds
- [ ] Android AAB signed
- [ ] iOS IPA archived
- [ ] Version numbers set
- [ ] Release notes written

---

## 🎯 NEXT STEPS

1. **Create App Icons**:
   ```bash
   # Design 1024x1024 icon
   # Place in resources/icon.png
   npx @capacitor/assets generate
   ```

2. **Test on Emulator**:
   ```bash
   npm run mobile:android
   # or
   npm run mobile:ios
   ```

3. **Test on Real Device**:
   - Connect device
   - Run from Android Studio/Xcode

4. **Take Screenshots**:
   - Capture all required screens
   - Edit for app store submission

5. **Register Developer Accounts**:
   - Google Play Console
   - Apple Developer Program

6. **Submit Apps**:
   - Follow submission guides above
   - Wait for review approval
   - Launch! 🚀

---

## 💡 PRO TIPS

### Development
- Use Chrome DevTools for mobile debugging
- Test on lowest-end device you support
- Check app size (keep under 50MB ideally)

### Performance
- Optimize images before bundling
- Use lazy loading for heavy components
- Test on slow network (3G simulation)

### App Store Optimization (ASO)
- Research keywords before submission
- A/B test screenshots and descriptions
- Monitor reviews and respond quickly
- Update regularly (signals active development)

---

## 📞 SUPPORT

**Questions?** Email: technical@strkfit.com

**Bugs?** File an issue or email with:
- Platform (Android/iOS)
- Device/OS version
- Steps to reproduce
- Screenshots/logs

---

**Document Version**: 1.0
**Platform**: Capacitor 8.0
**Last Updated**: December 28, 2025
**Status**: ✅ Production Ready
