package com.movietix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.movietix", "com.example.movieticket"})
@EntityScan(basePackages = {"com.example.movieticket.entity"})
@EnableJpaRepositories(basePackages = {"com.example.movieticket.repository"})
public class MovieTicketSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(MovieTicketSystemApplication.class, args);
	}

}
