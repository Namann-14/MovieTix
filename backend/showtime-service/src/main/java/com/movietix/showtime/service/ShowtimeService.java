package com.movietix.showtime.service;

import com.movietix.showtime.client.MovieServiceClient;
import com.movietix.showtime.client.TheaterServiceClient;
import com.movietix.showtime.dto.CreateShowtimeRequest;
import com.movietix.showtime.dto.ShowtimeDTO;
import com.movietix.showtime.dto.UpdateShowtimeRequest;
import com.movietix.showtime.entity.Showtime;
import com.movietix.showtime.repository.ShowtimeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final MovieServiceClient movieServiceClient;
    private final TheaterServiceClient theaterServiceClient;

    @Transactional(readOnly = true)
    public List<ShowtimeDTO> getAllShowtimes() {
        log.info("Fetching all showtimes");
        List<Showtime> showtimes = showtimeRepository.findAll();
        return showtimes.stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<ShowtimeDTO> getShowtimeById(Long id) {
        log.info("Fetching showtime with id: {}", id);
        return showtimeRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public List<ShowtimeDTO> getShowtimesByMovieId(Long movieId) {
        log.info("Fetching showtimes for movie id: {}", movieId);
        try {
            List<Showtime> showtimes = showtimeRepository.findByMovieId(movieId);
            log.info("Found {} showtimes for movie id: {}", showtimes.size(), movieId);
            return showtimes.stream()
                    .map(this::convertToDTO)
                    .toList();
        } catch (Exception e) {
            log.error("Error fetching showtimes for movie id {}: {}", movieId, e.getMessage(), e);
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public List<ShowtimeDTO> getShowtimesByTheaterId(Long theaterId) {
        log.info("Fetching showtimes for theater id: {}", theaterId);
        List<Showtime> showtimes = showtimeRepository.findByTheaterId(theaterId);
        return showtimes.stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ShowtimeDTO> getUpcomingShowtimes() {
        log.info("Fetching upcoming showtimes");
        List<Showtime> showtimes = showtimeRepository.findUpcomingShowtimes(LocalDateTime.now());
        return showtimes.stream()
                .map(this::convertToDTO)
                .toList();
    }

    public ShowtimeDTO createShowtime(CreateShowtimeRequest request) {
        log.info("Creating new showtime for movie id: {} at theater id: {}", request.getMovieId(), request.getTheaterId());
        
        // Validate that movie and theater exist (optional - can be done via constraints)
        try {
            movieServiceClient.getMovie(request.getMovieId());
            theaterServiceClient.getTheater(request.getTheaterId());
        } catch (Exception e) {
            log.warn("Error validating movie or theater existence: {}", e.getMessage());
            // Continue anyway - let the database constraints handle it
        }

        Showtime showtime = Showtime.builder()
                .movieId(request.getMovieId())
                .theaterId(request.getTheaterId())
                .showDateTime(request.getShowDateTime())
                .ticketPrice(request.getTicketPrice())
                .availableSeats(request.getAvailableSeats())
                .build();

        Showtime savedShowtime = showtimeRepository.save(showtime);
        log.info("Created showtime with id: {}", savedShowtime.getId());
        
        return convertToDTO(savedShowtime);
    }

    public ShowtimeDTO updateShowtime(Long id, UpdateShowtimeRequest request) {
        log.info("Updating showtime with id: {}", id);
        
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found with id: " + id));

        if (request.getMovieId() != null) {
            showtime.setMovieId(request.getMovieId());
        }
        if (request.getTheaterId() != null) {
            showtime.setTheaterId(request.getTheaterId());
        }
        if (request.getShowDateTime() != null) {
            showtime.setShowDateTime(request.getShowDateTime());
        }
        if (request.getTicketPrice() != null) {
            showtime.setTicketPrice(request.getTicketPrice());
        }
        if (request.getAvailableSeats() != null) {
            showtime.setAvailableSeats(request.getAvailableSeats());
        }

        Showtime updatedShowtime = showtimeRepository.save(showtime);
        log.info("Updated showtime with id: {}", updatedShowtime.getId());
        
        return convertToDTO(updatedShowtime);
    }

    public void deleteShowtime(Long id) {
        log.info("Deleting showtime with id: {}", id);
        
        if (!showtimeRepository.existsById(id)) {
            throw new RuntimeException("Showtime not found with id: " + id);
        }

        showtimeRepository.deleteById(id);
        log.info("Deleted showtime with id: {}", id);
    }

    private ShowtimeDTO convertToDTO(Showtime showtime) {
        String movieTitle = "Unknown Movie";
        String theaterName = "Unknown Theater";

        try {
            movieTitle = movieServiceClient.getMovieTitle(showtime.getMovieId());
        } catch (Exception e) {
            log.warn("Error fetching movie title for id {}: {}", showtime.getMovieId(), e.getMessage());
        }

        try {
            theaterName = theaterServiceClient.getTheaterName(showtime.getTheaterId());
        } catch (Exception e) {
            log.warn("Error fetching theater info for id {}: {}", showtime.getTheaterId(), e.getMessage());
        }

        return ShowtimeDTO.builder()
                .id(showtime.getId())
                .movieId(showtime.getMovieId())
                .movieTitle(movieTitle)
                .theaterId(showtime.getTheaterId())
                .theaterName(theaterName)
                .showDateTime(showtime.getShowDateTime())
                .ticketPrice(showtime.getTicketPrice())
                .availableSeats(showtime.getAvailableSeats())
                .createdAt(showtime.getCreatedAt())
                .updatedAt(showtime.getUpdatedAt())
                .build();
    }
}