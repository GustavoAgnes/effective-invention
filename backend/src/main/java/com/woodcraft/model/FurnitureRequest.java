package com.woodcraft.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "furniture_requests")
public class FurnitureRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long customerId;
    
    @Column(nullable = false)
    private String furnitureType;
    
    @Column(nullable = false)
    private String material;
    
    private String woodType;
    private String color;
    private String thickness;
    private String dimensions;
    
    @Column(length = 1000)
    private String description;
    
    private String budget;
    
    @Lob // Large object for base64 image (no size limit)
    @Column(columnDefinition = "CLOB")
    private String aiPreviewImage;
    
    @Column(nullable = false)
    private String status = "ACTIVE"; // ACTIVE, ACCEPTED, COMPLETED, CANCELLED
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt;
    
    // Constructors
    public FurnitureRequest() {}
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getCustomerId() {
        return customerId;
    }
    
    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }
    
    public String getFurnitureType() {
        return furnitureType;
    }
    
    public void setFurnitureType(String furnitureType) {
        this.furnitureType = furnitureType;
    }
    
    public String getMaterial() {
        return material;
    }
    
    public void setMaterial(String material) {
        this.material = material;
    }
    
    public String getWoodType() {
        return woodType;
    }
    
    public void setWoodType(String woodType) {
        this.woodType = woodType;
    }
    
    public String getColor() {
        return color;
    }
    
    public void setColor(String color) {
        this.color = color;
    }
    
    public String getThickness() {
        return thickness;
    }
    
    public void setThickness(String thickness) {
        this.thickness = thickness;
    }
    
    public String getDimensions() {
        return dimensions;
    }
    
    public void setDimensions(String dimensions) {
        this.dimensions = dimensions;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getBudget() {
        return budget;
    }
    
    public void setBudget(String budget) {
        this.budget = budget;
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
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public String getAiPreviewImage() {
        return aiPreviewImage;
    }
    
    public void setAiPreviewImage(String aiPreviewImage) {
        this.aiPreviewImage = aiPreviewImage;
    }
}
