package com.woodcraft.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "proposals")
public class Proposal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long requestId;
    
    @Column(nullable = false)
    private Long woodworkerId;
    
    @Column(nullable = false)
    private String woodworkerName;
    
    @Column(nullable = false)
    private String price;
    
    @Column(length = 2000)
    private String message;
    
    @Column(length = 1000)
    private String imageUrls; // Comma-separated URLs
    
    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Constructors
    public Proposal() {}
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getRequestId() {
        return requestId;
    }
    
    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }
    
    public Long getWoodworkerId() {
        return woodworkerId;
    }
    
    public void setWoodworkerId(Long woodworkerId) {
        this.woodworkerId = woodworkerId;
    }
    
    public String getWoodworkerName() {
        return woodworkerName;
    }
    
    public void setWoodworkerName(String woodworkerName) {
        this.woodworkerName = woodworkerName;
    }
    
    public String getPrice() {
        return price;
    }
    
    public void setPrice(String price) {
        this.price = price;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getImageUrls() {
        return imageUrls;
    }
    
    public void setImageUrls(String imageUrls) {
        this.imageUrls = imageUrls;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
