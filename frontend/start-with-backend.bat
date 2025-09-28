@echo off
setlocal EnableDelayedExpansion

echo 🎬 MovieTix - Frontend & Backend Connection Setup
echo ==================================================
echo.

:: Color codes for better output
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "RESET=[0m"

:: Check if Node.js is installed
echo %BLUE%🔍 Checking Node.js installation...%RESET%
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo %RED%❌ Node.js is not installed! Please install Node.js first.%RESET%
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)
echo %GREEN%✅ Node.js is installed%RESET%

:: Check if backend services are running
echo %BLUE%🔍 Checking if backend services are running...%RESET%
curl -s http://localhost:8080/actuator/health >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo %YELLOW%⚠️  Backend services are not running!%RESET%
    echo %BLUE%🚀 Starting backend services...%RESET%
    
    :: Navigate to backend directory and start services
    pushd "%~dp0\..\backend"
    if exist "run-all-services.bat" (
        call run-all-services.bat
    ) else (
        echo %YELLOW%📦 Building and starting services with Docker Compose...%RESET%
        docker-compose up -d
    )
    popd
    
    :: Wait for services to be ready
    echo %BLUE%⏳ Waiting for backend services to be ready...%RESET%
    timeout /t 30 /nobreak >nul
    
    :: Check again
    curl -s http://localhost:8080/actuator/health >nul 2>&1
    if %ERRORLEVEL% neq 0 (
        echo %RED%❌ Backend services failed to start properly!%RESET%
        echo %YELLOW%💡 Please check the backend logs and try again.%RESET%
        pause
        exit /b 1
    )
)
echo %GREEN%✅ Backend services are running%RESET%

:: Navigate to frontend directory
cd /d "%~dp0"

:: Check if node_modules exists
if not exist "node_modules\" (
    echo %BLUE%📦 Installing frontend dependencies...%RESET%
    if exist "pnpm-lock.yaml" (
        pnpm install
    ) else if exist "yarn.lock" (
        yarn install
    ) else (
        npm install
    )
    
    if !ERRORLEVEL! neq 0 (
        echo %RED%❌ Failed to install dependencies!%RESET%
        pause
        exit /b 1
    )
    echo %GREEN%✅ Dependencies installed%RESET%
) else (
    echo %GREEN%✅ Dependencies already installed%RESET%
)

:: Test backend connectivity
echo %BLUE%🔗 Testing backend connectivity...%RESET%

:: Test API Gateway health
curl -s http://localhost:8080/actuator/health | findstr UP >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo %GREEN%✅ API Gateway is healthy%RESET%
) else (
    echo %YELLOW%⚠️  API Gateway health check inconclusive%RESET%
)

:: Test specific endpoints
echo %BLUE%🧪 Testing API endpoints...%RESET%

:: Test movies endpoint (this might fail if authentication is required)
curl -s -o nul -w "%%{http_code}" http://localhost:8080/api/movies | findstr "200\|401" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo %GREEN%✅ Movies API endpoint is responding%RESET%
) else (
    echo %YELLOW%⚠️  Movies API endpoint test inconclusive%RESET%
)

echo.
echo %GREEN%🎉 Setup completed successfully!%RESET%
echo.
echo %BLUE%🌐 Service URLs:%RESET%
echo ================
echo Frontend:         http://localhost:3000
echo Backend Gateway:  http://localhost:8080
echo Eureka Server:    http://localhost:8761
echo.
echo %BLUE%📋 Next Steps:%RESET%
echo ===============
echo 1. The backend services are running
echo 2. Frontend dependencies are installed
echo 3. You can now start the frontend development server
echo.
echo %YELLOW%🚀 Starting frontend development server...%RESET%
echo.

:: Start the development server
if exist "pnpm-lock.yaml" (
    echo Running with pnpm...
    pnpm dev
) else if exist "yarn.lock" (
    echo Running with yarn...
    yarn dev
) else (
    echo Running with npm...
    npm run dev
)

echo.
echo Press any key to exit...
pause >nul