package com.example.demo.Repository;

import com.example.demo.models.KuulutusImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KuulutusImageRepository extends JpaRepository<KuulutusImage, Integer> {
} 