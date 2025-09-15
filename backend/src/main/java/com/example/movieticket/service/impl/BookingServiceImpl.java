package com.example.movieticket.service.impl;

import com.example.movieticket.dto.booking.BookingRequest;
import com.example.movieticket.dto.booking.BookingResponse;
import com.example.movieticket.dto.showtime.ShowtimeResponse;
import com.example.movieticket.entity.Booking;
import com.example.movieticket.entity.Showtime;
import com.example.movieticket.entity.User;
import com.example.movieticket.exception.ResourceNotFoundException;
import com.example.movieticket.repository.BookingRepository;
import com.example.movieticket.repository.ShowtimeRepository;
import com.example.movieticket.repository.UserRepository;
import com.example.movieticket.service.BookingService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingServiceImpl implements BookingService {

	private final BookingRepository bookingRepository;
	private final ShowtimeRepository showtimeRepository;
	private final UserRepository userRepository;

	public BookingServiceImpl(BookingRepository bookingRepository, ShowtimeRepository showtimeRepository,
			UserRepository userRepository) {
		this.bookingRepository = bookingRepository;
		this.showtimeRepository = showtimeRepository;
		this.userRepository = userRepository;
	}

	@Override
	@Transactional
	public BookingResponse bookForUser(Long userId, BookingRequest request) {
		User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
		Showtime showtime = showtimeRepository.findById(request.getShowtimeId())
				.orElseThrow(() -> new ResourceNotFoundException("Showtime not found: " + request.getShowtimeId()));
		double total = request.getNumberOfSeats() * showtime.getTicketPrice();
		Booking booking = Booking.builder()
				.user(user)
				.showtime(showtime)
				.numberOfSeats(request.getNumberOfSeats())
				.totalPrice(total)
				.build();
		return toResponse(bookingRepository.save(booking));
	}

	@Override
	public List<BookingResponse> findByUser(Long userId) {
		return bookingRepository.findByUser_Id(userId).stream().map(this::toResponse).collect(Collectors.toList());
	}

	@Override
	public List<BookingResponse> findAll() {
		return bookingRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
	}

	private BookingResponse toResponse(Booking booking) {
		ShowtimeResponse showtimeResponse = toShowtimeResponse(booking.getShowtime());
		
		return BookingResponse.builder()
				.id(booking.getId())
				.userId(booking.getUser().getId())
				.showtimeId(booking.getShowtime().getId())
				.numberOfSeats(booking.getNumberOfSeats())
				.bookingTime(booking.getBookingTime())
				.totalPrice(booking.getTotalPrice())
				.showtime(showtimeResponse)
				.build();
	}

	private ShowtimeResponse toShowtimeResponse(Showtime showtime) {
		// Calculate available seats
		int bookedSeats = bookingRepository.findByShowtime_Id(showtime.getId())
				.stream()
				.mapToInt(Booking::getNumberOfSeats)
				.sum();
		int availableSeats = showtime.getTheater().getSeatingCapacity() - bookedSeats;

		return ShowtimeResponse.builder()
				.id(showtime.getId())
				.movieId(showtime.getMovie().getId())
				.movieTitle(showtime.getMovie().getTitle())
				.theaterId(showtime.getTheater().getId())
				.theaterName(showtime.getTheater().getName())
				.showDateTime(showtime.getShowDateTime())
				.ticketPrice(showtime.getTicketPrice())
				.availableSeats(availableSeats)
				.build();
	}
}


