package com.woodcraft.dto;

public class FurnitureRequestDTO {
    private String furnitureType;
    private String material;
    private String woodType;
    private String color;
    private String thickness;
    private String dimensions;
    private String description;
    private String budget;
    
    // Constructors
    public FurnitureRequestDTO() {}
    
    // Getters and Setters
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
}
