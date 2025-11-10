package com.woodcraft.dto;

public class FurniturePreviewRequest {
    private String furnitureType;  // "mesa", "cadeira", "estante", "armario", "rack"
    private String material;        // "madeira", "mdf", "mdp", "compensado"
    private String woodType;        // "carvalho", "pinus", "mogno", "cedro", "imbuia" (optional)
    private String color;           // hex color for MDF/MDP (optional)
    private String thickness;       // "15mm", "18mm", "25mm", "30mm"
    private String dimensions;      // "2m x 1m" (optional)
    private String description;     // detailed description from customer (optional)

    // Constructors
    public FurniturePreviewRequest() {}

    public FurniturePreviewRequest(String furnitureType, String material, String woodType, 
                                   String color, String thickness, String dimensions, String description) {
        this.furnitureType = furnitureType;
        this.material = material;
        this.woodType = woodType;
        this.color = color;
        this.thickness = thickness;
        this.dimensions = dimensions;
        this.description = description;
    }

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

    @Override
    public String toString() {
        return "FurniturePreviewRequest{" +
                "furnitureType='" + furnitureType + '\'' +
                ", material='" + material + '\'' +
                ", woodType='" + woodType + '\'' +
                ", color='" + color + '\'' +
                ", thickness='" + thickness + '\'' +
                ", dimensions='" + dimensions + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
