package com.movietix.showtime.controller;

import com.movietix.showtime.dto.CreateShowtimeRequest;
import com.movietix.showtime.dto.ShowtimeDTO;
import com.movietix.showtime.dto.UpdateShowtimeRequest;
import com.movietix.showtime.service.ShowtimeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/showtimes")
public class AdminShowtimeController {

    private final ShowtimeService showtimeService;

    public AdminShowtimeController(ShowtimeService showtimeService) {
        this.showtimeService = showtimeService;
    }

    @GetMapping
    public ResponseEntity<List<ShowtimeDTO>> getAllShowtimes() {
        List<ShowtimeDTO> showtimes = showtimeService.getAllShowtimes();
        return ResponseEntity.ok(showtimes);
    }

    @PostMapping
    public ResponseEntity<ShowtimeDTO> createShowtime(@Valid @RequestBody CreateShowtimeRequest request) {
        ShowtimeDTO showtime = showtimeService.createShowtime(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(showtime);
    }

    // Fix: Add @PathVariable annotation with parameter name
    @PutMapping("/{id}")
    public ResponseEntity<ShowtimeDTO> updateShowtime(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateShowtimeRequest request) {
        ShowtimeDTO showtime = showtimeService.updateShowtime(id, request);
        return ResponseEntity.ok(showtime);
    }

    // Fix: Add @PathVariable annotation with parameter name
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShowtime(@PathVariable("id") Long id) {
        showtimeService.deleteShowtime(id);
        return ResponseEntity.noContent().build();
    }
}