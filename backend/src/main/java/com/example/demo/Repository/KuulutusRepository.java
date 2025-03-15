package com.example.demo.Repository;

import com.example.demo.models.Kuulutus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface KuulutusRepository extends JpaRepository<Kuulutus, Integer> {
    List<Kuulutus> findByUserEmail(String userEmail);
    List<Kuulutus> findByUserId(Integer userId);
    List<Kuulutus> findLikedKuulutusedByUserId(Integer userId);
} 
