package com.movietix.movie.controller;

import com.movietix.movie.dto.MovieRequest;
import com.movietix.movie.dto.MovieResponse;
import com.movietix.movie.service.MovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@Tag(name = "Movies", description = "Movie catalog management")
@SecurityRequirement(name = "bearerAuth")
public class MovieController {

    private final MovieService movieService;

    @GetMapping
    @Operation(summary = "Get all movies")
    public ResponseEntity<List<MovieResponse>> getAllMovies() {
        List<MovieResponse> movies = movieService.getAllMovies();
        return ResponseEntity.ok(movies);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get movie by ID")
    public ResponseEntity<MovieResponse> getMovieById(@PathVariable Long id) {
        MovieResponse movie = movieService.getMovieById(id);
        return ResponseEntity.ok(movie);
    }

    @GetMapping("/search")
    @Operation(summary = "Search movies by title")
    public ResponseEntity<List<MovieResponse>> searchMovies(@RequestParam String title) {
        List<MovieResponse> movies = movieService.searchMoviesByTitle(title);
        return ResponseEntity.ok(movies);
    }
}