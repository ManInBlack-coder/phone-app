package com.example.demo.Repository;

import com.example.demo.models.Kuulutus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KuulutusRepository extends JpaRepository<Kuulutus, Integer> {
} 