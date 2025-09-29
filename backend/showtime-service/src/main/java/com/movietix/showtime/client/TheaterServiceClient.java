package com.movietix.showtime.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "theater-service", url = "${services.theater-service.url:http://localhost:8084}")
public interface TheaterServiceClient {
    
    @GetMapping("/api/theaters/{id}")
    TheaterDTO getTheater(@PathVariable("id") Long id);
    
    @GetMapping("/api/theaters/{id}/name")
    String getTheaterName(@PathVariable("id") Long id);
    
    @GetMapping("/api/theaters/{id}/capacity")
    Integer getTheaterCapacity(@PathVariable("id") Long id);
}