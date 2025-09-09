package com.example.movieticket.dto.theater;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TheaterResponse {
	private Long id;
	private String name;
	private String location;
	private int seatingCapacity;
}


