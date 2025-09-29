package com.movietix.showtime.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "movie-service", url = "${services.movie-service.url:http://localhost:8083}")
public interface MovieServiceClient {
    
    @GetMapping("/api/movies/{id}")
    MovieDTO getMovie(@PathVariable("id") Long id);
    
    @GetMapping("/api/movies/{id}/title")
    String getMovieTitle(@PathVariable("id") Long id);
}