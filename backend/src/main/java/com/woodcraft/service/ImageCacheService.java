package com.woodcraft.service;

import com.woodcraft.dto.FurniturePreviewRequest;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class ImageCacheService {
    
    private static final int MAX_CACHE_SIZE = 100;
    private final Map<String, byte[]> cache = new LinkedHashMap<String, byte[]>(MAX_CACHE_SIZE, 0.75f, true) {
        @Override
        protected boolean removeEldestEntry(Map.Entry<String, byte[]> eldest) {
            return size() > MAX_CACHE_SIZE;
        }
    };

    public String generateCacheKey(FurniturePreviewRequest request) {
        String key = String.format("%s_%s_%s_%s_%s_%s",
                request.getFurnitureType(),
                request.getMaterial(),
                request.getWoodType() != null ? request.getWoodType() : "",
                request.getColor() != null ? request.getColor() : "",
                request.getThickness(),
                request.getDimensions() != null ? request.getDimensions() : ""
        );
        
        return md5Hash(key);
    }

    public Optional<byte[]> getFromCache(String key) {
        return Optional.ofNullable(cache.get(key));
    }

    public void putInCache(String key, byte[] image) {
        cache.put(key, image);
    }

    private String md5Hash(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hashBytes = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            return input.hashCode() + "";
        }
    }
}
