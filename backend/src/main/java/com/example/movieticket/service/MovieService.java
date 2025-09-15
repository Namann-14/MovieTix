package com.example.movieticket.service;

import com.example.movieticket.dto.movie.MovieRequest;
import com.example.movieticket.dto.movie.MovieResponse;
import java.util.List;

public interface MovieService {

	/** Creates a movie. */
	MovieResponse create(MovieRequest request);

	/** Returns all movies. */
	List<MovieResponse> findAll();

	/** Returns movie by id. */
	MovieResponse findById(Long id);

	/** Updates existing movie by id. */
	MovieResponse update(Long id, MovieRequest request);

	/** Deletes movie by id. */
	void delete(Long id);

	/** Searches movies by title (case-insensitive, contains). */
	List<MovieResponse> searchByTitle(String title);
}


