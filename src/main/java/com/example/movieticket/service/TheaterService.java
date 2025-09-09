package com.example.movieticket.service;

import com.example.movieticket.dto.theater.TheaterRequest;
import com.example.movieticket.dto.theater.TheaterResponse;
import java.util.List;

public interface TheaterService {

	TheaterResponse create(TheaterRequest request);

	List<TheaterResponse> findAll();

	TheaterResponse update(Long id, TheaterRequest request);

	void delete(Long id);
}


