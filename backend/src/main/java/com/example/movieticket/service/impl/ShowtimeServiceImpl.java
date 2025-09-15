package com.example.movieticket.service.impl;

import com.example.movieticket.dto.showtime.ShowtimeRequest;
import com.example.movieticket.dto.showtime.ShowtimeResponse;
import com.example.movieticket.entity.Movie;
import com.example.movieticket.entity.Showtime;
import com.example.movieticket.entity.Theater;
import com.example.movieticket.exception.ResourceNotFoundException;
import com.example.movieticket.repository.BookingRepository;
import com.example.movieticket.repository.MovieRepository;
import com.example.movieticket.repository.ShowtimeRepository;
import com.example.movieticket.repository.TheaterRepository;
import com.example.movieticket.service.ShowtimeService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ShowtimeServiceImpl implements ShowtimeService {

	private final ShowtimeRepository showtimeRepository;
	private final MovieRepository movieRepository;
	private final TheaterRepository theaterRepository;
	private final BookingRepository bookingRepository;

	public ShowtimeServiceImpl(ShowtimeRepository showtimeRepository, MovieRepository movieRepository,
			TheaterRepository theaterRepository, BookingRepository bookingRepository) {
		this.showtimeRepository = showtimeRepository;
		this.movieRepository = movieRepository;
		this.theaterRepository = theaterRepository;
		this.bookingRepository = bookingRepository;
	}

	@Override
	@Transactional
	public ShowtimeResponse create(ShowtimeRequest request) {
		Movie movie = movieRepository.findById(request.getMovieId())
				.orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + request.getMovieId()));
		Theater theater = theaterRepository.findById(request.getTheaterId())
				.orElseThrow(() -> new ResourceNotFoundException("Theater not found: " + request.getTheaterId()));
		Showtime showtime = Showtime.builder()
				.movie(movie)
				.theater(theater)
				.showDateTime(request.getShowDateTime())
				.ticketPrice(request.getTicketPrice())
				.build();
		return toResponse(showtimeRepository.save(showtime));
	}

	@Override
	public List<ShowtimeResponse> findAll() {
		return showtimeRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
	}

	@Override
	public ShowtimeResponse findById(Long id) {
		Showtime showtime = showtimeRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Showtime not found: " + id));
		return toResponse(showtime);
	}

	@Override
	@Transactional
	public ShowtimeResponse update(Long id, ShowtimeRequest request) {
		Showtime showtime = showtimeRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Showtime not found: " + id));
		if (request.getMovieId() != null) {
			Movie movie = movieRepository.findById(request.getMovieId())
					.orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + request.getMovieId()));
			showtime.setMovie(movie);
		}
		if (request.getTheaterId() != null) {
			Theater theater = theaterRepository.findById(request.getTheaterId())
					.orElseThrow(() -> new ResourceNotFoundException("Theater not found: " + request.getTheaterId()));
			showtime.setTheater(theater);
		}
		showtime.setShowDateTime(request.getShowDateTime());
		showtime.setTicketPrice(request.getTicketPrice());
		return toResponse(showtimeRepository.save(showtime));
	}

	@Override
	@Transactional
	public void delete(Long id) {
		if (!showtimeRepository.existsById(id)) {
			throw new ResourceNotFoundException("Showtime not found: " + id);
		}
		showtimeRepository.deleteById(id);
	}

	@Override
	public List<ShowtimeResponse> findByMovie(Long movieId) {
		return showtimeRepository.findByMovie_Id(movieId).stream().map(this::toResponse).collect(Collectors.toList());
	}

	private ShowtimeResponse toResponse(Showtime showtime) {
		// Calculate available seats: theater capacity - total booked seats
		int bookedSeats = bookingRepository.findByShowtime_Id(showtime.getId())
				.stream()
				.mapToInt(booking -> booking.getNumberOfSeats())
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


