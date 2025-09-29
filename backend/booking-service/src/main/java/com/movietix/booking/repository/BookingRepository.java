package com.movietix.booking.repository;

import com.movietix.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Find bookings by user ID
    List<Booking> findByUserId(Long userId);
    
    // Find bookings by showtime ID
    List<Booking> findByShowtimeId(Long showtimeId);
    
    // Find bookings by user ID and status
    List<Booking> findByUserIdAndStatus(Long userId, Booking.BookingStatus status);
    
    // Find booking by booking reference
    Booking findByBookingReference(String bookingReference);
    
    // Count total bookings for a showtime
    @Query("SELECT COALESCE(SUM(b.numberOfSeats), 0) FROM Booking b WHERE b.showtimeId = :showtimeId AND b.status = 'CONFIRMED'")
    Integer countConfirmedSeatsForShowtime(@Param("showtimeId") Long showtimeId);
}