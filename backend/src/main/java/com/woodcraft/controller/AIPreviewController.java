package com.woodcraft.controller;

import com.woodcraft.dto.FurniturePreviewRequest;
import com.woodcraft.dto.FurniturePreviewResponse;
import com.woodcraft.service.HuggingFaceService;
import com.woodcraft.service.ImageCacheService;
import com.woodcraft.service.PromptBuilderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/furniture")
@CrossOrigin(origins = "http://localhost:3000")
public class AIPreviewController {
    
    private static final Logger logger = LoggerFactory.getLogger(AIPreviewController.class);
    
    @Autowired
    private PromptBuilderService promptBuilderService;
    
    @Autowired
    private ImageCacheService imageCacheService;
    
    @Autowired
    private HuggingFaceService huggingFaceService;
    
    @PostMapping("/preview")
    public ResponseEntity<?> generatePreview(@RequestBody FurniturePreviewRequest request) {
        long startTime = System.currentTimeMillis();
        
        try {
            logger.info("Received preview request: {}", request);
            
            // Generate cache key
            String cacheKey = imageCacheService.generateCacheKey(request);
            
            // Check cache first
            Optional<byte[]> cachedImage = imageCacheService.getFromCache(cacheKey);
            if (cachedImage.isPresent()) {
                logger.info("Serving image from cache");
                String base64Image = Base64.getEncoder().encodeToString(cachedImage.get());
                long duration = System.currentTimeMillis() - startTime;
                
                FurniturePreviewResponse response = new FurniturePreviewResponse(
                    base64Image, cacheKey, true, duration
                );
                return ResponseEntity.ok(response);
            }
            
            // Build prompt
            String prompt = promptBuilderService.buildPrompt(request);
            logger.info("Generated prompt: {}", prompt);
            
            // Generate image
            byte[] imageBytes = huggingFaceService.generateImage(prompt);
            
            // Cache the image
            imageCacheService.putInCache(cacheKey, imageBytes);
            
            // Convert to base64
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            long duration = System.currentTimeMillis() - startTime;
            
            FurniturePreviewResponse response = new FurniturePreviewResponse(
                base64Image, cacheKey, false, duration
            );
            
            logger.info("Image generated successfully in {}ms", duration);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error generating preview", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erro ao gerar preview: " + e.getMessage()));
        }
    }
}
