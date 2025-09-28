package com.movietix.user.controller;

import com.movietix.user.dto.UserResponse;
import com.movietix.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "User profile and admin operations")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    @GetMapping("/user/profile")
    @Operation(summary = "Get user profile")
    public ResponseEntity<UserResponse> getUserProfile(@RequestHeader("X-User-Id") Long userId) {
        UserResponse user = userService.getUserProfile(userId);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/admin/users/{userId}/make-admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Promote user to admin")
    public ResponseEntity<UserResponse> promoteToAdmin(@PathVariable Long userId) {
        UserResponse user = userService.promoteToAdmin(userId);
        return ResponseEntity.ok(user);
    }
}