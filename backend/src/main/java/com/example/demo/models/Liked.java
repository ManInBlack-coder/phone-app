package com.example.demo.models;

import javax.persistence.*;

@Entity
@Table(name = "liked")
public class Liked {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "kuulutus_id", nullable = false)
    private Long kuulutusId;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getKuulutusId() {
        return kuulutusId;
    }

    public void setKuulutusId(Long kuulutusId) {
        this.kuulutusId = kuulutusId;
    }
} 