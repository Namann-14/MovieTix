package com.example.movieticket.dto.movie;

import java.time.LocalDate;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MovieResponse {
	private Long id;
	private String title;
	private String genre;
	private int durationInMinutes;
	private LocalDate releaseDate;
	private String description;
}


