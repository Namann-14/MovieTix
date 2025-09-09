package com.example.movieticket.dto.theater;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TheaterRequest {

	@NotBlank
	private String name;

	@NotBlank
	private String location;

	@Min(1)
	private int seatingCapacity;
}


