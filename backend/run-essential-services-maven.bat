@echo off
setlocal EnableDelayedExpansion

echo 🎬 MovieTix - Starting Essential Services with Maven
echo ===================================================
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

echo %BLUE%📦 Building essential services...%RESET%
call mvn clean package -DskipTests
if %ERRORLEVEL% neq 0 (
    echo %RED%❌ Build failed!%RESET%
    pause
    exit /b 1
)
echo %GREEN%✅ Build completed successfully%RESET%
echo.

echo %BLUE%🚀 Starting essential services for frontend...%RESET%
echo.

:: Start Eureka Server first (Service Discovery)
echo %YELLOW%Starting Eureka Server (Port 8761)...%RESET%
start "Eureka Server" cmd /k "cd eureka-server && echo Starting Eureka Server... && mvn spring-boot:run"
timeout /t 15 /nobreak >nul

:: Start User Service (Authentication - CRITICAL for frontend)
echo %YELLOW%Starting User Service (Port 8081) - Authentication%RESET%
start "User Service" cmd /k "cd user-service && echo Starting User Service for Authentication... && mvn spring-boot:run"
timeout /t 10 /nobreak >nul

:: Start API Gateway (Entry Point - CRITICAL for frontend)
echo %YELLOW%Starting API Gateway (Port 8080) - Frontend Entry Point%RESET%
start "API Gateway" cmd /k "cd api-gateway && echo Starting API Gateway... && mvn spring-boot:run"

echo.
echo %GREEN%🎉 Essential services are starting!%RESET%
echo.
echo %BLUE%📋 Running Services:%RESET%
echo ===================
echo ✅ Eureka Server:    http://localhost:8761 (Service Discovery)
echo ✅ User Service:     http://localhost:8081 (Authentication)
echo ✅ API Gateway:      http://localhost:8080 (Frontend Entry Point)
echo.
echo %BLUE%🎯 Frontend Connection:%RESET%
echo ======================
echo Your frontend can now connect to: http://localhost:8080
echo Authentication endpoints will work: /api/auth/login, /api/auth/register
echo.
echo %BLUE%🔄 Optional: Start Additional Services%RESET%
echo =====================================
echo To add more services, run these in separate terminals:
echo   cd movie-service && mvn spring-boot:run
echo   cd theater-service && mvn spring-boot:run
echo   cd showtime-service && mvn spring-boot:run
echo   cd booking-service && mvn spring-boot:run
echo.
echo %YELLOW%⏳ Wait 2-3 minutes for services to fully start%RESET%
echo %GREEN%✅ Check service windows for "Started" messages%RESET%
echo.
pause