package com.example.movieticket.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "showtimes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Showtime {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "movie_id", nullable = false)
	private Movie movie;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "theater_id", nullable = false)
	private Theater theater;

	@Column(nullable = false)
	private LocalDateTime showDateTime;

	@Column(nullable = false)
	private double ticketPrice;
}


