package com.example.movieticket.service;

import com.example.movieticket.dto.user.UserResponse;

public interface UserService {

	/**
	 * Promotes the given user to ROLE_ADMIN and returns updated user info.
	 * @param userId user identifier
	 * @return user response with new role
	 */
	UserResponse makeAdmin(Long userId);
}



