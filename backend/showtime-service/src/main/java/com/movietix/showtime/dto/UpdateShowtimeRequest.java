package com.movietix.showtime.dto;

import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateShowtimeRequest {
    private Long movieId;
    private Long theaterId;
    private LocalDateTime showDateTime;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Ticket price must be greater than 0")
    private BigDecimal ticketPrice;
    
    private Integer availableSeats;
}