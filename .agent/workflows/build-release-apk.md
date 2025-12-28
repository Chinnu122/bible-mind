---
description: How to build a signed release APK for Bible Mind Android app
---

# Build Release APK - Full Steps

## Prerequisites
- Android Studio installed
- JDK 17+ (bundled with Android Studio)
- USB debugging enabled on test device (optional)

---

## Step 1: Open Project in Android Studio

1. Open **Android Studio**
2. Click **File > Open**
3. Navigate to: `D:\projects\Bible Mind\frontend\android`
4. Click **OK** and wait for Gradle sync to complete

---

## Step 2: Create Signing Key (First Time Only)

1. Go to **Build > Generate Signed Bundle / APK**
2. Select **APK** > Click **Next**
3. Click **Create new...** button
4. Fill in the form:
   - **Key store path**: `D:\projects\Bible Mind\frontend\android\biblemind-release-key.jks`
   - **Password**: Choose a strong password (SAVE THIS!)
   - **Alias**: `biblemind`
   - **Key password**: Same as above or different
   - **Validity (years)**: `25`
   - **Certificate info**: Fill your name/organization
5. Click **OK**

> ⚠️ **IMPORTANT**: Save the keystore file and passwords! You need them for all future updates.

---

## Step 3: Build Signed APK

1. Go to **Build > Generate Signed Bundle / APK**
2. Select **APK** > Click **Next**
3. Select your keystore file created in Step 2
4. Enter passwords and alias
5. Click **Next**
6. Select:
   - **Build Variants**: `release`
   - **Signature Versions**: Check both `V1` and `V2`
7. Click **Create**
8. Wait for build to complete (~2-5 minutes)

---

## Step 4: Find Your APK

After successful build, the APK will be at:
```
D:\projects\Bible Mind\frontend\android\app\release\app-release.apk
```

Or Android Studio will show a popup with the location.

---

## Step 5: Test the APK

1. Transfer APK to Android device via USB or cloud
2. Enable "Install from unknown sources" in device settings
3. Tap the APK file to install
4. Test all features

---

## Alternative: Command Line Build

If you have signing configured in `build.gradle`:

```bash
cd D:\projects\Bible Mind\frontend\android
.\gradlew assembleRelease
```

Output: `app\build\outputs\apk\release\app-release.apk`

---

## Troubleshooting

### "SDK location not found"
- Open Android Studio and let it download required SDK components

### "JDK not found"
- Already configured in `gradle.properties`:
  ```
  org.gradle.java.home=C:/Users/chinn/.antigravity/extensions/redhat.java-1.50.0-win32-x64/jre/21.0.9-win32-x86_64
  ```

### Build takes too long
- Increase memory in `gradle.properties`:
  ```
  org.gradle.jvmargs=-Xmx4096m
  ```
