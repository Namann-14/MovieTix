package com.example.movieticket.service;

import com.example.movieticket.dto.showtime.ShowtimeRequest;
import com.example.movieticket.dto.showtime.ShowtimeResponse;
import java.util.List;

public interface ShowtimeService {

	ShowtimeResponse create(ShowtimeRequest request);

	List<ShowtimeResponse> findAll();

	ShowtimeResponse update(Long id, ShowtimeRequest request);

	void delete(Long id);

	List<ShowtimeResponse> findByMovie(Long movieId);
}


