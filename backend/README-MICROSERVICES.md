# MovieTix Microservices Architecture

A complete microservices-based movie ticket management system built with Spring Boot, Spring Cloud, and MySQL.

## 🏗️ Architecture Overview

The system consists of 8 microservices:

1. **Eureka Server** (Port 8761) - Service Discovery
2. **Config Server** (Port 8888) - Centralized Configuration
3. **API Gateway** (Port 8080) - Request Routing & Authentication
4. **User Service** (Port 8081) - User Management & Authentication
5. **Movie Service** (Port 8082) - Movie Catalog Management
6. **Theater Service** (Port 8083) - Theater Management
7. **Showtime Service** (Port 8084) - Showtime Scheduling
8. **Booking Service** (Port 8085) - Ticket Booking

## 🛠️ Technology Stack

- **Java 17**
- **Spring Boot 3.5.5**
- **Spring Cloud 2024.0.0**
- **MySQL 8.0**
- **Docker & Docker Compose**
- **JWT Authentication**
- **OpenFeign** (Inter-service communication)
- **Resilience4j** (Circuit Breaker)
- **Swagger/OpenAPI** (API Documentation)

## 🚀 Quick Start

### Prerequisites

- Java 17+
- Maven 3.6+
- Docker & Docker Compose
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd movietx
```

### 2. Build All Services

```bash
mvn clean package -DskipTests
```

### 3. Start with Docker Compose

```bash
docker-compose up -d
```

This will start:
- 5 MySQL databases (one for each service)
- All 8 microservices
- Complete networking setup

### 4. Verify Services

Wait for all services to start (approximately 2-3 minutes), then check:

```bash
# Check service discovery
curl http://localhost:8761

# Check API Gateway health
curl http://localhost:8080/actuator/health

# Check all services are registered
curl http://localhost:8761/eureka/apps
```

## 📝 API Documentation

Once services are running, access Swagger documentation:

- **API Gateway**: http://localhost:8080/swagger-ui.html
- **User Service**: http://localhost:8081/swagger-ui.html
- **Movie Service**: http://localhost:8082/swagger-ui.html
- **Theater Service**: http://localhost:8083/swagger-ui.html
- **Showtime Service**: http://localhost:8084/swagger-ui.html
- **Booking Service**: http://localhost:8085/swagger-ui.html

## 🔐 Authentication

All API calls (except registration/login) require JWT authentication:

```bash
# Register a user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login to get JWT token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Use token in subsequent requests
curl -H "Authorization: Bearer <JWT_TOKEN>" \
     http://localhost:8080/api/movies
```

## 🎬 Sample API Usage

### Create Admin User

```bash
# 1. Register a user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@movietix.com",
    "password": "admin123"
  }'

# 2. Login to get token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@movietix.com",
    "password": "admin123"
  }' | jq -r '.token')

# 3. Promote to admin (use user ID from registration response)
curl -X POST http://localhost:8080/api/admin/users/1/make-admin \
  -H "Authorization: Bearer $TOKEN"
```

### Create Movie

```bash
curl -X POST http://localhost:8080/api/admin/movies \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Avengers: Endgame",
    "genre": "Action",
    "durationInMinutes": 181,
    "releaseDate": "2019-04-26",
    "description": "The epic conclusion to the Infinity Saga."
  }'
```

### Create Theater

```bash
curl -X POST http://localhost:8080/api/admin/theaters \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "IMAX Theater 1",
    "location": "Downtown Mall",
    "seatingCapacity": 300
  }'
```

### Create Showtime

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

### Book Tickets

```bash
# First login as a customer
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

## 🗄️ Database Schema

Each service has its own MySQL database:

- **user_service_db**: Users, roles
- **movie_service_db**: Movies
- **theater_service_db**: Theaters
- **showtime_service_db**: Showtimes
- **booking_service_db**: Bookings

## 🔧 Development

### Running Individual Services

```bash
# Start infrastructure services first
docker-compose up -d mysql-user mysql-movie mysql-theater mysql-showtime mysql-booking
docker-compose up -d eureka-server
docker-compose up -d config-server

# Then start individual services with Maven
cd user-service
mvn spring-boot:run

cd ../movie-service
mvn spring-boot:run

# ... and so on
```

### Building Docker Images

```bash
# Build all services
./build-all.sh

# Or build individual services
cd user-service
docker build -t movietix/user-service .
```

## 🐛 Troubleshooting

### Services Not Starting

1. Check if ports are available:
```bash
netstat -tulpn | grep :8080
```

2. Check Docker logs:
```bash
docker-compose logs user-service
```

3. Verify database connections:
```bash
docker-compose logs mysql-user
```

### Authentication Issues

1. Verify JWT secret is consistent across services
2. Check token expiration (default: 24 hours)
3. Ensure proper Authorization header format: `Bearer <token>`

### Service Discovery Issues

1. Check Eureka dashboard: http://localhost:8761
2. Verify service registration in logs
3. Check network connectivity between containers

## 📊 Monitoring

### Health Checks

```bash
# Check all service health
curl http://localhost:8080/actuator/health
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health
# ... etc
```

### Metrics

```bash
# Service metrics
curl http://localhost:8081/actuator/metrics
```

### Gateway Routes

```bash
# View configured routes
curl http://localhost:8080/actuator/gateway/routes
```

## 🚢 Production Deployment

### Environment Variables

Set these environment variables for production:

```bash
# JWT Configuration
JWT_SECRET=your-very-long-and-secure-secret-key
JWT_EXPIRATION=86400000

# Database Configuration
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password

# Service Discovery
EUREKA_SERVER_URL=http://your-eureka-server:8761/eureka
```

### Docker Production

Use `docker-compose.prod.yml` for production deployment with:
- External MySQL databases
- Load balancers
- Environment-specific configurations
- Health checks and restart policies

## 📚 API Reference

### User Service Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - Get user profile
- `POST /api/admin/users/{id}/make-admin` - Promote user to admin

### Movie Service Endpoints

- `GET /api/movies` - List all movies
- `GET /api/movies/{id}` - Get movie by ID
- `GET /api/movies/search?title={title}` - Search movies
- `POST /api/admin/movies` - Create movie (Admin)
- `PUT /api/admin/movies/{id}` - Update movie (Admin)
- `DELETE /api/admin/movies/{id}` - Delete movie (Admin)

### Theater Service Endpoints

- `POST /api/admin/theaters` - Create theater (Admin)
- `GET /api/admin/theaters` - List theaters (Admin)
- `PUT /api/admin/theaters/{id}` - Update theater (Admin)
- `DELETE /api/admin/theaters/{id}` - Delete theater (Admin)

### Showtime Service Endpoints

- `GET /api/showtimes/movie/{movieId}` - Get showtimes for movie
- `GET /api/showtimes/{id}` - Get showtime by ID
- `POST /api/admin/showtimes` - Create showtime (Admin)
- `PUT /api/admin/showtimes/{id}` - Update showtime (Admin)
- `DELETE /api/admin/showtimes/{id}` - Delete showtime (Admin)

### Booking Service Endpoints

- `POST /api/bookings` - Book tickets
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/admin/bookings` - List all bookings (Admin)
- `GET /api/admin/bookings/user/{userId}` - Get user bookings (Admin)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Spring Cloud team for microservices tools
- Docker team for containerization platform

---

**MovieTix Microservices** - Built with ❤️ for learning and demonstration purposes.