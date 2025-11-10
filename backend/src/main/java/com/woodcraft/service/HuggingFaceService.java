package com.woodcraft.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class HuggingFaceService {
    
    private static final Logger logger = LoggerFactory.getLogger(HuggingFaceService.class);
    
    @Value("${huggingface.api.token}")
    private String apiToken;
    
    @Value("${huggingface.api.url}")
    private String apiUrl;
    
    private final RestTemplate restTemplate;
    
    public HuggingFaceService() {
        this.restTemplate = new RestTemplate();
    }
    
    public byte[] generateImage(String prompt) {
        logger.info("Generating image with prompt: {}", prompt);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(java.util.Collections.singletonList(MediaType.IMAGE_PNG));
        headers.set("Authorization", "Bearer " + apiToken);
        
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("inputs", prompt);
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        
        try {
            ResponseEntity<byte[]> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                entity,
                byte[].class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                logger.info("Image generated successfully, size: {} bytes", response.getBody().length);
                return response.getBody();
            } else {
                logger.error("Failed to generate image, status: {}", response.getStatusCode());
                throw new RuntimeException("Failed to generate image from Hugging Face API");
            }
        } catch (Exception e) {
            logger.error("Error calling Hugging Face API", e);
            throw new RuntimeException("Error generating image: " + e.getMessage(), e);
        }
    }
}
