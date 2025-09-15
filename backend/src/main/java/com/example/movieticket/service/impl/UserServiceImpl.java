package com.example.movieticket.service.impl;

import com.example.movieticket.dto.user.UserResponse;
import com.example.movieticket.entity.Role;
import com.example.movieticket.entity.User;
import com.example.movieticket.exception.ResourceNotFoundException;
import com.example.movieticket.repository.UserRepository;
import com.example.movieticket.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;

	public UserServiceImpl(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	@Transactional
	public UserResponse makeAdmin(Long userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
		user.setRole(Role.ROLE_ADMIN);
		User saved = userRepository.save(user);
		return UserResponse.builder()
				.id(saved.getId())
				.name(saved.getName())
				.email(saved.getEmail())
				.role(saved.getRole().name())
				.build();
	}
}



