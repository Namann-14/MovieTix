package com.example.movieticket.service.impl;

import com.example.movieticket.dto.movie.MovieRequest;
import com.example.movieticket.dto.movie.MovieResponse;
import com.example.movieticket.entity.Movie;
import com.example.movieticket.exception.ResourceNotFoundException;
import com.example.movieticket.repository.MovieRepository;
import com.example.movieticket.service.MovieService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MovieServiceImpl implements MovieService {

	private final MovieRepository movieRepository;

	public MovieServiceImpl(MovieRepository movieRepository) {
		this.movieRepository = movieRepository;
	}

	@Override
	@Transactional
	public MovieResponse create(MovieRequest request) {
		Movie movie = Movie.builder()
				.title(request.getTitle())
				.genre(request.getGenre())
				.durationInMinutes(request.getDurationInMinutes())
				.releaseDate(request.getReleaseDate())
				.description(request.getDescription())
				.build();
		return toResponse(movieRepository.save(movie));
	}

	@Override
	public List<MovieResponse> findAll() {
		return movieRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
	}

	@Override
	public MovieResponse findById(Long id) {
		Movie movie = movieRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + id));
		return toResponse(movie);
	}

	@Override
	@Transactional
	public MovieResponse update(Long id, MovieRequest request) {
		Movie movie = movieRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + id));
		movie.setTitle(request.getTitle());
		movie.setGenre(request.getGenre());
		movie.setDurationInMinutes(request.getDurationInMinutes());
		movie.setReleaseDate(request.getReleaseDate());
		movie.setDescription(request.getDescription());
		return toResponse(movieRepository.save(movie));
	}

	@Override
	@Transactional
	public void delete(Long id) {
		if (!movieRepository.existsById(id)) {
			throw new ResourceNotFoundException("Movie not found: " + id);
		}
		movieRepository.deleteById(id);
	}

	@Override
	public List<MovieResponse> searchByTitle(String title) {
		return movieRepository.findByTitleContainingIgnoreCase(title == null ? "" : title)
				.stream().map(this::toResponse).collect(Collectors.toList());
	}

	private MovieResponse toResponse(Movie movie) {
		return MovieResponse.builder()
				.id(movie.getId())
				.title(movie.getTitle())
				.genre(movie.getGenre())
				.durationInMinutes(movie.getDurationInMinutes())
				.releaseDate(movie.getReleaseDate())
				.description(movie.getDescription())
				.build();
	}
}


