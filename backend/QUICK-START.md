# MovieTix Microservices - Quick Start Guide

## 🚀 Getting Started

### 1. Prerequisites
- Java 17+
- Maven 3.6+
- Docker & Docker Compose
- 8GB+ RAM recommended

### 2. Clone & Build
```bash
git clone <your-repo>
cd movietx

# Build all services
./build-all.sh  # Linux/Mac
# OR
build-all.bat   # Windows
```

### 3. Start Services
```bash
# Start all services with databases
docker-compose up -d

# Wait for services to start (2-3 minutes)
# Check status
docker-compose ps
```

### 4. Verify Installation
```bash
# Check Eureka (Service Discovery)
curl http://localhost:8761

# Check API Gateway
curl http://localhost:8080/actuator/health
```

## 🎯 Test the Application

### Step 1: Register a User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@movietix.com", 
    "password": "admin123"
  }'
```

### Step 2: Login & Get Token
```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@movietix.com",
    "password": "admin123"
  }' | jq -r '.token')

echo "Token: $TOKEN"
```

### Step 3: Promote to Admin
```bash
curl -X POST http://localhost:8080/api/admin/users/1/make-admin \
  -H "Authorization: Bearer $TOKEN"
```

### Step 4: Create Movie
```bash
curl -X POST http://localhost:8080/api/admin/movies \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Avengers: Endgame",
    "genre": "Action",
    "durationInMinutes": 181,
    "releaseDate": "2019-04-26",
    "description": "Epic superhero finale"
  }'
```

### Step 5: Create Theater
```bash
curl -X POST http://localhost:8080/api/admin/theaters \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "IMAX Theater 1",
    "location": "Downtown",
    "seatingCapacity": 300
  }'
```

### Step 6: Create Showtime
```bash
curl -X POST http://localhost:8080/api/admin/showtimes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "movieId": 1,
    "theaterId": 1,
    "showDateTime": "2025-10-01T19:30:00",
    "ticketPrice": 15.50
  }'
```

### Step 7: Book Tickets (as Customer)
```bash
# Register customer
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Customer",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login as customer  
CUSTOMER_TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }' | jq -r '.token')

# Book tickets
curl -X POST http://localhost:8080/api/bookings \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "showtimeId": 1,
    "numberOfSeats": 2
  }'
```

## 📊 Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| API Gateway | http://localhost:8080 | Main entry point |
| Eureka Server | http://localhost:8761 | Service discovery |
| Config Server | http://localhost:8888 | Configuration |
| User Service | http://localhost:8081 | Direct access |
| Movie Service | http://localhost:8082 | Direct access |
| Theater Service | http://localhost:8083 | Direct access |
| Showtime Service | http://localhost:8084 | Direct access |
| Booking Service | http://localhost:8085 | Direct access |

## 🐛 Troubleshooting

### Services Won't Start
```bash
# Check Docker
docker --version
docker-compose --version

# Check ports
netstat -tulpn | grep :8080

# Rebuild if needed
docker-compose down
./build-all.sh
docker-compose up -d
```

### Database Connection Issues
```bash
# Check MySQL containers
docker-compose logs mysql-user
docker-compose logs mysql-movie

# Restart databases
docker-compose restart mysql-user mysql-movie mysql-theater mysql-showtime mysql-booking
```

### Service Registration Issues
```bash
# Check Eureka
curl http://localhost:8761/eureka/apps

# Check service logs
docker-compose logs user-service
docker-compose logs movie-service
```

## 🔧 Development Mode

To run services individually for development:

```bash
# Start databases and infrastructure
docker-compose up -d mysql-user mysql-movie mysql-theater mysql-showtime mysql-booking
docker-compose up -d eureka-server config-server

# Run services with Maven
cd user-service && mvn spring-boot:run
cd movie-service && mvn spring-boot:run  
# etc.
```

## 📝 API Documentation

Once running, access Swagger UI:
- http://localhost:8081/swagger-ui.html (User Service)
- http://localhost:8082/swagger-ui.html (Movie Service)
- http://localhost:8083/swagger-ui.html (Theater Service)
- http://localhost:8084/swagger-ui.html (Showtime Service) 
- http://localhost:8085/swagger-ui.html (Booking Service)

## 🎉 Success!

If you can complete all the test steps above, your MovieTix microservices application is working perfectly!

The system provides:
- ✅ User registration and JWT authentication
- ✅ Role-based access control (Customer/Admin)
- ✅ Movie catalog management
- ✅ Theater management  
- ✅ Showtime scheduling
- ✅ Ticket booking system
- ✅ Service discovery and load balancing
- ✅ Circuit breakers and fault tolerance
- ✅ Centralized configuration
- ✅ Database per service
- ✅ Docker containerization

## 📞 Support

For issues or questions:
1. Check the logs: `docker-compose logs <service-name>`
2. Verify service health: `curl localhost:<port>/actuator/health`
3. Check Eureka dashboard: http://localhost:8761