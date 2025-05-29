# Gradle Build Troubleshooting Guide

## Current Build Status ✅
Your project builds successfully, but here are potential issues to watch for:

## Common Build Issues & Solutions

### 1. Long File Path Issues (Windows)
**Symptoms:**
- CMake warnings about file paths exceeding 250 characters
- Build failures on Windows

**Solutions:**
- Move project to shorter path (e.g., `C:\tms\` instead of `C:\Users\Ramsha Malik\Downloads\tms_application\`)
- Enable long path support in Windows:
  ```powershell
  # Run as Administrator
  New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
  ```

### 2. Memory Issues
**Symptoms:**
- OutOfMemoryError during build
- Build process killed

**Solutions:**
- Increase heap size in `android/gradle.properties`:
  ```properties
  org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m
  ```
- Close other applications during build

### 3. NDK/CMake Issues
**Symptoms:**
- C++ compilation errors
- Native module build failures

**Solutions:**
- Ensure NDK version matches project requirements
- Clean and rebuild:
  ```bash
  cd android
  ./gradlew clean
  ./gradlew assembleDebug
  ```

### 4. Dependency Conflicts
**Symptoms:**
- Duplicate class errors
- Version conflicts

**Solutions:**
- Run dependency check:
  ```bash
  npx expo install --check
  ```
- Clear caches:
  ```bash
  npx expo start --clear
  cd android && ./gradlew clean
  ```

### 5. Production Build Issues
**Symptoms:**
- Release build fails
- Keystore errors

**Solutions:**
- Generate production keystore:
  ```bash
  keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
  ```
- Configure in `android/gradle.properties`:
  ```properties
  MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
  MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
  MYAPP_UPLOAD_STORE_PASSWORD=your-password
  MYAPP_UPLOAD_KEY_PASSWORD=your-password
  ```

## Build Commands

### Debug Build
```bash
cd android
./gradlew assembleDebug
```

### Release Build
```bash
cd android
./gradlew assembleRelease
```

### Clean Build
```bash
cd android
./gradlew clean assembleDebug
```

## Monitoring Build Health

### Check for Issues
```bash
# Run Expo doctor
npx expo-doctor

# Check dependencies
npx expo install --check

# Gradle dependency report
cd android && ./gradlew dependencies
```

### Performance Monitoring
- Build time: Currently ~18 minutes (normal for first build)
- Subsequent builds should be faster due to caching
- Watch for memory usage during builds

## Known Warnings (Safe to Ignore)
- C++ `$` identifier warnings from codegen
- Deprecated Gradle features (will be fixed in future updates)
- Kotlin deprecation warnings from Expo modules

## When to Seek Help
- Build fails after dependency updates
- New native modules cause conflicts
- Production builds fail consistently
- Build times exceed 30 minutes regularly 