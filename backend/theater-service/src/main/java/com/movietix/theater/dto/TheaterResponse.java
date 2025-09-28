package com.movietix.theater.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TheaterResponse {
    private Long id;
    private String name;
    private String location;
    private Integer seatingCapacity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}