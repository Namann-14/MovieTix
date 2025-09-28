@echo off
echo 🎬 Starting MovieTix Application...
echo =================================

REM Stop any existing containers
echo 🛑 Stopping existing containers...
docker-compose down

REM Start all services
echo 🚀 Starting all services...
docker-compose up -d

echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Show status
echo 📊 Container Status:
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo 🎉 MovieTix Application Started Successfully!
echo ===============================================
echo 🌐 Frontend (Next.js):       http://localhost:3000
echo 🔗 API Gateway:              http://localhost:8080
echo 🔍 Eureka Server:            http://localhost:8761
echo ⚙️  Config Server:            http://localhost:8888
echo.
echo 🔧 Individual Services:
echo    👤 User Service:          http://localhost:8081
echo    🎬 Movie Service:         http://localhost:8082
echo    🏛️  Theater Service:       http://localhost:8083
echo    🎫 Showtime Service:      http://localhost:8084
echo    📋 Booking Service:       http://localhost:8085
echo.
echo 💾 Database Ports:
echo    User DB:                 localhost:3316
echo    Movie DB:                localhost:3307
echo    Theater DB:              localhost:3308
echo    Showtime DB:             localhost:3309
echo    Booking DB:              localhost:3310
echo.
echo 📝 To stop the application, run: docker-compose down
pause