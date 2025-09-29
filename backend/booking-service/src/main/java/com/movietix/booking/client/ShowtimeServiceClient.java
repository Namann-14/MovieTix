package com.movietix.booking.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "showtime-service", url = "${services.showtime-service.url:http://localhost:8084}")
public interface ShowtimeServiceClient {
    
    @GetMapping("/api/showtimes/{id}")
    ShowtimeDTO getShowtime(@PathVariable("id") Long id);
    
    @PutMapping("/api/showtimes/{id}/book-seats")
    void bookSeats(@PathVariable("id") Long showtimeId, @RequestParam("seats") Integer seats);
}