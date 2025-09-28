#!/bin/bash

# MovieTix Microservices Build Script

echo "🚀 Building MovieTix Microservices..."
echo "======================================"

# Build parent project
echo "📦 Building parent project..."
mvn clean package -DskipTests

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo ""
    echo "🐳 Building Docker images..."
    
    # Build Docker images for each service
    services=("eureka-server" "config-server" "api-gateway" "user-service" "movie-service" "theater-service" "showtime-service" "booking-service")
    
    for service in "${services[@]}"; do
        echo "🔨 Building $service..."
        cd "$service"
        docker build -t "movietix/$service:latest" .
        cd ..
    done
    
    echo ""
    echo "✅ All Docker images built successfully!"
    echo ""
    echo "🚀 To start the application, run:"
    echo "   docker-compose up -d"
    echo ""
    echo "📝 API Documentation will be available at:"
    echo "   http://localhost:8080/swagger-ui.html"
    echo ""
    echo "🔍 Service Discovery at:"
    echo "   http://localhost:8761"
    
else
    echo "❌ Build failed!"
    exit 1
fi