package com.woodcraft.dto;

public class FurniturePreviewResponse {
    private String imageBase64;     // Base64 encoded image
    private String cacheKey;        // For future requests
    private boolean fromCache;      // Whether served from cache
    private long generationTimeMs;  // Time taken to generate

    // Constructors
    public FurniturePreviewResponse() {}

    public FurniturePreviewResponse(String imageBase64, String cacheKey, 
                                   boolean fromCache, long generationTimeMs) {
        this.imageBase64 = imageBase64;
        this.cacheKey = cacheKey;
        this.fromCache = fromCache;
        this.generationTimeMs = generationTimeMs;
    }

    // Getters and Setters
    public String getImageBase64() {
        return imageBase64;
    }

    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
    }

    public String getCacheKey() {
        return cacheKey;
    }

    public void setCacheKey(String cacheKey) {
        this.cacheKey = cacheKey;
    }

    public boolean isFromCache() {
        return fromCache;
    }

    public void setFromCache(boolean fromCache) {
        this.fromCache = fromCache;
    }

    public long getGenerationTimeMs() {
        return generationTimeMs;
    }

    public void setGenerationTimeMs(long generationTimeMs) {
        this.generationTimeMs = generationTimeMs;
    }

    @Override
    public String toString() {
        return "FurniturePreviewResponse{" +
                "imageBase64Length=" + (imageBase64 != null ? imageBase64.length() : 0) +
                ", cacheKey='" + cacheKey + '\'' +
                ", fromCache=" + fromCache +
                ", generationTimeMs=" + generationTimeMs +
                '}';
    }
}
