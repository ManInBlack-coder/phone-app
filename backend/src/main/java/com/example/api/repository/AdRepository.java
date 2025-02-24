package com.example.restfulapi.repository;

import com.example.restfulapi.model.Ad;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdRepository extends JpaRepository<Ad, Long> {
    // Custom queries if necessary
}
