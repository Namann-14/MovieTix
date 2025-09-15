package com.example.movieticket.service;

import com.example.movieticket.dto.booking.BookingRequest;
import com.example.movieticket.dto.booking.BookingResponse;
import java.util.List;

public interface BookingService {

	BookingResponse bookForUser(Long userId, BookingRequest request);

	List<BookingResponse> findByUser(Long userId);

	List<BookingResponse> findAll();
}


