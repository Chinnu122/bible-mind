@echo off
echo 🚀 Building Bible Mind for Production...

:: Build backend
echo 📦 Building Backend...
cd backend
call npm install
call npm run build
cd ..

:: Build frontend  
echo 📦 Building Frontend...
cd frontend
call npm install
call npm run build
cd ..

echo ✅ Build complete!
echo.
echo 📁 Files ready at:
echo    - backend\dist\ (Node.js server)
echo    - frontend\dist\ (Static files)
echo.
echo 🐳 To deploy with Docker:
echo    docker-compose up -d --build
echo.
echo 📤 To deploy manually:
echo    1. Upload backend\ folder to your server
echo    2. Upload frontend\dist\ to your web server
echo    3. Run: cd backend ^&^& npm start
pause
