package com.movietix.theater.exception;

public class TheaterNotFoundException extends RuntimeException {
    public TheaterNotFoundException(String message) {
        super(message);
    }
}