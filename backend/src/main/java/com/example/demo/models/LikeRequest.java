package com.example.demo.models;

public class LikeRequest {
    private Long userId;
    private Long kuulutusId;

    // Getter for userId
    public Long getUserId() {
        return userId;
    }

    // Setter for userId
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    // Getter for kuulutusId
    public Long getKuulutusId() {
        return kuulutusId;
    }

    // Setter for kuulutusId
    public void setKuulutusId(Long kuulutusId) {
        this.kuulutusId = kuulutusId;
    }
}
