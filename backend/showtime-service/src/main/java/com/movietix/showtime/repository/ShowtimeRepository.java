package com.movietix.showtime.repository;

import com.movietix.showtime.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    
    // Find showtimes by movie ID
    List<Showtime> findByMovieId(Long movieId);
    
    // Find showtimes by theater ID
    List<Showtime> findByTheaterId(Long theaterId);
    
    // Find showtimes by movie and theater
    List<Showtime> findByMovieIdAndTheaterId(Long movieId, Long theaterId);
    
    // Find showtimes by date range
    List<Showtime> findByShowDateTimeBetween(LocalDateTime start, LocalDateTime end);
    
    // Find upcoming showtimes (after current time)
    @Query("SELECT s FROM Showtime s WHERE s.showDateTime > :currentTime ORDER BY s.showDateTime ASC")
    List<Showtime> findUpcomingShowtimes(@Param("currentTime") LocalDateTime currentTime);
    
    // Find showtimes by movie ID and after specific date
    @Query("SELECT s FROM Showtime s WHERE s.movieId = :movieId AND s.showDateTime > :fromDate ORDER BY s.showDateTime ASC")
    List<Showtime> findByMovieIdAndShowDateTimeAfter(@Param("movieId") Long movieId, @Param("fromDate") LocalDateTime fromDate);
    
    // Find showtimes by theater ID and date range
    @Query("SELECT s FROM Showtime s WHERE s.theaterId = :theaterId AND s.showDateTime BETWEEN :start AND :end ORDER BY s.showDateTime ASC")
    List<Showtime> findByTheaterIdAndDateRange(@Param("theaterId") Long theaterId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}