# MovieTix - Complete Movie Booking Application

MovieTix is a full-stack movie booking application built with a microservices architecture, featuring a Next.js frontend and Spring Boot backend services.

## 🏗️ Architecture

### Frontend
- **Next.js 15** - React framework for the user interface
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **pnpm** - Fast, disk space efficient package manager

### Backend (Microservices)
- **Spring Boot** - Java framework for microservices
- **Spring Cloud** - Microservices coordination
- **Eureka Server** - Service discovery
- **Config Server** - Centralized configuration
- **API Gateway** - Single entry point for all services

### Services
1. **User Service** (Port 8081) - User management and authentication
2. **Movie Service** (Port 8082) - Movie catalog management
3. **Theater Service** (Port 8083) - Theater and cinema management
4. **Showtime Service** (Port 8084) - Movie showtime scheduling
5. **Booking Service** (Port 8085) - Ticket booking and reservations

### Database
- **MySQL 8.0** - Separate database for each microservice
- Each service has its own dedicated database instance

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Running the Application

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd movietix
   ```

2. **Start the application:**
   ```bash
   # On Windows:
   ./start-app.bat
   
   # On Linux/Mac:
   ./start-app.sh
   
   # Or manually:
   docker-compose up -d
   ```

3. **Access the application:**
   - **Frontend**: http://localhost:3000
   - **API Gateway**: http://localhost:8080
   - **Eureka Dashboard**: http://localhost:8761

### Stopping the Application
```bash
docker-compose down
```

## 🌐 Service Endpoints

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| Frontend | 3000 | http://localhost:3000 | Next.js user interface |
| API Gateway | 8080 | http://localhost:8080 | Main API entry point |
| Eureka Server | 8761 | http://localhost:8761 | Service discovery dashboard |
| Config Server | 8888 | http://localhost:8888 | Configuration management |
| User Service | 8081 | http://localhost:8081 | User management API |
| Movie Service | 8082 | http://localhost:8082 | Movie catalog API |
| Theater Service | 8083 | http://localhost:8083 | Theater management API |
| Showtime Service | 8084 | http://localhost:8084 | Showtime scheduling API |
| Booking Service | 8085 | http://localhost:8085 | Booking management API |

## 💾 Database Connections

| Database | Port | Connection String |
|----------|------|-------------------|
| User DB | 3316 | `jdbc:mysql://localhost:3316/user_service_db` |
| Movie DB | 3307 | `jdbc:mysql://localhost:3307/movie_service_db` |
| Theater DB | 3308 | `jdbc:mysql://localhost:3308/theater_service_db` |
| Showtime DB | 3309 | `jdbc:mysql://localhost:3309/showtime_service_db` |
| Booking DB | 3310 | `jdbc:mysql://localhost:3310/booking_service_db` |

**Database Credentials:**
- Root Password: `1234567890`
- Service Users: `<service_name>_service` (e.g., `user_service`)
- Service Passwords: `<service_name>password` (e.g., `userpassword`)

## 🔧 Development

### Project Structure
```
movietix/
├── frontend/                 # Next.js application
├── backend/                  # Spring Boot microservices
│   ├── eureka-server/       # Service discovery
│   ├── config-server/       # Configuration server
│   ├── api-gateway/         # API gateway
│   ├── user-service/        # User management
│   ├── movie-service/       # Movie catalog
│   ├── theater-service/     # Theater management
│   ├── showtime-service/    # Showtime scheduling
│   └── booking-service/     # Booking management
├── docker-compose.yml       # Complete application orchestration
├── start-app.bat           # Windows startup script
└── start-app.sh            # Linux/Mac startup script
```

### Adding New Services
1. Create service directory in `backend/`
2. Add Dockerfile to the new service
3. Update `docker-compose.yml` with the new service
4. Add database configuration if needed

### Environment Variables
Services can be configured using environment variables in the `docker-compose.yml` file:
- `SPRING_PROFILES_ACTIVE=docker` - Activates Docker profile
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE` - Eureka server URL
- `SPRING_CLOUD_CONFIG_URI` - Config server URL

## 📋 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure no other applications are using the required ports
2. **Docker issues**: Make sure Docker is running and has sufficient resources
3. **Service startup order**: Services depend on Eureka and Config servers - they start automatically in the correct order

### Checking Service Health
```bash
# View all containers
docker ps

# Check specific service logs
docker logs <container-name>

# Example: Check frontend logs
docker logs movietix-frontend
```

### Rebuilding Services
```bash
# Rebuild all services
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build <service-name>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.