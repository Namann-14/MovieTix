package com.example.movieticket.dto.showtime;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ShowtimeRequest {

	@NotNull
	private Long movieId;

	@NotNull
	private Long theaterId;

	@NotNull
	private LocalDateTime showDateTime;

	@Min(0)
	private double ticketPrice;
}


