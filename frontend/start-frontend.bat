@echo off
setlocal EnableDelayedExpansion

echo 🎬 MovieTix Frontend - Development Server
echo =========================================
echo.

:: Color codes for better output
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "RESET=[0m"

:: Navigate to frontend directory
cd /d "%~dp0"

:: Check if Node.js is installed
echo %BLUE%🔍 Checking Node.js installation...%RESET%
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo %RED%❌ Node.js is not installed! Please install Node.js first.%RESET%
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

set NODE_VERSION=
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo %GREEN%✅ Node.js %NODE_VERSION% is installed%RESET%

:: Check if dependencies are installed
if not exist "node_modules\" (
    echo %BLUE%📦 Installing dependencies...%RESET%
    
    if exist "pnpm-lock.yaml" (
        echo Using pnpm...
        pnpm install
    ) else if exist "yarn.lock" (
        echo Using yarn...
        yarn install
    ) else (
        echo Using npm...
        npm install
    )
    
    if !ERRORLEVEL! neq 0 (
        echo %RED%❌ Failed to install dependencies!%RESET%
        pause
        exit /b 1
    )
    echo %GREEN%✅ Dependencies installed successfully%RESET%
) else (
    echo %GREEN%✅ Dependencies already installed%RESET%
)

:: Check backend connectivity
echo %BLUE%🔗 Checking backend connectivity...%RESET%
curl -s http://localhost:8080/actuator/health >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo %GREEN%✅ Backend is reachable at http://localhost:8080%RESET%
) else (
    echo %YELLOW%⚠️  Backend is not running at http://localhost:8080%RESET%
    echo %BLUE%💡 Make sure to start the backend services first:%RESET%
    echo    cd ..\backend
    echo    run-all-services.bat
    echo.
)

echo.
echo %BLUE%🚀 Starting development server...%RESET%
echo Frontend will be available at: http://localhost:3000
echo.

:: Start the development server
if exist "pnpm-lock.yaml" (
    pnpm dev
) else if exist "yarn.lock" (
    yarn dev
) else (
    npm run dev
)