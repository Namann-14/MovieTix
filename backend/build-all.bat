@echo off
echo 🚀 Building MovieTix Microservices...
echo ======================================

echo 📦 Building parent project...
call mvn clean package -DskipTests

if %ERRORLEVEL% EQU 0 (
    echo ✅ Build completed successfully!
    echo.
    echo 🐳 Building Docker images...
    
    for %%s in (eureka-server config-server api-gateway user-service movie-service theater-service showtime-service booking-service) do (
        echo 🔨 Building %%s...
        cd %%s
        docker build -t movietix/%%s:latest .
        cd ..
    )
    
    echo.
    echo ✅ All Docker images built successfully!
    echo.
    echo 🚀 To start the application, run:
    echo    docker-compose up -d
    echo.
    echo 📝 API Documentation will be available at:
    echo    http://localhost:8080/swagger-ui.html
    echo.
    echo 🔍 Service Discovery at:
    echo    http://localhost:8761
) else (
    echo ❌ Build failed!
    exit /b 1
)