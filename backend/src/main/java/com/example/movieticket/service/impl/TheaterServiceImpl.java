package com.example.movieticket.service.impl;

import com.example.movieticket.dto.theater.TheaterRequest;
import com.example.movieticket.dto.theater.TheaterResponse;
import com.example.movieticket.entity.Theater;
import com.example.movieticket.exception.ResourceNotFoundException;
import com.example.movieticket.repository.TheaterRepository;
import com.example.movieticket.service.TheaterService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TheaterServiceImpl implements TheaterService {

	private final TheaterRepository theaterRepository;

	public TheaterServiceImpl(TheaterRepository theaterRepository) {
		this.theaterRepository = theaterRepository;
	}

	@Override
	@Transactional
	public TheaterResponse create(TheaterRequest request) {
		Theater theater = Theater.builder()
				.name(request.getName())
				.location(request.getLocation())
				.seatingCapacity(request.getSeatingCapacity())
				.build();
		return toResponse(theaterRepository.save(theater));
	}

	@Override
	public List<TheaterResponse> findAll() {
		return theaterRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
	}

	@Override
	@Transactional
	public TheaterResponse update(Long id, TheaterRequest request) {
		Theater theater = theaterRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Theater not found: " + id));
		theater.setName(request.getName());
		theater.setLocation(request.getLocation());
		theater.setSeatingCapacity(request.getSeatingCapacity());
		return toResponse(theaterRepository.save(theater));
	}

	@Override
	@Transactional
	public void delete(Long id) {
		if (!theaterRepository.existsById(id)) {
			throw new ResourceNotFoundException("Theater not found: " + id);
		}
		theaterRepository.deleteById(id);
	}

	private TheaterResponse toResponse(Theater theater) {
		return TheaterResponse.builder()
				.id(theater.getId())
				.name(theater.getName())
				.location(theater.getLocation())
				.seatingCapacity(theater.getSeatingCapacity())
				.build();
	}
}


