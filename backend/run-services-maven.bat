@echo off
setlocal EnableDelayedExpansion

echo 🎬 MovieTix - Starting Services with Maven
echo ==========================================
echo.

:: Color codes for better output
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "RESET=[0m"

:: Navigate to backend directory
cd /d "%~dp0"

echo %BLUE%🔍 Checking Maven installation...%RESET%
mvn --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo %RED%❌ Maven is not installed or not in PATH!%RESET%
    echo Please install Maven and add it to your PATH.
    pause
    exit /b 1
)
echo %GREEN%✅ Maven is available%RESET%
echo.

echo %BLUE%📦 Building all services...%RESET%
call mvn clean package -DskipTests
if %ERRORLEVEL% neq 0 (
    echo %RED%❌ Build failed!%RESET%
    pause
    exit /b 1
)
echo %GREEN%✅ Build completed successfully%RESET%
echo.

echo %BLUE%🚀 Starting all services...%RESET%
echo.

:: Start Eureka Server first (Service Discovery)
echo %YELLOW%Starting Eureka Server (Port 8761)...%RESET%
start "Eureka Server" cmd /k "cd eureka-server && mvn spring-boot:run"
timeout /t 15 /nobreak >nul

:: Start Config Server (Configuration Management)
echo %YELLOW%Starting Config Server (Port 8888)...%RESET%
start "Config Server" cmd /k "cd config-server && mvn spring-boot:run"
timeout /t 10 /nobreak >nul

:: Start User Service (Authentication)
echo %YELLOW%Starting User Service (Port 8081)...%RESET%
start "User Service" cmd /k "cd user-service && mvn spring-boot:run"
timeout /t 5 /nobreak >nul

:: Start Movie Service
echo %YELLOW%Starting Movie Service (Port 8082)...%RESET%
start "Movie Service" cmd /k "cd movie-service && mvn spring-boot:run"
timeout /t 5 /nobreak >nul

:: Start Theater Service
echo %YELLOW%Starting Theater Service (Port 8083)...%RESET%
start "Theater Service" cmd /k "cd theater-service && mvn spring-boot:run"
timeout /t 5 /nobreak >nul

:: Start Showtime Service
echo %YELLOW%Starting Showtime Service (Port 8084)...%RESET%
start "Showtime Service" cmd /k "cd showtime-service && mvn spring-boot:run"
timeout /t 5 /nobreak >nul

:: Start Booking Service
echo %YELLOW%Starting Booking Service (Port 8085)...%RESET%
start "Booking Service" cmd /k "cd booking-service && mvn spring-boot:run"
timeout /t 5 /nobreak >nul

:: Start API Gateway last (Entry Point)
echo %YELLOW%Starting API Gateway (Port 8080)...%RESET%
start "API Gateway" cmd /k "cd api-gateway && mvn spring-boot:run"

echo.
echo %GREEN%🎉 All services are starting!%RESET%
echo.
echo %BLUE%📋 Service URLs:%RESET%
echo ================
echo Frontend:         http://localhost:3000
echo API Gateway:      http://localhost:8080
echo Eureka Server:    http://localhost:8761
echo Config Server:    http://localhost:8888
echo User Service:     http://localhost:8081
echo Movie Service:    http://localhost:8082
echo Theater Service:  http://localhost:8083
echo Showtime Service: http://localhost:8084
echo Booking Service:  http://localhost:8085
echo.
echo %BLUE%🗄️  Database Ports (Docker):%RESET%
echo ==========================
echo User DB:     localhost:3316
echo Movie DB:    localhost:3307
echo Theater DB:  localhost:3308
echo Showtime DB: localhost:3309
echo Booking DB:  localhost:3310
echo.
echo %BLUE%📚 Important Notes:%RESET%
echo ==================
echo • Services will open in separate command windows
echo • Wait 2-3 minutes for all services to fully start
echo • Check each window for startup completion
echo • Eureka dashboard: http://localhost:8761
echo • API docs: http://localhost:8080/swagger-ui.html
echo.
echo %YELLOW%💡 Useful Commands:%RESET%
echo • Close all service windows to stop services
echo • Check service status at: http://localhost:8761
echo • Test API Gateway: http://localhost:8080/actuator/health
echo.
echo %GREEN%✅ All services launched! Check individual windows for startup progress.%RESET%
echo.
pause