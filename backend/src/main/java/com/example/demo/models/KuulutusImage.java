package com.example.demo.models;

import javax.persistence.*;

@Entity
@Table(name = "kuulutus_images")
public class KuulutusImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "kuulutus_id", nullable = false)
    private Kuulutus kuulutus;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Kuulutus getKuulutus() {
        return kuulutus;
    }

    public void setKuulutus(Kuulutus kuulutus) {
        this.kuulutus = kuulutus;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
} 