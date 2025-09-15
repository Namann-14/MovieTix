package com.example.movieticket.dto.movie;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.Data;

@Data
public class MovieRequest {

	@NotBlank
	private String title;

	@NotBlank
	private String genre;

	@Min(1)
	private int durationInMinutes;

	@NotNull
	private LocalDate releaseDate;

	private String description;
}


