package com.example.movieticket.service.impl;

import com.example.movieticket.dto.auth.JwtResponse;
import com.example.movieticket.dto.auth.LoginRequest;
import com.example.movieticket.dto.auth.RegisterRequest;
import com.example.movieticket.entity.Role;
import com.example.movieticket.entity.User;
import com.example.movieticket.exception.BadRequestException;
import com.example.movieticket.repository.UserRepository;
import com.example.movieticket.security.JwtTokenProvider;
import com.example.movieticket.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtTokenProvider jwtTokenProvider;
	private final AuthenticationManager authenticationManager;

	public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
			JwtTokenProvider jwtTokenProvider, AuthenticationManager authenticationManager) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtTokenProvider = jwtTokenProvider;
		this.authenticationManager = authenticationManager;
	}

	@Override
	@Transactional
	public JwtResponse register(RegisterRequest request) {
		if (userRepository.existsByEmail(request.getEmail())) {
			throw new BadRequestException("Email already in use");
		}
		User user = User.builder()
				.name(request.getName())
				.email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword()))
				.role(Role.ROLE_CUSTOMER)
				.build();
		userRepository.save(user);
		String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());
		return new JwtResponse(token);
	}

	@Override
	public JwtResponse login(LoginRequest request) {
		Authentication auth = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
		org.springframework.security.core.userdetails.User principal =
				(org.springframework.security.core.userdetails.User) auth.getPrincipal();
		String role = principal.getAuthorities().iterator().next().getAuthority();
		String token = jwtTokenProvider.generateToken(principal.getUsername(), role);
		return new JwtResponse(token);
	}
}


