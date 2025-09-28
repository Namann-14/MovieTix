package com.movietix.theater.service;

import com.movietix.theater.dto.TheaterRequest;
import com.movietix.theater.dto.TheaterResponse;
import com.movietix.theater.entity.Theater;
import com.movietix.theater.exception.TheaterNotFoundException;
import com.movietix.theater.repository.TheaterRepository;
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
public class TheaterService {

    private final TheaterRepository theaterRepository;

    public TheaterResponse createTheater(TheaterRequest request) {
        log.info("Creating theater with name: {}", request.getName());
        
        Theater theater = Theater.builder()
                .name(request.getName())
                .location(request.getLocation())
                .seatingCapacity(request.getSeatingCapacity())
                .build();

        Theater savedTheater = theaterRepository.save(theater);
        log.info("Theater created successfully with ID: {}", savedTheater.getId());
        
        return mapToResponse(savedTheater);
    }

    @Transactional(readOnly = true)
    public List<TheaterResponse> getAllTheaters() {
        log.info("Fetching all theaters");
        List<Theater> theaters = theaterRepository.findAll();
        return theaters.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TheaterResponse getTheaterById(Long id) {
        log.info("Fetching theater with ID: {}", id);
        Theater theater = theaterRepository.findById(id)
                .orElseThrow(() -> new TheaterNotFoundException("Theater not found with ID: " + id));
        return mapToResponse(theater);
    }

    public TheaterResponse updateTheater(Long id, TheaterRequest request) {
        log.info("Updating theater with ID: {}", id);
        
        Theater theater = theaterRepository.findById(id)
                .orElseThrow(() -> new TheaterNotFoundException("Theater not found with ID: " + id));

        theater.setName(request.getName());
        theater.setLocation(request.getLocation());
        theater.setSeatingCapacity(request.getSeatingCapacity());

        Theater savedTheater = theaterRepository.save(theater);
        log.info("Theater updated successfully with ID: {}", savedTheater.getId());
        
        return mapToResponse(savedTheater);
    }

    public void deleteTheater(Long id) {
        log.info("Deleting theater with ID: {}", id);
        
        if (!theaterRepository.existsById(id)) {
            throw new TheaterNotFoundException("Theater not found with ID: " + id);
        }

        theaterRepository.deleteById(id);
        log.info("Theater deleted successfully with ID: {}", id);
    }

    private TheaterResponse mapToResponse(Theater theater) {
        return TheaterResponse.builder()
                .id(theater.getId())
                .name(theater.getName())
                .location(theater.getLocation())
                .seatingCapacity(theater.getSeatingCapacity())
                .createdAt(theater.getCreatedAt())
                .updatedAt(theater.getUpdatedAt())
                .build();
    }
}