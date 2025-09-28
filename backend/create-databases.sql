-- Create databases for MovieTix microservices
CREATE DATABASE IF NOT EXISTS user_service_db;
CREATE DATABASE IF NOT EXISTS movie_service_db;
CREATE DATABASE IF NOT EXISTS theater_service_db;
CREATE DATABASE IF NOT EXISTS showtime_service_db;
CREATE DATABASE IF NOT EXISTS booking_service_db;

-- Create users with proper privileges
CREATE USER IF NOT EXISTS 'user_service'@'localhost' IDENTIFIED BY 'user_password';
CREATE USER IF NOT EXISTS 'movie_service'@'localhost' IDENTIFIED BY 'movie_password';
CREATE USER IF NOT EXISTS 'theater_service'@'localhost' IDENTIFIED BY 'theater_password';
CREATE USER IF NOT EXISTS 'showtime_service'@'localhost' IDENTIFIED BY 'showtime_password';
CREATE USER IF NOT EXISTS 'booking_service'@'localhost' IDENTIFIED BY 'booking_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON user_service_db.* TO 'user_service'@'localhost';
GRANT ALL PRIVILEGES ON movie_service_db.* TO 'movie_service'@'localhost';
GRANT ALL PRIVILEGES ON theater_service_db.* TO 'theater_service'@'localhost';
GRANT ALL PRIVILEGES ON showtime_service_db.* TO 'showtime_service'@'localhost';
GRANT ALL PRIVILEGES ON booking_service_db.* TO 'booking_service'@'localhost';

-- Refresh privileges
FLUSH PRIVILEGES;

-- Show created databases
SHOW DATABASES;