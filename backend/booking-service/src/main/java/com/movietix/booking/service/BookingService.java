package com.movietix.booking.service;

import com.movietix.booking.client.ShowtimeDTO;
import com.movietix.booking.client.ShowtimeServiceClient;
import com.movietix.booking.client.UserDTO;
import com.movietix.booking.client.UserServiceClient;
import com.movietix.booking.dto.BookingDTO;
import com.movietix.booking.dto.CreateBookingRequest;
import com.movietix.booking.entity.Booking;
import com.movietix.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ShowtimeServiceClient showtimeServiceClient;
    private final UserServiceClient userServiceClient;

    @Transactional(readOnly = true)
    public List<BookingDTO> getAllBookings() {
        log.info("Fetching all bookings");
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<BookingDTO> getBookingById(Long id) {
        log.info("Fetching booking with id: {}", id);
        return bookingRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> getBookingsByUserId(Long userId) {
        log.info("Fetching bookings for user id: {}", userId);
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        return bookings.stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> getMyBookings(Long userId) {
        log.info("Fetching my bookings for user id: {}", userId);
        return getBookingsByUserId(userId);
    }

    public BookingDTO createBooking(CreateBookingRequest request, Long userId) {
        log.info("Creating booking for user {} - showtime: {}, seats: {}", 
                userId, request.getShowtimeId(), request.getNumberOfSeats());

        // Get showtime details
        ShowtimeDTO showtime;
        try {
            showtime = showtimeServiceClient.getShowtime(request.getShowtimeId());
        } catch (Exception e) {
            log.error("Error fetching showtime {}: {}", request.getShowtimeId(), e.getMessage());
            throw new RuntimeException("Showtime not found or unavailable");
        }

        // Check seat availability
        if (showtime.getAvailableSeats() < request.getNumberOfSeats()) {
            throw new RuntimeException("Not enough seats available");
        }

        // Calculate total price
        BigDecimal totalPrice = showtime.getTicketPrice()
                .multiply(BigDecimal.valueOf(request.getNumberOfSeats()));

        // Generate booking reference
        String bookingReference = generateBookingReference();

        // Create booking
        Booking booking = Booking.builder()
                .userId(userId)
                .showtimeId(request.getShowtimeId())
                .numberOfSeats(request.getNumberOfSeats())
                .totalPrice(totalPrice)
                .status(Booking.BookingStatus.CONFIRMED)
                .bookingReference(bookingReference)
                .build();

        try {
            // Update showtime seat availability (this would ideally be done atomically)
            // For now, we'll skip this step since the showtime service doesn't have this endpoint yet
            // showtimeServiceClient.bookSeats(request.getShowtimeId(), request.getNumberOfSeats());
            
            Booking savedBooking = bookingRepository.save(booking);
            log.info("Created booking with id: {} and reference: {}", 
                    savedBooking.getId(), savedBooking.getBookingReference());
            
            return convertToDTO(savedBooking);
        } catch (Exception e) {
            log.error("Error creating booking: {}", e.getMessage());
            throw new RuntimeException("Failed to create booking: " + e.getMessage());
        }
    }

    public BookingDTO updateBookingStatus(Long id, String status) {
        log.info("Updating booking {} status to: {}", id, status);
        
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        try {
            Booking.BookingStatus bookingStatus = Booking.BookingStatus.valueOf(status.toUpperCase());
            booking.setStatus(bookingStatus);
            
            Booking updatedBooking = bookingRepository.save(booking);
            log.info("Updated booking {} status to: {}", id, status);
            
            return convertToDTO(updatedBooking);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid booking status: " + status);
        }
    }

    public void deleteBooking(Long id) {
        log.info("Deleting booking with id: {}", id);
        
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found with id: " + id);
        }

        bookingRepository.deleteById(id);
        log.info("Deleted booking with id: {}", id);
    }

    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = BookingDTO.builder()
                .id(booking.getId())
                .userId(booking.getUserId())
                .showtimeId(booking.getShowtimeId())
                .numberOfSeats(booking.getNumberOfSeats())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus().name())
                .bookingReference(booking.getBookingReference())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();

        // Enrich with showtime details
        try {
            ShowtimeDTO showtime = showtimeServiceClient.getShowtime(booking.getShowtimeId());
            dto.setMovieTitle(showtime.getMovieTitle());
            dto.setTheaterName(showtime.getTheaterName());
            dto.setShowDateTime(showtime.getShowDateTime());
            dto.setTicketPrice(showtime.getTicketPrice());
        } catch (Exception e) {
            log.warn("Error fetching showtime details for booking {}: {}", booking.getId(), e.getMessage());
            dto.setMovieTitle("Unknown Movie");
            dto.setTheaterName("Unknown Theater");
        }

        return dto;
    }

    private String generateBookingReference() {
        return "BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}