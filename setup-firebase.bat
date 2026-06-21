@echo off
echo ============================================
echo  FASTVault Firebase Setup
echo ============================================
echo.
echo Step 1: Login to Firebase (browser will open)
echo.
firebase login
echo.
echo Step 2: Link project fastvault-40b3f
cd /d "%~dp0"
firebase use fastvault-40b3f
echo.
echo Step 3: Get your web app config
firebase apps:sdkconfig WEB
echo.
echo Copy the apiKey, messagingSenderId, and appId values
echo into .env.local then restart: npm run dev
echo.
echo Step 4: Deploy rules (optional but recommended)
firebase deploy --only firestore:rules,firestore:indexes,storage
echo.
pause
