package com.example.demo.models;

public class LikeRequest {
    private Integer userId;
    private Integer kuulutusId;

    // Getter for userId
    public Integer getUserId() {
        return userId;
    }

    // Setter for userId
    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    // Getter for kuulutusId
    public Integer getKuulutusId() {
        return kuulutusId;
    }

    // Setter for kuulutusId
    public void setKuulutusId(Integer kuulutusId) {
        this.kuulutusId = kuulutusId;
    }
}
