package com.movietix.theater.controller;

import com.movietix.theater.dto.TheaterRequest;
import com.movietix.theater.dto.TheaterResponse;
import com.movietix.theater.service.TheaterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin/theaters")
@RequiredArgsConstructor
@Tag(name = "Admin - Theaters", description = "Admin theater management operations")
@SecurityRequirement(name = "bearerAuth")
public class AdminTheaterController {

    private final TheaterService theaterService;

    @PostMapping
    @Operation(summary = "Create a new theater")
    public ResponseEntity<TheaterResponse> createTheater(@Valid @RequestBody TheaterRequest request) {
        TheaterResponse theater = theaterService.createTheater(request);
        return new ResponseEntity<>(theater, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all theaters")
    public ResponseEntity<List<TheaterResponse>> getAllTheaters() {
        List<TheaterResponse> theaters = theaterService.getAllTheaters();
        return ResponseEntity.ok(theaters);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get theater by ID")
    public ResponseEntity<TheaterResponse> getTheaterById(@PathVariable Long id) {
        TheaterResponse theater = theaterService.getTheaterById(id);
        return ResponseEntity.ok(theater);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update theater")
    public ResponseEntity<TheaterResponse> updateTheater(@PathVariable Long id, @Valid @RequestBody TheaterRequest request) {
        TheaterResponse theater = theaterService.updateTheater(id, request);
        return ResponseEntity.ok(theater);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete theater")
    public ResponseEntity<Void> deleteTheater(@PathVariable Long id) {
        theaterService.deleteTheater(id);
        return ResponseEntity.noContent().build();
    }
}