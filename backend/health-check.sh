#!/bin/bash
# MovieTix Microservices Health Check Script

echo "=== MovieTix Microservices Health Check ==="
echo ""

# Service endpoints
services=(
    "Eureka Server:http://localhost:8761/actuator/health"
    "Config Server:http://localhost:8888/actuator/health"
    "API Gateway:http://localhost:8080/actuator/health"
    "User Service:http://localhost:8081/actuator/health"
    "Movie Service:http://localhost:8082/actuator/health"
    "Theater Service:http://localhost:8083/actuator/health"
    "Showtime Service:http://localhost:8084/actuator/health"
    "Booking Service:http://localhost:8085/actuator/health"
)

# Check each service
for service in "${services[@]}"; do
    name=$(echo $service | cut -d':' -f1)
    url=$(echo $service | cut -d':' -f2,3)
    
    echo "Checking $name..."
    response=$(curl -s -w "%{http_code}" "$url" -o /dev/null)
    
    if [ "$response" = "200" ]; then
        echo "✅ $name: UP"
    else
        echo "❌ $name: DOWN (HTTP $response)"
    fi
done

echo ""
echo "=== Service Registry Status ==="
echo "Eureka Dashboard: http://localhost:8761"
echo "API Gateway: http://localhost:8080"
echo ""
echo "=== API Endpoints ==="
echo "User Registration: POST http://localhost:8080/api/users/register"
echo "User Login: POST http://localhost:8080/api/users/login"
echo "Movies: GET http://localhost:8080/api/movies"
echo "Theaters: GET http://localhost:8080/api/theaters"
echo "Showtimes: GET http://localhost:8080/api/showtimes"
echo "Bookings: POST http://localhost:8080/api/bookings"