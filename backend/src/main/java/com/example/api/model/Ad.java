package com.example.api.model; // Muudetud samaks paketiks kui User.java

import javax.persistence.*;

@Entity
@Table(name = "kuulutus")
public class Ad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "category", nullable = false)
    private String category;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true) // nullable=true, kuna user_id on tabelis NULL lubatud
    private User user;

    // Default constructor
    public Ad() {}

    // Constructor with parameters
    public Ad(String title, Double price, String category, User user) {
        this.title = title;
        this.price = price;
        this.category = category;
        this.user = user;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}