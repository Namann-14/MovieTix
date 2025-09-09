package com.example.movieticket.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

	@Value("${app.jwt.secret}")
	private String jwtSecret;

	@Value("${app.jwt.expiration-ms}")
	private long jwtExpirationMs;

	public String generateToken(String username, String role) {
		Date now = new Date();
		Date expiry = new Date(now.getTime() + jwtExpirationMs);
		return Jwts.builder()
				.setSubject(username)
				.claim("role", role)
				.setIssuedAt(now)
				.setExpiration(expiry)
				.signWith(getSigningKey(), SignatureAlgorithm.HS256)
				.compact();
	}

	public boolean validateToken(String token) {
		Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
		return true;
	}

	public String getUsernameFromToken(String token) {
		Claims claims = Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
		return claims.getSubject();
	}

	public String getRoleFromToken(String token) {
		Claims claims = Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
		Object role = claims.get("role");
		return role == null ? null : role.toString();
	}

	private Key getSigningKey() {
		byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
		return Keys.hmacShaKeyFor(keyBytes);
	}
}


