@echo off
echo Starting all microservices in separate terminals...

start powershell -Command "cd eureka-server; mvn spring-boot:run"
start powershell -Command "cd config-server; mvn spring-boot:run"
start powershell -Command "cd user-service; mvn spring-boot:run"
start powershell -Command "cd movie-service; mvn spring-boot:run"
start powershell -Command "cd theater-service; mvn spring-boot:run"
start powershell -Command "cd showtime-service; mvn spring-boot:run"
start powershell -Command "cd booking-service; mvn spring-boot:run"
start powershell -Command "cd api-gateway; mvn spring-boot:run"

echo All services started in separate terminals!
pause