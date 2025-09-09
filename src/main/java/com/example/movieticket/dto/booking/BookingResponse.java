package com.example.movieticket.dto.booking;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingResponse {
	private Long id;
	private Long userId;
	private Long showtimeId;
	private int numberOfSeats;
	private LocalDateTime bookingTime;
	private double totalPrice;
}


