package com.example.movieticket.controller;

import com.example.movieticket.dto.booking.BookingResponse;
import com.example.movieticket.dto.movie.MovieRequest;
import com.example.movieticket.dto.movie.MovieResponse;
import com.example.movieticket.dto.showtime.ShowtimeRequest;
import com.example.movieticket.dto.showtime.ShowtimeResponse;
import com.example.movieticket.dto.theater.TheaterRequest;
import com.example.movieticket.dto.theater.TheaterResponse;
import com.example.movieticket.dto.user.UserResponse;
import com.example.movieticket.service.BookingService;
import com.example.movieticket.service.MovieService;
import com.example.movieticket.service.ShowtimeService;
import com.example.movieticket.service.TheaterService;
import com.example.movieticket.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {

	private final MovieService movieService;
	private final TheaterService theaterService;
	private final ShowtimeService showtimeService;
	private final BookingService bookingService;
	private final UserService userService;

	public AdminController(MovieService movieService, TheaterService theaterService,
			ShowtimeService showtimeService, BookingService bookingService, UserService userService) {
		this.movieService = movieService;
		this.theaterService = theaterService;
		this.showtimeService = showtimeService;
		this.bookingService = bookingService;
		this.userService = userService;
	}

	// Movies
	@PostMapping("/movies")
	public ResponseEntity<MovieResponse> createMovie(@Valid @RequestBody MovieRequest request) {
		return new ResponseEntity<>(movieService.create(request), HttpStatus.CREATED);
	}

	@GetMapping("/movies")
	public List<MovieResponse> getMovies() {
		return movieService.findAll();
	}

	@GetMapping("/movies/{id}")
	public MovieResponse getMovie(@PathVariable Long id) {
		return movieService.findById(id);
	}

	@PutMapping("/movies/{id}")
	public MovieResponse updateMovie(@PathVariable Long id, @Valid @RequestBody MovieRequest request) {
		return movieService.update(id, request);
	}

	@DeleteMapping("/movies/{id}")
	public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
		movieService.delete(id);
		return ResponseEntity.noContent().build();
	}

	// Theaters
	@PostMapping("/theaters")
	public ResponseEntity<TheaterResponse> createTheater(@Valid @RequestBody TheaterRequest request) {
		return new ResponseEntity<>(theaterService.create(request), HttpStatus.CREATED);
	}

	@GetMapping("/theaters")
	public List<TheaterResponse> getTheaters() {
		return theaterService.findAll();
	}

	@PutMapping("/theaters/{id}")
	public TheaterResponse updateTheater(@PathVariable Long id, @Valid @RequestBody TheaterRequest request) {
		return theaterService.update(id, request);
	}

	@DeleteMapping("/theaters/{id}")
	public ResponseEntity<Void> deleteTheater(@PathVariable Long id) {
		theaterService.delete(id);
		return ResponseEntity.noContent().build();
	}

	// Showtimes
	@PostMapping("/showtimes")
	public ResponseEntity<ShowtimeResponse> createShowtime(@Valid @RequestBody ShowtimeRequest request) {
		return new ResponseEntity<>(showtimeService.create(request), HttpStatus.CREATED);
	}

	@GetMapping("/showtimes")
	public List<ShowtimeResponse> getShowtimes() {
		return showtimeService.findAll();
	}

	@PutMapping("/showtimes/{id}")
	public ShowtimeResponse updateShowtime(@PathVariable Long id, @Valid @RequestBody ShowtimeRequest request) {
		return showtimeService.update(id, request);
	}

	@DeleteMapping("/showtimes/{id}")
	public ResponseEntity<Void> deleteShowtime(@PathVariable Long id) {
		showtimeService.delete(id);
		return ResponseEntity.noContent().build();
	}

	// Bookings overview
	@GetMapping("/bookings")
	public List<BookingResponse> getAllBookings() {
		return bookingService.findAll();
	}

	@GetMapping("/bookings/user/{userId}")
	public List<BookingResponse> getBookingsByUser(@PathVariable Long userId) {
		return bookingService.findByUser(userId);
	}

	// Users
	@PostMapping("/users/{userId}/make-admin")
	public UserResponse makeUserAdmin(@PathVariable Long userId) {
		return userService.makeAdmin(userId);
	}
}


