package com.example.movieticket.dto.booking;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingRequest {

	@NotNull
	private Long showtimeId;

	@Min(1)
	private int numberOfSeats;
}


