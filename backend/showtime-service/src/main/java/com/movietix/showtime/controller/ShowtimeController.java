package com.movietix.showtime.controller;

import com.movietix.showtime.dto.ShowtimeDTO;
import com.movietix.showtime.service.ShowtimeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/showtimes")
public class ShowtimeController {

    private final ShowtimeService showtimeService;

    public ShowtimeController(ShowtimeService showtimeService) {
        this.showtimeService = showtimeService;
    }

    @GetMapping
    public ResponseEntity<List<ShowtimeDTO>> getAllShowtimes() {
        List<ShowtimeDTO> showtimes = showtimeService.getAllShowtimes();
        return ResponseEntity.ok(showtimes);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<ShowtimeDTO>> getUpcomingShowtimes() {
        List<ShowtimeDTO> showtimes = showtimeService.getUpcomingShowtimes();
        return ResponseEntity.ok(showtimes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShowtimeDTO> getShowtimeById(@PathVariable("id") Long id) {
        return showtimeService.getShowtimeById(id)
                .map(showtime -> ResponseEntity.ok(showtime))
                .orElse(ResponseEntity.notFound().build());
    }

    // Fix: Add @PathVariable annotation with parameter name
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ShowtimeDTO>> getShowtimesByMovie(@PathVariable("movieId") Long movieId) {
        List<ShowtimeDTO> showtimes = showtimeService.getShowtimesByMovieId(movieId);
        return ResponseEntity.ok(showtimes);
    }

    // Fix: Add @PathVariable annotation with parameter name
    @GetMapping("/theater/{theaterId}")
    public ResponseEntity<List<ShowtimeDTO>> getShowtimesByTheater(@PathVariable("theaterId") Long theaterId) {
        List<ShowtimeDTO> showtimes = showtimeService.getShowtimesByTheaterId(theaterId);
        return ResponseEntity.ok(showtimes);
    }
}