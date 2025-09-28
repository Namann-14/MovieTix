# MovieTix Microservices Health Check Script (PowerShell)

Write-Host "=== MovieTix Microservices Health Check ===" -ForegroundColor Green
Write-Host ""

# Service endpoints
$services = @{
    "Eureka Server" = "http://localhost:8761/actuator/health"
    "Config Server" = "http://localhost:8888/actuator/health"  
    "API Gateway" = "http://localhost:8080/actuator/health"
    "User Service" = "http://localhost:8081/actuator/health"
    "Movie Service" = "http://localhost:8082/actuator/health"
    "Theater Service" = "http://localhost:8083/actuator/health"
    "Showtime Service" = "http://localhost:8084/actuator/health"
    "Booking Service" = "http://localhost:8085/actuator/health"
}

# Check each service
foreach ($service in $services.GetEnumerator()) {
    Write-Host "Checking $($service.Key)..." -NoNewline
    try {
        $response = Invoke-WebRequest -Uri $service.Value -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host " ✅ UP" -ForegroundColor Green
        } else {
            Write-Host " ❌ DOWN (HTTP $($response.StatusCode))" -ForegroundColor Red
        }
    } catch {
        Write-Host " ❌ DOWN (Connection failed)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Service Registry Status ===" -ForegroundColor Yellow
Write-Host "Eureka Dashboard: http://localhost:8761"
Write-Host "API Gateway: http://localhost:8080"
Write-Host ""
Write-Host "=== API Endpoints ===" -ForegroundColor Yellow
Write-Host "User Registration: POST http://localhost:8080/api/users/register"
Write-Host "User Login: POST http://localhost:8080/api/users/login"
Write-Host "Movies: GET http://localhost:8080/api/movies"
Write-Host "Theaters: GET http://localhost:8080/api/theaters"
Write-Host "Showtimes: GET http://localhost:8080/api/showtimes"
Write-Host "Bookings: POST http://localhost:8080/api/bookings"
Write-Host ""
Write-Host "=== Sample cURL Commands ===" -ForegroundColor Cyan
Write-Host @"
# Register a new user
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john.doe@example.com",
    "phoneNumber": "1234567890",
    "password": "password123"
  }'

# Login user
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'

# Get all movies
curl -X GET http://localhost:8080/api/movies

# Get all theaters
curl -X GET http://localhost:8080/api/theaters
"@