package com.movietix.booking.controller;

import com.movietix.booking.dto.BookingDTO;
import com.movietix.booking.dto.CreateBookingRequest;
import com.movietix.booking.service.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Slf4j
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        log.info("Request to get all bookings");
        List<BookingDTO> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable("id") Long id) {
        log.info("Request to get booking with id: {}", id);
        return bookingService.getBookingById(id)
                .map(booking -> ResponseEntity.ok(booking))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingDTO>> getMyBookings(HttpServletRequest request) {
        log.info("Request to get my bookings");
        
        // Extract user ID from JWT token (you'll need to implement this)
        Long userId = extractUserIdFromRequest(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        List<BookingDTO> bookings = bookingService.getMyBookings(userId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingDTO>> getBookingsByUserId(@PathVariable("userId") Long userId) {
        log.info("Request to get bookings for user id: {}", userId);
        List<BookingDTO> bookings = bookingService.getBookingsByUserId(userId);
        return ResponseEntity.ok(bookings);
    }

    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            HttpServletRequest httpRequest) {
        log.info("Request to create booking for showtime: {}", request.getShowtimeId());
        
        // Extract user ID from JWT token
        Long userId = extractUserIdFromRequest(httpRequest);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            BookingDTO booking = bookingService.createBooking(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(booking);
        } catch (RuntimeException e) {
            log.error("Error creating booking: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BookingDTO> updateBookingStatus(
            @PathVariable("id") Long id,
            @RequestBody UpdateStatusRequest request) {
        log.info("Request to update booking {} status to: {}", id, request.getStatus());
        
        try {
            BookingDTO booking = bookingService.updateBookingStatus(id, request.getStatus());
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            log.error("Error updating booking status: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable("id") Long id) {
        log.info("Request to delete booking with id: {}", id);
        
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Error deleting booking: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Helper method to extract user ID from JWT token
    // This is a simplified version - in production, you'd use proper JWT parsing
    private Long extractUserIdFromRequest(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                // For now, return a hardcoded user ID
                // In production, you'd decode the JWT and extract the user ID
                log.info("Extracted user ID from token (hardcoded): 2");
                return 2L; // Hardcoded for now
            }
        } catch (Exception e) {
            log.error("Error extracting user ID from token: {}", e.getMessage());
        }
        return null;
    }

    // Inner class for update status request
    public static class UpdateStatusRequest {
        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}