package com.movietix.movie.service;

import com.movietix.movie.dto.MovieRequest;
import com.movietix.movie.dto.MovieResponse;
import com.movietix.movie.entity.Movie;
import com.movietix.movie.exception.MovieNotFoundException;
import com.movietix.movie.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieResponse createMovie(MovieRequest request) {
        log.info("Creating movie with title: {}", request.getTitle());
        
        Movie movie = Movie.builder()
                .title(request.getTitle())
                .genre(request.getGenre())
                .durationInMinutes(request.getDurationInMinutes())
                .releaseDate(request.getReleaseDate())
                .description(request.getDescription())
                .build();

        Movie savedMovie = movieRepository.save(movie);
        log.info("Movie created successfully with ID: {}", savedMovie.getId());
        
        return mapToResponse(savedMovie);
    }

    @Transactional(readOnly = true)
    public List<MovieResponse> getAllMovies() {
        log.info("Fetching all movies");
        List<Movie> movies = movieRepository.findAll();
        return movies.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MovieResponse getMovieById(Long id) {
        log.info("Fetching movie with ID: {}", id);
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found with ID: " + id));
        return mapToResponse(movie);
    }

    public MovieResponse updateMovie(Long id, MovieRequest request) {
        log.info("Updating movie with ID: {}", id);
        
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found with ID: " + id));

        movie.setTitle(request.getTitle());
        movie.setGenre(request.getGenre());
        movie.setDurationInMinutes(request.getDurationInMinutes());
        movie.setReleaseDate(request.getReleaseDate());
        movie.setDescription(request.getDescription());

        Movie savedMovie = movieRepository.save(movie);
        log.info("Movie updated successfully with ID: {}", savedMovie.getId());
        
        return mapToResponse(savedMovie);
    }

    public void deleteMovie(Long id) {
        log.info("Deleting movie with ID: {}", id);
        
        if (!movieRepository.existsById(id)) {
            throw new MovieNotFoundException("Movie not found with ID: " + id);
        }

        movieRepository.deleteById(id);
        log.info("Movie deleted successfully with ID: {}", id);
    }

    @Transactional(readOnly = true)
    public List<MovieResponse> searchMoviesByTitle(String title) {
        log.info("Searching movies with title containing: {}", title);
        List<Movie> movies = movieRepository.findByTitleContainingIgnoreCase(title);
        return movies.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private MovieResponse mapToResponse(Movie movie) {
        return MovieResponse.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .genre(movie.getGenre())
                .durationInMinutes(movie.getDurationInMinutes())
                .releaseDate(movie.getReleaseDate())
                .description(movie.getDescription())
                .createdAt(movie.getCreatedAt())
                .updatedAt(movie.getUpdatedAt())
                .build();
    }
}