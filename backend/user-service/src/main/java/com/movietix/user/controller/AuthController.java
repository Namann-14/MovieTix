package com.movietix.user.controller;

import com.movietix.user.dto.*;
import com.movietix.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User authentication and registration")
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = userService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Login user")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/validate")
    @Operation(summary = "Validate JWT token", description = "Internal endpoint for API Gateway")
    public ResponseEntity<Boolean> validateToken(@RequestParam String token) {
        boolean isValid = userService.validateToken(token);
        return ResponseEntity.ok(isValid);
    }

    @GetMapping("/user")
    @Operation(summary = "Get user by token", description = "Internal endpoint for API Gateway")
    public ResponseEntity<UserResponse> getUserByToken(@RequestParam String token) {
        UserResponse user = userService.getUserByToken(token);
        return ResponseEntity.ok(user);
    }
}