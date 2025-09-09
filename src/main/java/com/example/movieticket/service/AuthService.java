package com.example.movieticket.service;

import com.example.movieticket.dto.auth.JwtResponse;
import com.example.movieticket.dto.auth.LoginRequest;
import com.example.movieticket.dto.auth.RegisterRequest;

public interface AuthService {

	/**
	 * Registers a new user with ROLE_CUSTOMER and returns a JWT token.
	 * @param request registration payload
	 * @return jwt response containing token
	 */
	JwtResponse register(RegisterRequest request);

	/**
	 * Authenticates user by email/password and returns a JWT token.
	 * @param request login payload
	 * @return jwt response containing token
	 */
	JwtResponse login(LoginRequest request);
}


