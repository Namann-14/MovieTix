package com.movietix.showtime.client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TheaterDTO {
    private Long id;
    private String name;
    private String location;
    private Integer seatingCapacity;
}