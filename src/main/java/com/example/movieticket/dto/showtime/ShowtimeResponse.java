package com.example.movieticket.dto.showtime;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ShowtimeResponse {
	private Long id;
	private Long movieId;
	private String movieTitle;
	private Long theaterId;
	private String theaterName;
	private LocalDateTime showDateTime;
	private double ticketPrice;
}


