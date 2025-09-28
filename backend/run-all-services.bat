@echo off
setlocal EnableDelayedExpansion

echo 🎬 MovieTix - Starting All Services
echo ====================================
echo.

:: Color codes for better output
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "RESET=[0m"

:: Check if Docker is running
echo %BLUE%🔍 Checking Docker status...%RESET%
docker version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo %RED%❌ Docker is not running! Please start Docker Desktop first.%RESET%
    pause
    exit /b 1
)
echo %GREEN%✅ Docker is running%RESET%
echo.

:: Stop any existing containers
echo %YELLOW%🛑 Stopping any existing MovieTix containers...%RESET%
docker-compose down
echo.

:: Clean up any orphaned containers
echo %YELLOW%🧹 Cleaning up orphaned containers...%RESET%
docker-compose down --remove-orphans
echo.

:: Build the application if needed
echo %BLUE%🔨 Checking if build is needed...%RESET%
if not exist "target\" (
    echo %YELLOW%📦 Building application...%RESET%
    call build-all.bat
    if !ERRORLEVEL! neq 0 (
        echo %RED%❌ Build failed! Cannot start services.%RESET%
        pause
        exit /b 1
    )
)
echo %GREEN%✅ Application is built%RESET%
echo.

:: Start the services
echo %BLUE%🚀 Starting all services with Docker Compose...%RESET%
echo This may take a few minutes on first run...
echo.

docker-compose up -d

if %ERRORLEVEL% equ 0 (
    echo.
    echo %GREEN%✅ All services started successfully!%RESET%
    echo.
    echo %BLUE%📋 Service Status:%RESET%
    echo ==================
    
    :: Wait a moment for services to initialize
    timeout /t 5 /nobreak >nul
    
    :: Show running containers
    docker-compose ps
    
    echo.
    echo %BLUE%🌐 Service URLs:%RESET%
    echo ================
    echo API Gateway:      http://localhost:8080
    echo Eureka Server:    http://localhost:8761
    echo Config Server:    http://localhost:8888
    echo User Service:     http://localhost:8081
    echo Movie Service:    http://localhost:8082
    echo Theater Service:  http://localhost:8083
    echo Showtime Service: http://localhost:8084
    echo Booking Service:  http://localhost:8085
    echo.
    echo %BLUE%🗄️  Database Ports:%RESET%
    echo ==================
    echo User DB:     localhost:3316
    echo Movie DB:    localhost:3307
    echo Theater DB:  localhost:3308
    echo Showtime DB: localhost:3309
    echo Booking DB:  localhost:3310
    echo.
    echo %BLUE%📚 Documentation:%RESET%
    echo ==================
    echo API Docs: http://localhost:8080/swagger-ui.html
    echo.
    echo %GREEN%🎉 MovieTix is ready to use!%RESET%
    echo.
    echo %YELLOW%💡 Useful commands:%RESET%
    echo   View logs:           docker-compose logs -f
    echo   View specific logs:  docker-compose logs -f [service-name]
    echo   Stop all services:   docker-compose down
    echo   Restart service:     docker-compose restart [service-name]
    echo.
    
) else (
    echo.
    echo %RED%❌ Failed to start some services!%RESET%
    echo.
    echo %YELLOW%🔍 Checking service status...%RESET%
    docker-compose ps
    echo.
    echo %YELLOW%📋 Recent logs:%RESET%
    docker-compose logs --tail=50
    echo.
    echo %YELLOW%💡 Try running 'docker-compose logs -f' to see detailed logs%RESET%
)

echo.
echo Press any key to exit...
pause >nul