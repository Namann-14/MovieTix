package com.movietix.showtime.dto;

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
public class ShowtimeDTO {
    private Long id;
    private Long movieId;
    private String movieTitle;
    private Long theaterId;
    private String theaterName;
    private LocalDateTime showDateTime;
    private BigDecimal ticketPrice;
    private Integer availableSeats;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}