package com.movietix.movie.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieResponse {
    private Long id;
    private String title;
    private String genre;
    private Integer durationInMinutes;
    private LocalDate releaseDate;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}