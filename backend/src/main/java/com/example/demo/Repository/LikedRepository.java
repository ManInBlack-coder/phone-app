package com.example.demo.Repository;

import com.example.demo.models.Kuulutus;
import com.example.demo.models.Liked;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikedRepository extends JpaRepository<Liked, Long> {
    List<Liked> findByUserId(Long userId);
    
    // New method to fetch Kuulutus based on liked entries
    @Query("SELECT k FROM Kuulutus k JOIN Liked l ON k.id = l.kuulutusId WHERE l.userId = :userId")
    List<Kuulutus> findKuulutusByUserId(@Param("userId") Long userId);

    Liked findByUserIdAndKuulutusId(Long userId, Long kuulutusId);
} 