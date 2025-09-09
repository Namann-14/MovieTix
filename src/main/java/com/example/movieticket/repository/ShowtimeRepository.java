package com.example.movieticket.repository;

import com.example.movieticket.entity.Showtime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
	List<Showtime> findByMovie_Id(Long movieId);
}


