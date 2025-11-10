package com.woodcraft.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rejected_requests")
public class RejectedRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long woodworkerId;
    
    @Column(nullable = false)
    private Long requestId;
    
    @Column(nullable = false)
    private LocalDateTime rejectedAt = LocalDateTime.now();
    
    // Constructors
    public RejectedRequest() {}
    
    public RejectedRequest(Long woodworkerId, Long requestId) {
        this.woodworkerId = woodworkerId;
        this.requestId = requestId;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getWoodworkerId() {
        return woodworkerId;
    }
    
    public void setWoodworkerId(Long woodworkerId) {
        this.woodworkerId = woodworkerId;
    }
    
    public Long getRequestId() {
        return requestId;
    }
    
    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }
    
    public LocalDateTime getRejectedAt() {
        return rejectedAt;
    }
    
    public void setRejectedAt(LocalDateTime rejectedAt) {
        this.rejectedAt = rejectedAt;
    }
}
