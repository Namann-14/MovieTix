package com.movietix.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDTO {
    private Long id;
    private Long userId;
    private Long showtimeId;
    private Integer numberOfSeats;
    private BigDecimal totalPrice;
    private String status;
    private String bookingReference;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Additional fields from related services
    private String movieTitle;
    private String theaterName;
    private LocalDateTime showDateTime;
    private BigDecimal ticketPrice;
}