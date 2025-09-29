package com.movietix.showtime.client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieDTO {
    private Long id;
    private String title;
    private String description;
    private String genre;
    private Integer durationInMinutes;
    private String releaseDate;
    private String posterUrl;
    private String trailerUrl;
}