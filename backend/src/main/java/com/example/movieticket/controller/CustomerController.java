package com.example.movieticket.controller;

import com.example.movieticket.dto.booking.BookingRequest;
import com.example.movieticket.dto.booking.BookingResponse;
import com.example.movieticket.dto.movie.MovieResponse;
import com.example.movieticket.dto.showtime.ShowtimeResponse;
import com.example.movieticket.entity.User;
import com.example.movieticket.repository.UserRepository;
import com.example.movieticket.service.BookingService;
import com.example.movieticket.service.MovieService;
import com.example.movieticket.service.ShowtimeService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@PreAuthorize("hasRole('ROLE_CUSTOMER')")
public class CustomerController {

	private final MovieService movieService;
	private final ShowtimeService showtimeService;
	private final BookingService bookingService;
	private final UserRepository userRepository;

	public CustomerController(MovieService movieService, ShowtimeService showtimeService,
			BookingService bookingService, UserRepository userRepository) {
		this.movieService = movieService;
		this.showtimeService = showtimeService;
		this.bookingService = bookingService;
		this.userRepository = userRepository;
	}

	// Movie browsing
	@GetMapping("/movies")
	public List<MovieResponse> listMovies() {
		return movieService.findAll();
	}

	@GetMapping("/movies/{id}")
	public MovieResponse getMovie(@PathVariable Long id) {
		return movieService.findById(id);
	}

	@GetMapping("/movies/search")
	public List<MovieResponse> searchMovies(@RequestParam(name = "title", required = false) String title) {
		return movieService.searchByTitle(title);
	}

	// Showtimes
	@GetMapping("/showtimes/movie/{movieId}")
	public List<ShowtimeResponse> showtimesByMovie(@PathVariable Long movieId) {
		return showtimeService.findByMovie(movieId);
	}

	@GetMapping("/showtimes/{id}")
	public ShowtimeResponse getShowtime(@PathVariable Long id) {
		return showtimeService.findById(id);
	}

	// Bookings
	@PostMapping("/bookings")
	public ResponseEntity<BookingResponse> book(@Valid @RequestBody BookingRequest request, Principal principal) {
		User user = userRepository.findByEmail(principal.getName()).orElseThrow();
		return new ResponseEntity<>(bookingService.bookForUser(user.getId(), request), HttpStatus.CREATED);
	}

	@GetMapping("/bookings/my-bookings")
	public List<BookingResponse> myBookings(Principal principal) {
		User user = userRepository.findByEmail(principal.getName()).orElseThrow();
		return bookingService.findByUser(user.getId());
	}
}


